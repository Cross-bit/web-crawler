import * as graphql from '../database/GraphqlClient'


export const getAllRecords = async () => {
    return await graphql.getAllRecords();
};

export const getOneRecord = async (id: number) => {
    return await graphql.getOneRecord(id);
};

export const updateOneRecord = async (id: number) => {
    return "todo";
};

export const createNewRecord = async (id: number) => {
    return "todo tohle bude nejnáročnější část";
};

export const deleteOneRecord = async (id: number) => {
    return await graphql.deleteOneRecord(id);
};