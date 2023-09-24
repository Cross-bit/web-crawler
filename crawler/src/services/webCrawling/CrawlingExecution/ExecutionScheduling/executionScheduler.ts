import {
	ExecutionData,
	ExecutionDataWithRecord,
	ExecutionsDataFilter,
	IDatabaseWrapper,
	RecordData,
} from "../../../../database/interface";
import cron, { ScheduledTask } from "node-cron";
import ExecutionsRecord from "../executionRecord";
import IExecutionsScheduler, { IExecutionQueuesManager } from "../../interface";
import CrawlingExecutor from "../../CrawlingExecution/CrawlingExecutor"
import { executionState } from "../../../../utils/enums";
import EventEmitter from "events";
import ExecutionQueuesManager from "./executionQueueManager";
import { Console } from "console";


type ScheduledExecution =
{
	originalExecutionData: ExecutionDataWithRecord;
	scheduledCronTask: ScheduledTask;
}

/**
 * TODO: description
 */
export default class ExecutionsScheduler implements IExecutionsScheduler {
	/**
	 * Maps record id to its execution queue
	 */
	private executionQManager: IExecutionQueuesManager;

	/**
	 * interface for accessing database(data-access) layer
	 */
	private database: IDatabaseWrapper;

	/**
	 * Executes executions planned in the execution queues
	 */
	private executor: CrawlingExecutor;

	/**
	 * Maps executions to their cron scheduling task
	 */
	private cronPlannedExecutions: Map<number, ScheduledExecution>;

	/**
	 * List of records that are currently in execution. Maps record id, to record data
	 */
	private recordsInTimedExecution: Set<number>;

	/**
	 * Event to inform subscribers(logging service, user information service...) about current stage of scheduling.
	 */
	public SchedulingStageEmitter = new EventEmitter();

	constructor(
		executor: CrawlingExecutor,
		executionDatabase: IDatabaseWrapper,
		executinoQueueManager: IExecutionQueuesManager
	) {
		this.executionQManager = new ExecutionQueuesManager();
		this.cronPlannedExecutions = new Map();
		this.database = executionDatabase;
		this.executionQManager = executinoQueueManager;
		this.recordsInTimedExecution = new Set();
		this.executor = executor;
		this.executor.ExecutionState.on("executionDone", this.ExecutionDoneCallback.bind(this))
		this.executor.ExecutionState.on("executionCanceled", (canceledExecution: ExecutionDataWithRecord) => {
			this.OnExecutionDataChanged(canceledExecution, executionState.CANCELED);
		})
		this.executor.ExecutionState.on("executionRunning", (canceledExecution: ExecutionDataWithRecord) => {
			this.OnExecutionDataChanged(canceledExecution, executionState.RUNNING);
		})

		
	}

	public async CreateNewExecutionForRecord(
		recordData: RecordData,
		isTimed: boolean
	) {
		// we only want single timed execution per record
		if (isTimed && this.recordsInTimedExecution.has(recordData.id)) {
			console.log("here we ended " + recordData.id);
			return;
		}
		else if(isTimed)
			this.recordsInTimedExecution.add(recordData.id);


		const executionData: ExecutionDataWithRecord = {
			creation: new Date(),
			executionStart: null,
			realExecutionStart: null,
			executionDuration: 0,
			state: executionState.CREATED,
			isTimed: isTimed,
			record: recordData,
		};

		// set execution start(the creation) time TODO: add also real execution start time
		executionData.executionStart = new Date(
			this.CalculateNextExecutionTime(executionData)
		);

		// create execution in db
		executionData.id =
			await this.database.ExecutionDatabase?.insertExecution({
				...executionData,
				recordId: recordData.id,
			} as ExecutionData);

		this.OnExecutionDataChanged(executionData, executionState.CREATED);

		// plan execution timer
		isTimed
			? await this.SetExecutionWaiting(executionData) 
			: this.PlanExecutionCallback(executionData);
	}

