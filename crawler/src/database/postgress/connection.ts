import { Pool } from "pg"

// Db connection
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: +(process.env.POSTGRES_PORT || 5432),
    max: 20 // TODO: env variable
});

//console.log("created")


export default async (text: string, params?: any[]) => await pool.query(text, params)