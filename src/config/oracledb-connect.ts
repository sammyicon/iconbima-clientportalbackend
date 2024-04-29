import OracleDB from "oracledb";
import { config } from "dotenv";

config();

export const pool = OracleDB.createPool({
  user: process.env.INTRA_USER,
  password: process.env.INTRA_PASSWORD,
  connectionString: process.env.INTRA_CONN_STRING,
  poolMin: 5,
  poolMax: 100,
  poolIncrement: 5,
});
export default pool;
