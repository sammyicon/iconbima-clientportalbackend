import OracleDB from "oracledb";
import pool from "../../config/oracledb-connect.js";

class ClaimsController {
  async getClaims(req, res) {
    let connection;
    let results;
    try {
      const { intermediaryCode, clientCode } = req.body;

      connection = (await pool).getConnection();
      console.log("connected to database");
      if (
        intermediaryCode === "15" ||
        intermediaryCode === "70" ||
        intermediaryCode === "25"
      ) {
        results = (await connection).execute(
          `/* Formatted on 3/21/2025 9:15:11 AM (QP5 v5.336) */
  SELECT c.AI_REGN_NO,
         a.cm_org_code,
         a.cm_index,
         a.cm_cd_code,
         a.cm_pl_index,
         a.cm_end_index,
         a.cm_no,
         a.cm_pl_no,
         a.cm_end_to_dt,
         a.cm_loss_date,
         pkg_system_admin.timeago (a.cm_loss_date)
             cm_loss_date_age,
         TO_CHAR (a.cm_loss_date, 'DD-Mon-YYYY')
             cm_loss_date_xx,
         TO_CHAR (a.cm_int_date, 'DD-Mon-YYYY')
             cm_int_date_xx,
         a.cm_int_date,
         pkg_system_admin.timeago (a.cm_int_date)
             cm_int_date_age,
         a.cm_cur_code,
         a.cm_pr_code,
         pkg_uw.get_product_name (a.cm_org_code, a.cm_pr_code)
             cm_pr_code_xx,
         a.cm_os_code,
         pkg_sa.org_structure_name (a.cm_org_code, a.cm_os_code)
             cm_os_code_xx,
         b.cr_mc_code,
         UPPER (pkg_system_admin.get_class_name (cr_org_code, cr_mc_code))
             cr_mc_code_xx,
         b.cr_sc_code,
         pkg_system_admin.get_subclass_name (cr_org_code, cr_sc_code)
             cr_sc_code_xx,
         a.cm_int_aent_code,
         a.cm_int_ent_code,
         pkg_system_admin.get_entity_name (a.cm_int_aent_code,
                                           a.cm_int_ent_code)
             cm_int_ent_code_xx,
         a.cm_aent_code,
         a.cm_ent_code,
         pkg_system_admin.get_entity_name (a.cm_aent_code, a.cm_ent_code)
             cm_ent_code_xx,
         a.cm_status,
         a.cm_desc,
         a.cm_loss_cause,
         pkg_system_admin.get_system_desc ('CM_LOSS_CAUSE', a.cm_loss_cause)
             cm_loss_cause_xx,
         NVL (pkg_cm.get_total_os_claims (a.cm_org_code,
                                          a.cm_pl_index,
                                          a.cm_index,
                                          NULL,
                                          NULL,
                                          NULL,
                                          NULL,
                                          'CLAIM',
                                          'FC'),
              0)
             os_total,
         NVL (ABS (pkg_cm.get_total_cm_paid (a.cm_org_code,
                                             a.cm_pl_index,
                                             a.cm_end_index,
                                             a.cm_index,
                                             NULL,
                                             NULL,
                                             NULL,
                                             NULL,
                                             NULL,
                                             'CLAIM',
                                             'FC')),
              0)
             paid_total,
         pkg_system_admin.timeago (a.created_on)
             created_age,
         a.created_on
             created_on,
         b.cr_risk_code,
         a.cm_full_name,
         a.cm_id_number,
         a.cm_phone_no,
         a.cm_email,
         a.created_by,
         pkg_system_admin.get_user_name (a.created_by)
             created_by_xx,
         pkg_system_admin.get_system_desc ('RGBA_StatusValues', a.cm_status)
             rgba_status,
         cm_tag,
         d.CE_TYPE,
         d.CE_AENT_CODE,
         e.DV_DOC_TYPE,
         e.dv_status,
         e.DV_HD_NO,
         e.DV_DOC_TITLE
    FROM cm_claims      a,
         cm_claims_risks b,
         ai_vehicle     c,
         cm_estimates   d,
         cm_documents   e
   WHERE     a.cm_org_code = :org_code
         AND a.cm_org_code = b.cr_org_code(+)
         AND a.cm_index = b.cr_cm_index(+)
         AND a.cm_pl_index = NVL ( :pl_index, a.cm_pl_index)
         AND a.CM_INT_AENT_CODE = NVL ( :aent_code, a.CM_INT_AENT_CODE)
         AND a.CM_INT_ENT_CODE = NVL ( :ent_code, a.CM_INT_ENT_CODE)
         AND a.cm_index = d.CE_CM_INDEX
         AND a.cm_index = e.DV_CM_INDEX
         AND (CASE
                  WHEN :exclude_cm_index IS NOT NULL THEN :exclude_cm_index
                  ELSE '-1'
              END) !=
             cm_index
         AND a.cm_status != 'ToDelete'
         AND c.AI_PL_INDEX(+) = a.CM_PL_INDEX
ORDER BY a.created_on DESC`,
          {
            org_code: "50",
            pl_index: "",
            aent_code: intermediaryCode,
            ent_code: clientCode,
            exclude_cm_index: "",
          },
          { outFormat: OracleDB.OUT_FORMAT_OBJECT }
        );
      } else {
        results = (await connection).execute(
          `/* Formatted on 3/21/2025 9:15:11 AM (QP5 v5.336) */
  SELECT c.AI_REGN_NO,
         a.cm_org_code,
         a.cm_index,
         a.cm_cd_code,
         a.cm_pl_index,
         a.cm_end_index,
         a.cm_no,
         a.cm_pl_no,
         a.cm_end_to_dt,
         a.cm_loss_date,
         pkg_system_admin.timeago (a.cm_loss_date)
             cm_loss_date_age,
         TO_CHAR (a.cm_loss_date, 'DD-Mon-YYYY')
             cm_loss_date_xx,
         TO_CHAR (a.cm_int_date, 'DD-Mon-YYYY')
             cm_int_date_xx,
         a.cm_int_date,
         pkg_system_admin.timeago (a.cm_int_date)
             cm_int_date_age,
         a.cm_cur_code,
         a.cm_pr_code,
         pkg_uw.get_product_name (a.cm_org_code, a.cm_pr_code)
             cm_pr_code_xx,
         a.cm_os_code,
         pkg_sa.org_structure_name (a.cm_org_code, a.cm_os_code)
             cm_os_code_xx,
         b.cr_mc_code,
         UPPER (pkg_system_admin.get_class_name (cr_org_code, cr_mc_code))
             cr_mc_code_xx,
         b.cr_sc_code,
         pkg_system_admin.get_subclass_name (cr_org_code, cr_sc_code)
             cr_sc_code_xx,
         a.cm_int_aent_code,
         a.cm_int_ent_code,
         pkg_system_admin.get_entity_name (a.cm_int_aent_code,
                                           a.cm_int_ent_code)
             cm_int_ent_code_xx,
         a.cm_aent_code,
         a.cm_ent_code,
         pkg_system_admin.get_entity_name (a.cm_aent_code, a.cm_ent_code)
             cm_ent_code_xx,
         a.cm_status,
         a.cm_desc,
         a.cm_loss_cause,
         pkg_system_admin.get_system_desc ('CM_LOSS_CAUSE', a.cm_loss_cause)
             cm_loss_cause_xx,
         NVL (pkg_cm.get_total_os_claims (a.cm_org_code,
                                          a.cm_pl_index,
                                          a.cm_index,
                                          NULL,
                                          NULL,
                                          NULL,
                                          NULL,
                                          'CLAIM',
                                          'FC'),
              0)
             os_total,
         NVL (ABS (pkg_cm.get_total_cm_paid (a.cm_org_code,
                                             a.cm_pl_index,
                                             a.cm_end_index,
                                             a.cm_index,
                                             NULL,
                                             NULL,
                                             NULL,
                                             NULL,
                                             NULL,
                                             'CLAIM',
                                             'FC')),
              0)
             paid_total,
         pkg_system_admin.timeago (a.created_on)
             created_age,
         a.created_on
             created_on,
         b.cr_risk_code,
         a.cm_full_name,
         a.cm_id_number,
         a.cm_phone_no,
         a.cm_email,
         a.created_by,
         pkg_system_admin.get_user_name (a.created_by)
             created_by_xx,
         pkg_system_admin.get_system_desc ('RGBA_StatusValues', a.cm_status)
             rgba_status,
         cm_tag,
         d.CE_TYPE,
         d.CE_AENT_CODE,
         e.DV_DOC_TYPE,
         e.dv_status,
         e.DV_HD_NO,
         e.DV_DOC_TITLE
    FROM cm_claims      a,
         cm_claims_risks b,
         ai_vehicle     c,
         cm_estimates   d,
         cm_documents   e
   WHERE     a.cm_org_code = :org_code
         AND a.cm_org_code = b.cr_org_code(+)
         AND a.cm_index = b.cr_cm_index(+)
         AND a.cm_pl_index = NVL ( :pl_index, a.cm_pl_index)
         AND a.CM_INT_AENT_CODE = NVL ( :aent_code, a.CM_INT_AENT_CODE)
         AND a.CM_INT_ENT_CODE = NVL ( :ent_code, a.CM_INT_ENT_CODE)
         AND a.cm_index = d.CE_CM_INDEX
         AND a.cm_index = e.DV_CM_INDEX
         AND (CASE
                  WHEN :exclude_cm_index IS NOT NULL THEN :exclude_cm_index
                  ELSE '-1'
              END) !=
             cm_index
         AND a.cm_status != 'ToDelete'
         AND c.AI_PL_INDEX(+) = a.CM_PL_INDEX
ORDER BY a.created_on DESC`,
          {
            org_code: "50",
            pl_index: "",
            aent_code: intermediaryCode,
            ent_code: clientCode,
            exclude_cm_index: "",
          },
          { outFormat: OracleDB.OUT_FORMAT_OBJECT }
        );
      }

      const formattedData = (await results).rows;
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
}

const claimsController = new ClaimsController();
export default claimsController;
