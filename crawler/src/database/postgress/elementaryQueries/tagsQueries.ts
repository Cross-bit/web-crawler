import { TagData, TagInsertion} from '../../interface';
import query from "../connection"
import { PoolClient } from 'pg';


/**
 * 
 * Elementary queries for tags
 * 
*/

export const getAllTagsQuery = async (client:PoolClient) => {
    const queryStr = "SELECT * FROM tags" // todo:

    const queryResult = await client.query(queryStr);

    const result: TagData[] = queryResult.rows.map((entity:any) => ({
        id: entity.id,
        name: entity.tag_name,
        color: entity.color
    }))

    return Promise.resolve(result);
}

export const getAllTagsByRecordIdQuery = async (client: PoolClient, recordId: number) => {
    const queryStr = "SELECT tag_id, tag_name, color FROM tags INNER JOIN tags_records_relations \
    ON tags.id=tags_records_relations.tag_id \
    WHERE tags_records_relations.record_id = $1";

    const queryResult = await query(queryStr, [recordId]);

    if (!queryResult.rows)
        return Promise.resolve([]);

    const result: TagData[] = queryResult.rows.map((entity: any) => ({
        id: entity.tag_id,
        name: entity.tag_name,
        color: entity.color
    }))

    return Promise.resolve(result);
}

/**
 * Inserts new tag to tags table
 * @param client pg client object
 * @param tagName new tags name
 * @returns new tag id on success
 */
export const insertNewTag = async(client: PoolClient, tagData: TagInsertion): Promise<number> => {

    const createRecordQuery = {
        text: 'INSERT INTO tags (tag_name, color) VALUES($1, $2) RETURNING id',
        values: [tagData.name, tagData.color]
    };

    const queryRes = await client.query(createRecordQuery);

    return Promise.resolve(queryRes.rows[0].id);
}