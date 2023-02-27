import { Pool } from "pg"

// Db connection
export const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: +(process.env.POSTGRES_PORT || 5432),
    max: 20 // TODO: env variable
});


// this signature(defining the type of the query method) allows us to do overloads on it
type QuerySignatures = {
    (query: { text: string; values: any; }): Promise<any>;
    (query: string, params?: any[]): Promise<any>;
  };

const query:QuerySignatures = async (query, params?: any[]) => await pool.query(query, params)

export default query;