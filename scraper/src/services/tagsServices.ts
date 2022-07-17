import * as db from '../database/tagsDatabase'

export const getAllTags = () => {
    return db.getAllTags();
}

export const createNewTag = (tagName: string) => {
    const createdTag = db.insertOneTag(tagName);
    return createdTag;
}
