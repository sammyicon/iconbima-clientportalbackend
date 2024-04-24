import { Response, Request } from "express";
import pool from "../../config/oracledb-connect";

class PolicyController {
  async getPolicies(req: Request, res: Response) {
    let connection;
    let results: any;
    try {
      const { intermediaryCode, clientCode } = req.body;
      console.log(req.body);
      connection = (await pool).getConnection();
      console.log("Database is connected");
      if (
        intermediaryCode === "15" ||
        intermediaryCode === "70" ||
        intermediaryCode === "25"
      ) {
        results = (await connection).execute(
          `SELECT pl_no,
       PL_END_NO,
       PL_STATUS,
       pl_pr_code,
       pl_fm_dt,
       PL_TO_DT,
       PKG_SYSTEM_ADMIN.GET_ENTITY_NAME(pl_int_aent_code,pl_int_ent_code) intermediary,
PKG_SYSTEM_ADMIN.GET_ENTITY_NAME(pl_assr_aent_code,pl_assr_ent_code) client
  FROM uh_policy
 WHERE     PL_INT_AENT_CODE = :intermediaryCode
       AND pl_int_ent_code = :clientCode
       AND pl_status IN ('Active', 'Canceled')`,
          { intermediaryCode, clientCode }
        );
      } else {
        results = (await connection).execute(
          `SELECT pl_no,
       PL_END_NO,
       PL_STATUS,
       pl_pr_code,
       pl_fm_dt,
       PL_TO_DT,
       PKG_SYSTEM_ADMIN.GET_ENTITY_NAME(pl_int_aent_code,pl_int_ent_code) intermediary,
PKG_SYSTEM_ADMIN.GET_ENTITY_NAME(pl_assr_aent_code,pl_assr_ent_code) client
  FROM uh_policy
 WHERE   pl_assr_aent_code = :intermediaryCode
       AND pl_assr_ent_code = :clientCode
       AND pl_status IN ('Active', 'Canceled')`,
          { intermediaryCode, clientCode }
        );
      }
      if ((await results).rows && (await results).rows.length > 0) {
        const formattedData = (await results).rows?.map((row: any) => ({
          policyNo: row[0],
          endNo: row[1],
          status: row[2],
          product: row[3],
          periodFrom: row[4],
          periodTo: row[5],
          intermediary: row[6],
          client: row[7],
        }));
        res.json({
          success: true,
          results: formattedData,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  }
}

const policyController = new PolicyController();
export default policyController;
