import OracleDB from "oracledb";
import { config } from "dotenv";

config();

const getConnConfig = () => {
  let user = "";
  let password = "";
  let connectionString = "";
  if (process.env.COMPANY === "MAYFAIR_TEST") {
    user = process.env.MAYFAIR_TEST_USER;
    password = process.env.MAYFAIR_TEST_PASSWORD;
    connectionString = process.env.MAYFAIR_TEST_CONN_STRING;
  } else if (process.env.COMPANY === "INTRA") {
    user = process.env.INTRA_USER;
    password = process.env.INTRA_PASSWORD;
    connectionString = process.env.INTRA_CONN_STRING;
  } else if (process.env.COMPANY === "MAYFAIR_PROD") {
    user = process.env.MAYFAIR_USER;
    password = process.env.MAYFAIR_PASSWORD;
    connectionString = process.env.MAYFAIR_CONN_STRING;
  }
  return { user, password, connectionString };
};

const { user, password, connectionString } = getConnConfig();

export const pool = OracleDB.createPool({
  user: user,
  password: password,
  connectionString: connectionString,
  poolMin: 5,
  poolMax: 100,
  poolIncrement: 5,
});

export default pool;
