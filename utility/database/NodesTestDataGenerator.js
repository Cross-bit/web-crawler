const { Pool } = require('pg');

const pool = new Pool({
  user: 'root',
  host: 'localhost',
  database: 'web_crawler',
  password: 'toor',
  port: 5432,
});

async function insertNodeErrors() {

  errCodes = ['ok', 'regex', 'extension', 'invalid_uri'];
  const client = await pool.connect();
  try {
    // iterate through all the nodes and generate random number of errors
    for (let i = 800; i <= 3000; i++) {
      const numErrors = Math.floor(Math.random() * 4) + 1; // generate random number of errors (between 1 and 4)

      // generate and execute INSERT statements for each error
      for (let j = 0; j < numErrors; j++) {
        console.log(i);
        const valuesArr = [i, errCodes[Math.floor(Math.random() * 4)]]; // use Math.random() to generate random error code (between 0 and 3)
        const query = {
          text: 'INSERT INTO node_errors (node_id, crawling_code) VALUES ($1, $2)',
          values: valuesArr,
        };
        await client.query(query);
      }
    }
  } finally {
    client.release();
  }
}

async function insertNodes() {
  const client = await pool.connect();
  try {
    for (let i = 1; i <= 5000; i++) {
      const title = `title ${i}`;
      const url = `http://example.com/${i}`;
      const crawlTime = '2022-01-01 12:00:00';
      const recordId = 1; // assuming there's only one record in the records table
      console.log(i);
      // generate and execute INSERT statement for each node
      const query = {
        text:
          'INSERT INTO nodes (title, url, crawl_time, record_id) VALUES ($1, $2, $3, $4)',
        values: [title, url, crawlTime, recordId],
      };
      await client.query(query);
    }
  } finally {
    client.release();
  }
}

// call the functions to insert data
insertNodes();
insertNodeErrors();