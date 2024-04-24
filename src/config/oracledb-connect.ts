import OracleDB from "oracledb";

export const pool = OracleDB.createPool({
  user: "ICON",
  password: "B1MA",
  connectionString: "192.168.0.126:1527/BIMA19C",
  poolMin: 5,
  poolMax: 100,
  poolIncrement: 5,
});
export default pool;
