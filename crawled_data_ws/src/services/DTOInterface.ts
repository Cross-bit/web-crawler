import { ExecutionNode, ExecutionNodeConnection } from "../database/interface"


export default interface INewGraphDataDTO
{
    recordId: number,
    currentExecutionId: number,
    isFullyNew: boolean,
    nodesData: ExecutionNode[],
    edgesData: ExecutionNodeConnection[]
}
