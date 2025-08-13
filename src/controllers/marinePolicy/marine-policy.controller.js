import OracleDB from "oracledb";
import pool from "../../config/oracledb-connect.js";

export class MarinePolicyService {
  static async getTradeTypes(req, res) {
    let connection;
    try {
      connection = (await pool).getConnection();
      if (connection) {
        console.log("connected to the database");
      }
      const results = (await connection).execute(
        `SELECT SYS_CODE,SYS_NAME FROM  ad_system_codes WHERE sys_type = 'MarineTypes' AND SYS_ENABLED = 'Y'`,
        [],
        { outFormat: OracleDB.OUT_FORMAT_OBJECT }
      );
      return res.status(200).json({ results: (await results).rows });
    } catch (error) {
      console.error("error getting trade types", error);
      return res.status(500).json(error);
    } finally {
      if (connection) {
        (await connection).release();
        console.log("connection closed success");
      }
    }
  }
  static async getShippingMethods(req, res) {
    let connection;
    try {
      connection = (await pool).getConnection();
      if (connection) {
        console.log("connected to the database");
      }
      const results = (await connection).execute(
        `SELECT SYS_CODE,SYS_NAME FROM AD_SYSTEM_CODES WHERE SYS_TYPE = 'SHIPPING_METHODS' AND SYS_ENABLED = 'Y'`,
        [],
        { outFormat: OracleDB.OUT_FORMAT_OBJECT }
      );
      return res.status(200).json({ results: (await results).rows });
    } catch (error) {
      console.error("error getting shipping methods", error);
      return res.status(500).json(error);
    } finally {
      if (connection) {
        (await connection).release();
        console.log("connection closed success");
      }
    }
  }

  static async getCountries(req, res) {
    let connection;
    try {
      const { sys_grouping } = req.query;
      connection = (await pool).getConnection();
      if (connection) {
        console.log("connected to the database");
      }
      const results = (await connection).execute(
        `SELECT SYS_CODE, SYS_NAME
  FROM ad_system_codes
 WHERE     SYS_TYPE = 'ALL_PORTS'
       AND SYS_ENABLED = 'Y'
       AND SYS_GROUPING = NVL ( :sys_grouping, SYS_GROUPING)`,
        { sys_grouping },
        { outFormat: OracleDB.OUT_FORMAT_OBJECT }
      );
      return res.status(200).json({ results: (await results).rows });
    } catch (error) {
      console.error("error getting countries", error);
      return res.status(500).json(error);
    } finally {
      if (connection) {
        (await connection).release();
        console.log("connection closed success");
      }
    }
  }

  static async getCountryPorts(req, res) {
    let connection;
    try {
      const { sys_grouping } = req.query;
      connection = (await pool).getConnection();
      if (connection) {
        console.log("connected to the database");
      }
      const results = (await connection).execute(
        `SELECT SYS_CODE, SYS_NAME
  FROM ad_system_codes
 WHERE     SYS_TYPE = 'ALL_PORTS'
       AND SYS_ENABLED = 'Y'
       AND SYS_GROUPING = NVL ( :sys_grouping, SYS_GROUPING)`,
        { sys_grouping },
        { outFormat: OracleDB.OUT_FORMAT_OBJECT }
      );
      return res.status(200).json({ results: (await results).rows });
    } catch (error) {
      console.error("error getting countries", error);
      return res.status(500).json(error);
    } finally {
      if (connection) {
        (await connection).release();
        console.log("connection closed success");
      }
    }
  }
}
