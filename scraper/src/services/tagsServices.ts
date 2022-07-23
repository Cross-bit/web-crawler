import * as db from '../database/tagsDatabase'

export const getAllTags = () => {
    return db.getAllTags();
}

export const createNewTag = (tagName: string) => {

    return db.getCountOfValuesWithTagName(tagName).then(({tags_aggregate: { aggregate }}) => {

        if (aggregate?.count != 0){
            console.log("fail here");
            throw new Error("Tag already exists!");
        }

        return db.insertOneTag(tagName);

    }).catch((error)=>{
        console.log("tu2:" + error)
        throw (error);
    })
}


