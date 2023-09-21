import { TagData} from '../../interface';
import query from "../connection"
import { PoolClient } from 'pg';



export const getAllTagsByRecordIdQuery = async (client: PoolClient, recordId: number): Promise<TagData[]> => {
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
