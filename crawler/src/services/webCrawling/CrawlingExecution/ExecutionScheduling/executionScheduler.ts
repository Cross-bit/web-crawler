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
import { executionState } from "../../../../utils/enums";
import EventEmitter from "events";
import ExecutionQueuesManager from "./executionQueueManager";


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
	 * Maps executions to their cron scheduling task
	 */
	cronPlannedExecutions: Map<ExecutionDataWithRecord, ScheduledTask>;

	/**
	 * Event to inform subscribers(logging service, user information service...) about current stage of scheduling.
	 */
	public SchedulingStageEmitter = new EventEmitter();

	constructor(
		executionDatabase: IDatabaseWrapper,
		executinoQueueManager: IExecutionQueuesManager
	) {
		this.executionQManager = new ExecutionQueuesManager();
		this.cronPlannedExecutions = new Map<
			ExecutionDataWithRecord,
			ScheduledTask
		>();
		this.database = executionDatabase;
		this.executionQManager = executinoQueueManager;
	}

	public async CreateNewExecutionForRecord(
		recordData: RecordData,
		isTimed: boolean
	) {
		const executionData: ExecutionDataWithRecord = {
			creation: new Date(),
			executionStart: null,
			executionDuration: 0,
			state: executionState.CREATED,
			isTimed: isTimed,
			record: recordData,
		};

		// set init execution time
		if (executionData.isTimed)
			executionData.executionStart = new Date(
				this.CalculateNextExecutionTime(executionData)
			);

		// create execution in db
		executionData.id =
			await this.database.ExecutionDatabase?.insertExecution({
				...executionData,
				recordId: recordData.id,
			} as ExecutionData);

		// plan execution timer
		isTimed
			? await this.SetExecutionWaiting(executionData)
			: this.PlanExecutionCallback(executionData);
	}

	public async DeleteRecordExecutions() {
		// TODO: delete appropriate planning queue
	}

	/**
	 * For Periodicall executions, sets system timer for particular time in the future.
	 * @param executionData
	 */
	public async SetExecutionWaiting(executionData: ExecutionDataWithRecord) {
		if (
			!executionData.record.id ||
			!executionData.id ||
			!executionData.isTimed ||
			!executionData.executionStart
		)
			return; // TODO: handle error better

		// create cron timer
		const executionTime = executionData.executionStart;

		const cronExpression = this.CalculateCronExpression(executionTime);

		const cronTask: ScheduledTask = cron.schedule(cronExpression, () =>
			this.PlanExecutionCallback(executionData)
		);

		this.cronPlannedExecutions.set(executionData, cronTask);

		// update db state:
		await this.database.ExecutionDatabase?.UpdateExecutionsState(
			executionState.WAITING,
			{ executionIDs: [executionData.id] }
		);
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
			],
		};

		const allUnfinishedExecutions =
			await this.database.ExecutionDatabase?.UpdateExecutionsState(
				executionState.INCOMPLETE,
				filter
			);

		// simply replan all the executions ... TODO: do this more sofisticated??
	}

	/**
	 * Converts Date object to cron timing string
	 * @param dateTime
	 * @returns
	 */
	private CalculateCronExpression(dateTime: Date): string {
		dateTime = new Date();
		const minute = dateTime.getMinutes();
		const hour = dateTime.getHours();
		const dayOfMonth = dateTime.getDate();
		const month = dateTime.getMonth() + 1; // months are zero based
		const dayOfWeek = dateTime.getDay();
		const seconds = (dateTime.getSeconds() + 5) % 59;

		// TODO: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! for testing purposes!!!

		return `${seconds} ${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
	}

	/**
	 * Plans execution to the execution queue (Is supposed to be raised by a timer when the time has come)
	 * @param originalExecution Original executions data when callback was set.
	 * @returns
	 */
	private async PlanExecutionCallback(
		originalExecution: ExecutionDataWithRecord
	) {
		const dbExecutionFilter = {
			executionIDs: [originalExecution.id as number],
		};
		const currentExecution =
			((await this.database.ExecutionDatabase?.GetExecutionsWithRecord(
				dbExecutionFilter
			)) || [undefined])[0] as ExecutionDataWithRecord;

		if (!currentExecution) {
			return; // the execution record doesnt exist anymore!! we should inform user... TODO: throw error
		}

		if (!currentExecution.record) {
			// if record doesnt exist but the execution record does => inconsistent state inform user and delete executions...TODO:
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
		await ExecutionDatabase?.UpdateExecutionsState(
			executionState.PLANNED,
			dbExecutionFilter
		);
	}

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
	 * @returns Next time of executions in minutes (since 1970...).
	 */
	public CalculateNextExecutionTime(
		executionData: ExecutionDataWithRecord
	): number {
		let timeDifference = executionData.record.periodicity_day * 24 * 60;
		timeDifference += executionData.record.periodicity_hour * 60;
		timeDifference += executionData.record.periodicity_min;
		timeDifference *= 60 * 1000; // Convert minutes to miliseconds

		if (!executionData.executionStart)
			return new Date().getTime() + timeDifference;

		return executionData.executionStart.getTime() + timeDifference;
	}
}
