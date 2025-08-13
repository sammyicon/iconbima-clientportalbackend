import OracleDB from "oracledb";
import pool from "../../config/oracledb-connect.js";
import { getPolicyDocumentsReports } from "../../config/report-config.js";
import stringify from "safe-stable-stringify";

class PolicyController {
  async getPolicies(req, res) {
    let connection;
    let results;
    try {
      const { intermediaryCode, clientCode, fromDate, toDate, p_asat_dt } =
        req.body;

      connection = (await pool).getConnection();
      console.log("Database is connected");
      if (
        intermediaryCode === "15" ||
        intermediaryCode === "70" ||
        intermediaryCode === "25"
      ) {
        results = (await connection).execute(
          `/* Formatted on 3/12/2025 10:57:32 AM (QP5 v5.336) */
  SELECT b.AI_REGN_NO
             reg_no,
         pl_no,
         PL_END_NO,
         PL_STATUS,
         PKG_UW.GET_PRODUCT_NAME (a.PL_ORG_CODE, pl_pr_code)
             product,
         pl_fm_dt,
         PL_TO_DT,
         PKG_SYSTEM_ADMIN.GET_ENTITY_NAME (pl_int_aent_code, pl_int_ent_code)
             intermediary,
         PKG_SYSTEM_ADMIN.GET_ENTITY_NAME (pl_assr_aent_code, pl_assr_ent_code)
             client,
         pl_index,
         pl_end_index,
         PL_PR_CODE,
         a.PL_GL_DATE
    FROM uh_policy a LEFT JOIN ai_vehicle b ON b.AI_PL_INDEX = a.pl_index -- ✅ Changed to LEFT JOIN
   WHERE     PL_INT_AENT_CODE = :intermediaryCode
         AND pl_int_ent_code = :clientCode
         AND pl_status IN ('Active', 'Canceled')
         AND (   ( :fromDate IS NULL AND :toDate IS NULL)
              OR TRUNC (a.PL_GL_DATE) BETWEEN TRUNC ( :fromDate)
                                          AND TRUNC ( :toDate))
ORDER BY pl_gl_date DESC`,
          {
            intermediaryCode,
            clientCode,
            fromDate: new Date(fromDate),
            toDate: new Date(toDate),
          },
          { outFormat: OracleDB.OUT_FORMAT_OBJECT }
        );
      } else {
        results = (await connection).execute(
          `/* Formatted on 3/12/2025 10:57:32 AM (QP5 v5.336) */
  SELECT b.AI_REGN_NO
             reg_no,
         pl_no,
         PL_END_NO,
         PL_STATUS,
         PKG_UW.GET_PRODUCT_NAME (a.PL_ORG_CODE, pl_pr_code)
             product,
         pl_fm_dt,
         PL_TO_DT,
         PKG_SYSTEM_ADMIN.GET_ENTITY_NAME (pl_int_aent_code, pl_int_ent_code)
             intermediary,
         PKG_SYSTEM_ADMIN.GET_ENTITY_NAME (pl_assr_aent_code, pl_assr_ent_code)
             client,
         pl_index,
         pl_end_index,
         PL_PR_CODE,
         a.PL_GL_DATE
    FROM uh_policy a LEFT JOIN ai_vehicle b ON b.AI_PL_INDEX = a.pl_index -- ✅ Changed to LEFT JOIN
   WHERE     PL_INT_AENT_CODE = :intermediaryCode
         AND pl_int_ent_code = :clientCode
         AND pl_status IN ('Active', 'Canceled')
         AND (   ( :fromDate IS NULL AND :toDate IS NULL)
              OR TRUNC (a.PL_GL_DATE) BETWEEN TRUNC ( :fromDate)
                                          AND TRUNC ( :toDate))
ORDER BY pl_gl_date DESC`,
          {
            intermediaryCode,
            clientCode,
            fromDate: new Date(fromDate),
            toDate: new Date(toDate),
          },
          { outFormat: OracleDB.OUT_FORMAT_OBJECT }
        );
      }
      const formattedData = (await results).rows.map((row) => ({
        ...row,
        reportUrl: getPolicyDocumentsReports(
          row.PL_INDEX,
          row.PL_INDEX,
          row.PL_END_INDEX
        ),
      }));

      return res.status(200).json({ results: formattedData });
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
  async getRunningPolicies(req, res) {
    let connection;
    let results;
    try {
      const { intermediaryCode, clientCode, p_asat_dt } =
        req.body;

      connection = (await pool).getConnection();
      console.log("Database is connected");
      if (
        intermediaryCode === "15" ||
        intermediaryCode === "70" ||
        intermediaryCode === "25"
      ) {
        results = (await connection).execute(
          `/* Formatted on 3/13/2025 8:33:56 AM (QP5 v5.336) */
  SELECT b.AI_REGN_NO
             reg_no,
         pl_no,
         PL_END_NO,
         PL_STATUS,
         PKG_UW.GET_PRODUCT_NAME (a.PL_ORG_CODE, pl_pr_code)
             product,
         pl_fm_dt,
         PL_TO_DT,
         PKG_SYSTEM_ADMIN.GET_ENTITY_NAME (pl_int_aent_code, pl_int_ent_code)
             intermediary,
         PKG_SYSTEM_ADMIN.GET_ENTITY_NAME (pl_assr_aent_code, pl_assr_ent_code)
             client,
         pl_index,
         pl_end_index,
         PL_PR_CODE,
         a.PL_GL_DATE
    FROM uh_policy a LEFT JOIN ai_vehicle b ON b.AI_PL_INDEX = a.pl_index -- ✅ Changed to LEFT JOIN
   WHERE     PL_INT_AENT_CODE = :intermediaryCode
         AND pl_int_ent_code = :clientCode
         AND pl_status IN ('Active', 'Canceled')
         AND TRUNC (a.PL_TO_DT) >= NVL ( :p_asat_dt, TRUNC (a.PL_TO_DT))
ORDER BY pl_gl_date DESC`,
          {
            intermediaryCode,
            clientCode,
            p_asat_dt: new Date(p_asat_dt),
          },
          { outFormat: OracleDB.OUT_FORMAT_OBJECT }
        );
      } else {
        results = (await connection).execute(
          `/* Formatted on 3/13/2025 8:33:56 AM (QP5 v5.336) */
  SELECT b.AI_REGN_NO
             reg_no,
         pl_no,
         PL_END_NO,
         PL_STATUS,
         PKG_UW.GET_PRODUCT_NAME (a.PL_ORG_CODE, pl_pr_code)
             product,
         pl_fm_dt,
         PL_TO_DT,
         PKG_SYSTEM_ADMIN.GET_ENTITY_NAME (pl_int_aent_code, pl_int_ent_code)
             intermediary,
         PKG_SYSTEM_ADMIN.GET_ENTITY_NAME (pl_assr_aent_code, pl_assr_ent_code)
             client,
         pl_index,
         pl_end_index,
         PL_PR_CODE,
         a.PL_GL_DATE
    FROM uh_policy a LEFT JOIN ai_vehicle b ON b.AI_PL_INDEX = a.pl_index -- ✅ Changed to LEFT JOIN
   WHERE     PL_INT_AENT_CODE = :intermediaryCode
         AND pl_int_ent_code = :clientCode
         AND pl_status IN ('Active', 'Canceled')
         AND TRUNC (a.PL_TO_DT) >= NVL ( :p_asat_dt, TRUNC (a.PL_TO_DT))
ORDER BY pl_gl_date DESC`,
          {
            intermediaryCode,
            clientCode,
            p_asat_dt: new Date(p_asat_dt),
            
          },
          { outFormat: OracleDB.OUT_FORMAT_OBJECT }
        );
      }
      const formattedData = (await results).rows.map((row) => ({
        ...row,
        reportUrl: getPolicyDocumentsReports(
          row.PL_INDEX,
          row.PL_INDEX,
          row.PL_END_INDEX
        ),
      }));
      return res.status(200).json(({ results: formattedData }));
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
  async getProducts(req, res) {
    let connection;
    let results;
    try {
      console.log(req.body);
      connection = (await pool).getConnection();
      console.log("Database is connected");

      results = (await connection).execute(
        `select pr_code,pr_name from uw_products where pr_enabled='Y'`
      );

      if ((await results).rows && (await results).rows.length > 0) {
        const formattedData = (await results).rows?.map((row) => ({
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