	public async OnExecutionDataChanged(executionData: ExecutionDataWithRecord, newExecutionState: executionState) {	
		this.SchedulingStageEmitter.emit("ExecutionStateChanged", executionData, newExecutionState);
	}

	/**
	 * On application start.
	 * @returns
	 */
	public async SynchronizeData() {
		const filter: ExecutionsDataFilter = {
			state: [
				executionState.CREATED,
				executionState.PLANNED,
				executionState.RUNNING,
				executionState.WAITING,
			]
		}; // TODO: do this also for untimed ??

		// first we cancle all incomplete executions => set the proper state in database
		const allUnfinishedExecutions =
			await this.database.ExecutionDatabase?.UpdateExecutionsState(
				executionState.INCOMPLETE,
				filter
			);

		// a record can have only single timed execution at the time!... otherwise I did smth wrong...

		// second we reschedule all timed records
		const allRecords = await this.database.RecordsDatabase?.GetAllRecords();
				
		allRecords?.forEach((recordData) => {

		
			if (recordData.active) // active is same as asking isTimed
			{
				console.log("replanning executions for: " + recordData.id);
				this.CreateNewExecutionForRecord(recordData, true);
			}

		})	

		// simply replan all the executions ... TODO: do this more sofisticated??
	}

	private ExecutionDoneCallback(executionRecord: ExecutionDataWithRecord) {

		if (executionRecord.isTimed) { // replan timed execution
			this.recordsInTimedExecution.delete(executionRecord.record.id);
			this.CreateNewExecutionForRecord(executionRecord.record, executionRecord.isTimed);
		}
		
		// announce all listeners the new state of this execution record
		this.OnExecutionDataChanged(executionRecord, executionState.DONE);
	}


	public async CancleTimedExecutionsForRecord(recordId: number) {

		const recordExecutions = 
			await this.database.ExecutionDatabase?.GetExecutionsWithRecord({
				isTimed: true,
				recordId: [recordId],
				state: [
					executionState.CREATED,
					executionState.PLANNED,
					executionState.RUNNING,
					executionState.WAITING
				]
			});

		console.log("canceling executions for record: " + recordId);
		console.log(recordExecutions);
		
		this.recordsInTimedExecution.delete(recordId);
		
		recordExecutions?.forEach(async (execution) => {
			console.log("execution id: " + execution.id);
			if (execution.id) {
				const canceledExecutions = await this.database.ExecutionDatabase?.UpdateExecutionsState(
					executionState.CANCELED, { executionIDs: [execution.id] } ) as ExecutionDataWithRecord[];

				this.OnExecutionDataChanged(canceledExecutions[0], executionState.CANCELED)
			

				if (this.cronPlannedExecutions.has(execution.id)) { // if job was waiting
					const executionData = this.cronPlannedExecutions.get(execution.id);
					executionData?.scheduledCronTask.stop();
					this.cronPlannedExecutions.delete(execution.id);
				}
				else // already is executing // TODO: remove crawled data.
				{
					this.executor.ForceCancleExecutionById(execution.id);
				}
			}
		});
	}

	/**
	 * For Periodicall executions, sets system timer for particular time in the future.
	 * @param executionData
	 */
	private async SetExecutionWaiting(executionData: ExecutionDataWithRecord) {
		if (
			!executionData.record.id ||
			!executionData.id ||
			!executionData.isTimed ||
			!executionData.executionStart
		)
			return; // TODO: handle error better

		console.log("execution set waiting");
		// create cron timer
		const executionTime = executionData.executionStart;

		const cronExpression = this.CalculateCronExpression(executionTime);

		const cronTask: ScheduledTask = cron.schedule(cronExpression, () =>
			this.PlanExecutionCallback(executionData)
		);

		this.cronPlannedExecutions.set(executionData.id, { originalExecutionData: executionData, scheduledCronTask: cronTask });

		// update db state:
		const updatedExecution = await this.database.ExecutionDatabase?.UpdateExecutionsState(
			executionState.WAITING,
			{ executionIDs: [executionData.id] }
		) as ExecutionDataWithRecord[];

		this.OnExecutionDataChanged(updatedExecution[0], executionState.WAITING);
	}

