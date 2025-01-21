import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: "postgres", // update with environment variables.
  password: "Pass@PoSt",
  host: "localhost",
  port: 5432,
  database: "game_store",
});

export default pool;
