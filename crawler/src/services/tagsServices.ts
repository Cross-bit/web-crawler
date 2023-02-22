import * as db from '../database/hasuraAPI/tagsDatabase'
import * as db2 from '../database/postgress/tagsDatabase'

export const getAllTags = () => {
    return db.getAllTags();
}


export const getAllTagsByRecordId = async (recordId:number) => {
    // todo: handle error properly
   const result = await db2.getAllTagsByRecordId(recordId)

    return result;
}


export const createNewTag = (tagName: string) => {

    return db.getCountOfValuesWithTagName(tagName).then(({tags_aggregate: { aggregate }}) => {

        if (aggregate?.count != 0){
            console.log("fail here");
            throw new Error("Tag already exists!");
        }

        return db.insertOneTag(tagName);

    }).catch((error)=>{
        console.log("error:" + error) // todo: remove
        throw (error);
    })
}