	/**
	 * Plans execution to the execution queue (Is supposed to be raised by a timer when the time has come)
	 * @param originalExecution - Original execution data when callback was set.
	 * @returns
	 */
	private async PlanExecutionCallback(
		originalExecution: ExecutionDataWithRecord
	) {
		console.log("awaken!!! " + originalExecution.id);
		const dbExecutionFilter = {
			executionIDs: [originalExecution.id as number],
		};

		// we verify coherency with database data:
		const currentExecution =
			((await this.database.ExecutionDatabase?.GetExecutionsWithRecord(
				dbExecutionFilter
			)) || [undefined])[0] as ExecutionDataWithRecord;
		
		
		if (!currentExecution) {
			return; // the execution record doesnt exist anymore!! we should inform user... TODO: throw error
		}

		if (!currentExecution.record) {
			// if record doesnt exist but the execution record does => inconsistent state inform user(to delete executions, etc.)...TODO:
			return;
		}

		if (!currentExecution.record.active && currentExecution.isTimed) {
			// is timed but record is no longer active => is should not be scheduled...
			await this.database.ExecutionDatabase?.UpdateExecutionsState(
				executionState.CANCELED,
				{ executionIDs: [currentExecution.id as number] }
			);
			return;
		}

		this.PlanExecutionToQueue(currentExecution);

		// set record as planned (in queue)
		const { ExecutionDatabase } = this.database;
		const updatedExecutinons = await ExecutionDatabase?.UpdateExecutionsState(
			executionState.PLANNED,
			dbExecutionFilter
		) as ExecutionDataWithRecord[];

		this.OnExecutionDataChanged(updatedExecutinons[0], executionState.PLANNED);
	}

	/**
	 * Plans execution to execution queue, so it can be exectuted by some crawler, 
	 * ASAP based on the QManagers execution policy.
	 * 
	 * @param executionData 
	 */
	private PlanExecutionToQueue(executionData: ExecutionDataWithRecord) {
		try {
			const executionRecord = new ExecutionsRecord(
				executionData.record.id,
				executionData.id as number,
				executionData.isTimed,
				executionData.executionStart as Date
			);

			this.executionQManager.InsertExecutionRecord(executionRecord);
		} catch (err) {
			// todo: handle error
		}
	}

	/**
	 * Finds next execution time based on periodicity in record and the execution start.
	 * @param executionData Execution and record data to calculate time for.
	 * @returns Next time of executions in minutes relative to Unix epoch.
	 */
	private CalculateNextExecutionTime(
		executionData: ExecutionDataWithRecord
	): number {
		let timeDifference = executionData.record.periodicity_day * 24 * 60;
		timeDifference += executionData.record.periodicity_hour * 60;
		timeDifference += executionData.record.periodicity_min;
		timeDifference *= 60 * 1000; // Convert minutes to miliseconds

		if (!executionData.executionStart) // replaning new execution
			return new Date().getTime() + timeDifference;


		// TODO: !!! set this not from execution start but from execution end!!!!

		return executionData.executionStart.getTime() + timeDifference; // replanning new execution
	}

	/** // TODO: move somewhere else?
	 * Converts Date object to cron timing string
	 * @param dateTime
	 * @returns
	 */
	private CalculateCronExpression(dateTime: Date): string {
		//dateTime = new Date();
		// TODO: remove mockup !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
		// for testing purposes, so the execution starts immediatelly!!!

		const minute = dateTime.getMinutes();
		const hour = dateTime.getHours();
		const dayOfMonth = dateTime.getDate();
		const month = dateTime.getMonth() + 1; // months are zero based
		const dayOfWeek = dateTime.getDay();
		const seconds = (dateTime.getSeconds() + 5) % 59;

		

		return `${seconds} ${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
	}
	
}
