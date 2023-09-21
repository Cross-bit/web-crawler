import { GetAllEdgesByRecordIds, GetNodesByRecordIdsQuery as GetNodesByRecordIds } from '../../database/postgress/graphDataDatabase'
import { GetAllRecordsWithTags, GetAllRecordsWithTagsByNodeIds } from '../../database/postgress/recordsDatabase'
import graphqlT  from '../../v1/graphql/graphqlTypes'


// BIG NOTE: WebPage === Record !!!

export async function GetAllWebPages()
{
    const records = await GetAllRecordsWithTags();

    const result = records.map((record) => ({
        identifier: record.id,
        label: record.label,
        url: record.url,
        regexp: record.boundary,
        tags: record.tags.map((tag) => tag.name),
        active: record.active
    }));
    
    return result;
}


export async function GetAllWebPagesByIds(recordIds: number[])
{
    const records = await GetAllRecordsWithTagsByNodeIds(recordIds);

    const result = records.map((record) => ({
        identifier: record.id,
        label: record.label,
        url: record.url,
        regexp: record.boundary,
        tags: record.tags.map((tag) => tag.name),
        active: record.active
    }));
    
    return result;
}


export async function GetAllNodesDataByRecordIds(recordIds: number[])
{
    const records = await GetAllRecordsWithTagsByNodeIds(recordIds);
    const nodes = await GetNodesByRecordIds(recordIds);
    const edges = await GetAllEdgesByRecordIds(recordIds);

    const qlRecordsMap = new Map<number, graphqlT.WebPage>();

    records.forEach((record) => {

        const qlRecord: graphqlT.WebPage = {
            identifier: record.id,
            label: record.label,
            url: record.url,
            regexp: record.boundary,
            tags: record.tags.map((tag) => tag.name),
            active: record.active
        }

        qlRecordsMap.set(record.id, qlRecord);
    })
    
    const graph = new Map<number, graphqlT.Node>();

    nodes.forEach((node) => {

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
        edges.forEach((edge) => {
            const { NodeIdFrom, NodeIdTo } = edge;
    
            const qlNodeFrom = graph.get(NodeIdFrom) as graphqlT.Node;
            const qlNodeTo = graph.get(NodeIdTo) as graphqlT.Node;
    
            
            qlNodeFrom?.links.push(qlNodeTo);
        });

    }
    catch (Error)
    {
        console.error('Building graphs in graphql Error failed with error: ' + Error); //TODO: write properly
    }

    
            
    return graph.values();

}

