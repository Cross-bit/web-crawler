import { GetAllEdgesByRecordIds, GetNodesByRecordIdsQuery as GetNodesByRecordIds } from '../../database/postgress/graphDataDatabase'
import { GetAllRecordsByIds, GetAllRecordsWithTagsByNodeIds } from '../../database/postgress/recordsDatabase'
import graphqlT  from '../../v1/graphql/graphqlTypes'




export async function GetAllRecordsCrawledSameUrl(recordIds: number[]) 
{
    const recordsData = await GetAllRecordsWithTagsByNodeIds(recordIds)
    const nodesData = await GetNodesByRecordIds(recordIds)
    const edgesData = await GetAllEdgesByRecordIds(recordIds)

    const qlRecordsMap = new Map<number, graphqlT.WebPage>()

    recordsData.forEach((record) => {

        const qlRecord: graphqlT.WebPage = {
            identifier: record.id,
            label: record.label,
            url: record.url,
            regexp: record.boundary,
            tags: record.tags.map((tag) => tag.name),
            active: record.active
        }

        qlRecordsMap.set(record.id, qlRecord)
    })
    
    const graph = new Map<number, graphqlT.Node>()

    nodesData.forEach((node) => {

        const record = qlRecordsMap.get(node.recordId) as graphqlT.WebPage

        const qlNode: graphqlT.Node = {
            title: node.title,
            url: node.url,
            crawlTime: node.crawlTime.toString(),
            links: [],
            owner: record
        }

        graph.set(node.id, qlNode);

    })


    try {
        edgesData.forEach((edge) => {
            const { NodeIdFrom, NodeIdTo } = edge;
    
            const qlNodeFrom = graph.get(NodeIdFrom) as graphqlT.Node;
            const qlNodeTo = graph.get(NodeIdTo) as graphqlT.Node;
    
            
            qlNodeFrom?.links.push(qlNodeTo)
        });

    }
    catch (Error)
    {
        console.error('Building graphs in graphql Error failed with error: ' + Error); //TODO: write properly
    }

    
            
    return graph.values();

}

