import pool from "../../config/oracledb-connect.js";
import { config } from "dotenv";
import { getJournaleReportConfig } from "../../config/report-config.js";
import OracleDB from "oracledb";
config();
class ClaimCreditNotesController {
  async getClaimCreditNotes(req, res) {
    let connection;
    let results;
    try {
      const { intermediaryCode, clientCode, fromDate, toDate } = req.body;
      console.log(req.body);
      connection = (await pool).getConnection();
      console.log("Database is connected");
      if (
        intermediaryCode === "15" ||
        intermediaryCode === "70" ||
        intermediaryCode === "25"
      ) {
        results = (await connection).execute(
          `/* Formatted on 3/21/2025 8:50:58 AM (QP5 v5.336) */
  SELECT hd_org_code,
         hd_no,
         hd_index,
         hd_trn_code,
         hd_batch_no,
         hd_narration,
         hd_gl_date,
         hd_cur_code,
         hd_cur_rate,
         hd_lc_dr_amount,
         hd_lc_cr_amount,
         hd_fc_dr_amount,
         hd_fc_cr_amount,
         hd_type,
         hd_complete,
         hd_status,
         DECODE (hd_posted, 'Y', 'Yes', 'No')
             hd_posted,
         a.created_by,
         pkg_system_admin.get_user_name (a.created_by)
             created_by_xx,
         pkg_system_admin.timeago (a.created_on)
             created_age,
         hd_os_code,
         pkg_sa.org_structure_name (hd_org_code, hd_os_code)
             hd_os_code_xx,
         hd_canc_reason,
         hd_canc_remarks,
         hd_canc_date,
         pkg_system_admin.get_entity_name (b.LN_LINK_AENT_CODE,
                                           b.LN_LINK_ENT_CODE)
             insured,
         pkg_system_admin.get_system_desc ('RGBA_StatusValues', hd_status)
             status_bg_color_xx,
         cm_no
    FROM gl_je_header a, gl_je_lines b, cm_claims c
   WHERE     hd_org_code = :org_code
         AND b.LN_AENT_CODE = NVL ( :intermediaryCode, b.LN_AENT_CODE)
         AND b.LN_ENT_CODE = NVL ( :clientCode, b.LN_ENT_CODE)
         AND hd_type = 'CREDIT NOTE'
         AND hd_no = b.LN_HD_NO
         AND hd_posted = 'Y'
         AND c.CM_NO = hd_batch_no
         AND TRUNC (hd_gl_date) BETWEEN :p_fm_dt AND :p_to_dt
ORDER BY hd_gl_date DESC`,
          {
            intermediaryCode,
            clientCode,
            org_code: "50",
            p_fm_dt: new Date(fromDate),
            p_to_dt: new Date(toDate),
          },
          { outFormat: OracleDB.OUT_FORMAT_OBJECT }
        );
      } else {
        results = (await connection).execute(
          `/* Formatted on 3/21/2025 8:50:58 AM (QP5 v5.336) */
  SELECT hd_org_code,
         hd_no,
         hd_index,
         hd_trn_code,
         hd_batch_no,
         hd_narration,
         hd_gl_date,
         hd_cur_code,
         hd_cur_rate,
         hd_lc_dr_amount,
         hd_lc_cr_amount,
         hd_fc_dr_amount,
         hd_fc_cr_amount,
         hd_type,
         hd_complete,
         hd_status,
         DECODE (hd_posted, 'Y', 'Yes', 'No')
             hd_posted,
         a.created_by,
         pkg_system_admin.get_user_name (a.created_by)
             created_by_xx,
         pkg_system_admin.timeago (a.created_on)
             created_age,
         hd_os_code,
         pkg_sa.org_structure_name (hd_org_code, hd_os_code)
             hd_os_code_xx,
         hd_canc_reason,
         hd_canc_remarks,
         hd_canc_date,
         pkg_system_admin.get_entity_name (b.LN_LINK_AENT_CODE,
                                           b.LN_LINK_ENT_CODE)
             insured,
         pkg_system_admin.get_system_desc ('RGBA_StatusValues', hd_status)
             status_bg_color_xx,
         cm_no
    FROM gl_je_header a, gl_je_lines b, cm_claims c
   WHERE     hd_org_code = :org_code
         AND b.LN_AENT_CODE = NVL ( :intermediaryCode, b.LN_AENT_CODE)
         AND b.LN_ENT_CODE = NVL ( :clientCode, b.LN_ENT_CODE)
         AND hd_type = 'CREDIT NOTE'
         AND hd_no = b.LN_HD_NO
         AND hd_posted = 'Y'
         AND c.CM_NO = hd_batch_no
         AND TRUNC (hd_gl_date) BETWEEN :p_fm_dt AND :p_to_dt
ORDER BY hd_gl_date DESC`,
          {
            intermediaryCode,
            clientCode,
            org_code: "50",
            p_fm_dt: new Date(fromDate),
            p_to_dt: new Date(toDate),
          },
          { outFormat: OracleDB.OUT_FORMAT_OBJECT }
        );
      }

      const formattedData = (await results).rows.map((row) => ({
        ...row,
        receiptUrl: getJournaleReportConfig(row.HD_NO, row.HD_INDEX),
      }));
      res.json({
        success: true,
        results: formattedData,
      });
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

const claimCreditNotesController = new ClaimCreditNotesController();
export default claimCreditNotesController;
