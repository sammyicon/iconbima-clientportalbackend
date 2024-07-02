import { Response, Request } from "express";
import pool from "../../config/oracledb-connect";
import { getPolicyDocumentsReports } from "../../config/report-config";

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
          `SELECT b.AI_REGN_NO reg_no,pl_no,
       PL_END_NO,
       PL_STATUS,
        PKG_UW.GET_PRODUCT_NAME(a.PL_ORG_CODE,pl_pr_code) product,
       pl_fm_dt,
       PL_TO_DT,
       PKG_SYSTEM_ADMIN.GET_ENTITY_NAME(pl_int_aent_code,pl_int_ent_code) intermediary,
PKG_SYSTEM_ADMIN.GET_ENTITY_NAME(pl_assr_aent_code,pl_assr_ent_code) client,pl_index,pl_end_index
  FROM uh_policy a, ai_vehicle b
 WHERE     PL_INT_AENT_CODE = :intermediaryCode
       AND pl_int_ent_code = :clientCode
       AND pl_status IN ('Active', 'Canceled')
       and b.AI_PL_INDEX=a.pl_index`,
          { intermediaryCode, clientCode }
        );
      } else {
        results = (await connection).execute(
          `SELECT b.AI_REGN_NO reg_no, pl_no,
       PL_END_NO,
       PL_STATUS,
      PKG_UW.GET_PRODUCT_NAME(a.PL_ORG_CODE,pl_pr_code) product,
       pl_fm_dt,
       PL_TO_DT,
       PKG_SYSTEM_ADMIN.GET_ENTITY_NAME(pl_int_aent_code,pl_int_ent_code) intermediary,
PKG_SYSTEM_ADMIN.GET_ENTITY_NAME(pl_assr_aent_code,pl_assr_ent_code) client,pl_index,pl_end_index
  FROM uh_policy a, ai_vehicle b
 WHERE   pl_assr_aent_code = :intermediaryCode
       AND pl_assr_ent_code = :clientCode
       AND pl_status IN ('Active', 'Canceled')
       and b.AI_PL_INDEX=a.pl_index`,
          { intermediaryCode, clientCode }
        );
      }

      if ((await results).rows && (await results).rows.length > 0) {
        const formattedData = (await results).rows?.map((row: any) => ({
          carRegNo: row[0],
          policyNo: row[1],
          endNo: row[2],
          status: row[3],
          product: row[4],
          periodFrom: row[5],
          periodTo: row[6],
          intermediary: row[7],
          client: row[8],
          reportUrl: getPolicyDocumentsReports(row[9], row[9], row[10]),
        }));
        res.json({
          success: true,
          results: formattedData,
        });
      } else {
        return res.status(200).json({ success: false, results: [] });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    } finally {
      try {
        if (connection) {
          (await connection).close();
          console.info("Connection closed successfully");
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
  async getProducts(req: Request, res: Response) {
    let connection;
    let results: any;
    try {
      console.log(req.body);
      connection = (await pool).getConnection();
      console.log("Database is connected");

      results = (await connection).execute(
        `select pr_code,pr_name from uw_products where pr_enabled='Y'`
      );

      if ((await results).rows && (await results).rows.length > 0) {
        const formattedData = (await results).rows?.map((row: any) => ({
          productCode: row[0],
          productName: row[1],
        }));
        res.json({
          success: true,
          results: formattedData,
        });
      } else {
        return res.status(200).json({ success: false, results: [] });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    } finally {
      try {
        if (connection) {
          (await connection).close();
          console.info("Connection closed successfully");
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}

const policyController = new PolicyController();
export default policyController;
