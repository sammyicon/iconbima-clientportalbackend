import {
  getARReceiptsReportConfig,
  getTaxInvoiceReportConfig,
} from "./../../config/report-config";
import { config } from "dotenv";
import { Request, Response } from "express";
import pool from "../../config/oracledb-connect";
config();
class ClaimDebitsController {
  async getClaimDebits(req: Request, res: Response) {
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
          `SELECT row_num                          rec_id,
       trn_org_code,
       trn_sys_no,
       trn_doc_type,
       trn_doc_no,
       trn_doc_gl_dt,
       trn_cur_code,
       trn_doc_fc_amt,
       trn_doc_lc_amt,
       paid_fc_amt,
       paid_lc_amt,
       trn_doc_fc_amt - paid_fc_amt     os_fc_amt,
       trn_doc_lc_amt - paid_lc_amt     os_lc_amt,
       trn_aent_code,
       trn_ent_code,
       intermediary_name_xx,
       trn_policy_no,
       trn_end_no,
       trn_narration,
       selected_xx,
       trn_policy_index,
       trn_end_index,
       pl_assr_aent_code,
       pl_assr_ent_code,
       insured_name_xx,
       vehicle_no,end_index
  FROM (  SELECT ROW_NUMBER () OVER (ORDER BY trn_sys_no)
                     AS row_num,
                 trn_org_code,
                 trn_sys_no,
                 trn_doc_type,
                 trn_doc_no,
                 TO_CHAR (TRUNC (trn_doc_gl_dt), 'Dd-Mon-RRRR')
                     trn_doc_gl_dt,
                 trn_cur_code,
                 trn_doc_fc_amt,
                 trn_doc_lc_amt,
                 TO_NUMBER (NVL (pkg_ifrs.get_total_matched_prem (
                                     trn_org_code,
                                     trn_policy_index,
                                     trn_end_index,
                                     'FC'),
                                 0))
                     paid_fc_amt,
                 TO_NUMBER (NVL (pkg_ifrs.get_total_matched_prem (
                                     trn_org_code,
                                     trn_policy_index,
                                     trn_end_index,
                                     'LC'),
                                 0))
                     paid_lc_amt,
                 trn_aent_code,
                 trn_ent_code,
                 pkg_system_admin.get_entity_name (trn_aent_code, trn_ent_code)
                     intermediary_name_xx,
                 trn_policy_no,
                 trn_end_no,
                 trn_narration,
                 'N'
                     selected_xx,
                 trn_policy_index,
                 trn_end_index,
                 pl_assr_aent_code,
                 pl_assr_ent_code,
                 pkg_system_admin.get_entity_name (pl_assr_aent_code,
                                                   pl_assr_ent_code)
                     insured_name_xx,
                 v.AI_REGN_NO
                     vehicle_no,trn_end_index end_index
            FROM gl_transactions, uw_policy, ai_vehicle v
           WHERE     trn_org_code = :org_code
                 AND pl_index = v.AI_PL_INDEX
                 AND trn_type = 'UW.003'
                 AND trn_org_code = pl_org_code
                 AND trn_policy_index = pl_index
                 AND pl_int_aent_code = NVL ( :int_aent_code, pl_int_aent_code)
                 AND pl_int_ent_code = NVL ( :int_ent_code, pl_int_ent_code)
                 AND trn_cur_code = NVL ( :cur_code, trn_cur_code)
                 AND TRUNC (trn_doc_gl_dt) >= ADD_MONTHS (TRUNC (SYSDATE), -12)
        ORDER BY gl_transactions.created_on DESC)
        
 `,
          {
            int_aent_code: intermediaryCode,
            int_ent_code: clientCode,
            org_code: "50",
            cur_code: "",
          }
        );
      } else {
        results = (await connection).execute(
          `SELECT row_num                          rec_id,
       trn_org_code,
       trn_sys_no,
       trn_doc_type,
       trn_doc_no,
       trn_doc_gl_dt,
       trn_cur_code,
       trn_doc_fc_amt,
       trn_doc_lc_amt,
       paid_fc_amt,
       paid_lc_amt,
       trn_doc_fc_amt - paid_fc_amt     os_fc_amt,
       trn_doc_lc_amt - paid_lc_amt     os_lc_amt,
       trn_aent_code,
       trn_ent_code,
       intermediary_name_xx,
       trn_policy_no,
       trn_end_no,
       trn_narration,
       selected_xx,
       trn_policy_index,
       trn_end_index,
       pl_assr_aent_code,
       pl_assr_ent_code,
       insured_name_xx,
       vehicle_no,end_index
  FROM (  SELECT ROW_NUMBER () OVER (ORDER BY trn_sys_no)
                     AS row_num,
                 trn_org_code,
                 trn_sys_no,
                 trn_doc_type,
                 trn_doc_no,
                 TO_CHAR (TRUNC (trn_doc_gl_dt), 'Dd-Mon-RRRR')
                     trn_doc_gl_dt,
                 trn_cur_code,
                 trn_doc_fc_amt,
                 trn_doc_lc_amt,
                 TO_NUMBER (NVL (pkg_ifrs.get_total_matched_prem (
                                     trn_org_code,
                                     trn_policy_index,
                                     trn_end_index,
                                     'FC'),
                                 0))
                     paid_fc_amt,
                 TO_NUMBER (NVL (pkg_ifrs.get_total_matched_prem (
                                     trn_org_code,
                                     trn_policy_index,
                                     trn_end_index,
                                     'LC'),
                                 0))
                     paid_lc_amt,
                 trn_aent_code,
                 trn_ent_code,
                 pkg_system_admin.get_entity_name (trn_aent_code, trn_ent_code)
                     intermediary_name_xx,
                 trn_policy_no,
                 trn_end_no,
                 trn_narration,
                 'N'
                     selected_xx,
                 trn_policy_index,
                 trn_end_index,
                 pl_assr_aent_code,
                 pl_assr_ent_code,
                 pkg_system_admin.get_entity_name (pl_assr_aent_code,
                                                   pl_assr_ent_code)
                     insured_name_xx,
                 v.AI_REGN_NO
                     vehicle_no,trn_end_index end_index
            FROM gl_transactions, uw_policy, ai_vehicle v
           WHERE     trn_org_code = :org_code
                 AND pl_index = v.AI_PL_INDEX
                 AND trn_type = 'UW.003'
                 AND trn_org_code = pl_org_code
                 AND trn_policy_index = pl_index
                 AND pl_int_aent_code = NVL ( :int_aent_code, pl_int_aent_code)
                 AND pl_int_ent_code = NVL ( :int_ent_code, pl_int_ent_code)
                 AND trn_cur_code = NVL ( :cur_code, trn_cur_code)
                 AND TRUNC (trn_doc_gl_dt) >= ADD_MONTHS (TRUNC (SYSDATE), -12)
        ORDER BY gl_transactions.created_on DESC)   
 `,
          {
            assr_aent_code: intermediaryCode,
            assr_ent_code: clientCode,
            org_code: "50",
            cur_code: "",
          }
        );
      }

      if ((await results).rows && (await results).rows.length > 0) {
        const formattedData = (await results).rows?.map((row: any) => ({
          docIndex: row[20],
          docNumber: row[4],
          glDate: row[5],
          policyNo: row[16],
          endNo: row[17],
          insured: row[24],
          premium: row[8],
          paid: row[10],
          os: row[12],
          receiptUrl: getTaxInvoiceReportConfig(row[4], row[20], row[26]),
          vehicleNo: row[25],
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

const claimDebitsController = new ClaimDebitsController();
export default claimDebitsController;
