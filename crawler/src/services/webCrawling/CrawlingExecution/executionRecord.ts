
export default class ExecutionsRecord {
	recordID: number;
	executionID: number;
	TimeToExecute: Date | undefined;
	IsTimed: boolean;

	constructor(
		recordId: number,
		executionId: number,
		isTimed: boolean,
		executionTime: Date | undefined
	) {
		this.recordID = recordId;
		this.executionID = executionId;
		this.TimeToExecute = executionTime;
		this.IsTimed = isTimed;
	}
}
