const { Pool, PoolClient } = require('pg');

const pool = new Pool({
    user: 'root',
    host: 'localhost',
    database: 'web_crawler',
    password: 'toor',
    port: 5432,
});

const getErrorsQuery = async (client, nodeIds) => {
    const queryObj = {
        text: `SELECT * FROM node_errors WHERE node_id = ANY($1)`,
        values: [nodeIds]
    }

    const queryRes = await client.query(queryObj);

    return Promise.resolve(queryRes.rows);
}

const getNodesByRecordIdQuery2 = async (client, recordId) => 
{
    const queryObj = {
        text: `SELECT * FROM nodes WHERE record_id = ANY($1)`,
        values: [recordId]
    }

    const queryRes = await client.query(queryObj);
    
    let res = queryRes.rows.map(queriedRow => ({
        id: queriedRow.id,
        title: queriedRow.title,
        url: queriedRow.url,
        crawlTime: queriedRow.crawl_time,
        recordId: queriedRow.record_id,
        errors: []
    }))

 //   console.log(queryRes.rows);
    return Promise.resolve(res);
}

const getNodesByRecordIdQuery1 = async (client, recordId) => 
{
    const queryObj = {
        text: `SELECT nodes.*, node_errors.id as error_id, node_errors.crawling_code 
               FROM nodes JOIN node_errors ON nodes.id = node_errors.node_id WHERE record_id = ANY($1)`,
        values: [recordId]
    }

    const queryRes = await client.query(queryObj);
    const nodesMap = new Map();

    const result = {};
    for (let i = 0; i < queryRes.rows.length; i++) {
      const row = queryRes.rows[i];
      if (!result[row.id]) {
        result[row.id] = {
          id: row.id,
          title: row.title,
          url: row.url,
          crawlTime: row.crawl_time,
          recordId: row.record_id,
          errors: [],
        };
      }
      if (row.error_id) {
        result[row.id].errors.push(row.crawling_code);
      }
    }
    const finalResult = Object.values(result);

    //console.log(Array.from(nodesMap.values()));
    return Promise.resolve(finalResult);
}

const getNodesByRecordIdQuery3 = async (client, recordIds) => {
    const queryObj = {
        text: `SELECT nodes.*, 
                json_agg(node_errors.crawling_code) as errors 
                FROM nodes 
                JOIN node_errors ON nodes.id = node_errors.node_id 
                WHERE record_id = ANY($1)
                GROUP BY nodes.id;`,
        values: [ recordIds]
    }

    const queryRes = await client.query(queryObj);
    
    const records = queryRes.rows.map(row => ({
        id: row.id,
        title: row.title,
        url: row.url,
        crawlTime: row.crawl_time,
        recordId: row.record_id,
        errors: row.errors
    }));

    console.log(records.length);
    return Promise.resolve(queryRes);
}



// tests
// before testing insert appropirate values

recordIds = [1]



// 2 queries and combine
const scenario1 = async () => {
    const client = await pool.connect();
    const nodes = await getNodesByRecordIdQuery2(client, [recordIds]);

    const dictionary = new Map();
    for (const obj of nodes) {
        const { id, ...rest } = obj;
        dictionary.set(id, rest);
    }

    const nodeIds = nodes.map(node => node.id);

    const errors = await getErrorsQuery(client, nodeIds);

    errors.forEach(error => {
        dictionary.get(error.node_id).errors.push(error);
    });

    console.log(dictionary.size);

}

// single query join
const scenario2 = async () => {
    const client = await pool.connect();
    const res = await getNodesByRecordIdQuery1(client, recordIds);

    console.log(res.length);
}

// single query
const scenario3 = async () => {
    const client = await pool.connect();
    await getNodesByRecordIdQuery3(client, [1]);
    
    
}

const execution = async () =>{
    const startTime = performance.now();
    const res1 = await scenario1();
    const endTime = performance.now();
    console.log(`Scen1 Time taken: ${endTime - startTime} milliseconds`);

    const startTime2 = performance.now();
    await scenario2();
    const endTime2 = performance.now();
    console.log(`Scen2 Time taken: ${endTime2- startTime2} milliseconds`);

    
    const startTime3 = performance.now();
    await scenario3();
    const endTime3 = performance.now();
    console.log(`Scen3 Time taken: ${endTime3- startTime3} milliseconds`);
}

execution();