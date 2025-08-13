import OracleDB from "oracledb";
import pool from "../../config/oracledb-connect.js";
import { config } from "dotenv";
config();

class GLstatementsOutstanding {
  async getGlStatementsOutstanding(req, res) {
    let connection;
    try {
      const { intermediaryCode, clientCode, fromDate, toDate } = req.body;
      console.log("Request Data:", req.body);

      connection = await (await pool).getConnection();
      console.log("Database is connected");

      if (["15", "70", "25"].includes(intermediaryCode)) {
        const results = await connection.execute(
          `/* Formatted on 3/14/2025 10:31:11 AM (QP5 v5.336) */
  SELECT order_flag,
         trn_org_code,
         ent_aent_code,
         ent_code,
         ent_name,
         NVL (
             (  SELECT LISTAGG (pl_risk_code, ',')
                           WITHIN GROUP (ORDER BY pl_risk_code)    AS regn_nos
                  FROM uh_policy_risks
                 WHERE     pl_pl_index = trn_policy_index
                       AND pl_end_index = trn_end_index
                       AND pl_mc_code IN ('080', '070')
                HAVING COUNT (*) <= 5
              GROUP BY pl_org_code, pl_pl_index, pl_end_index),
             'VARIOUS')
             vehicles,
         pkg_system_admin.get_class_name (trn_org_code,
                                          pkg_system_admin.get_column_value_two (
                                              'UW_PRODUCTS',
                                              'PR_MAIN_MC_CODE',
                                              'PR_ORG_CODE',
                                              'PR_CODE',
                                              trn_org_code,
                                              trn_product_code))
             trn_class_name,
         trn_product_code,
         trn_product_name,
         trn_doc_no,
         trn_debit_no,
         trn_doc_type,
         trn_type,
         trn_doc_gl_dt,
         trn_os_code,
         trn_branch_code,
         trn_fin_code,
         trn_per_code,
         trn_narration,
         trn_policy_no,
         trn_policy_index,
         trn_end_no,
         trn_end_index,
         trn_drcr_flag,
         trn_cur_code,
         trn_cur_rate,
         gross_prem,
         gross_prem - pvt_amount
             new_gross_prem,
         pvt_amount,
         sd_amount,
         tl_amount,
         phc_amount,
         comm_amount,
         wtax_amount,
         (comm_amount - wtax_amount) * DECODE (trn_drcr_flag, 'D', 1, -1)
             net_comm,
         credit_net,
           pkg_uw_00.get_paid_premium_gl_date (trn_org_code,
                                               trn_policy_index,
                                               trn_end_index,
                                               :p_fm_dt,
                                               :p_to_dt)
         + credit_net
             receipted_amt,
         pkg_uw_00.GET_PAID_COMMISSION (trn_org_code,
                                        trn_policy_index,
                                        trn_end_index)
             comm_paid,
         trn_matched
    FROM (SELECT DISTINCT
                 1
                     order_flag,
                 a.trn_org_code,
                 b.ent_aent_code,
                 b.ent_code,
                 b.ent_name,
                 a.trn_product_code,
                 (SELECT DISTINCT pr.pr_pr_name
                    FROM uw_premium_register pr
                   WHERE     a.trn_org_code = pr.pr_org_code
                         AND a.trn_policy_index = pr.pr_pl_index
                         AND a.trn_end_index = pr.pr_end_index)
                     trn_product_name,
                 a.trn_policy_no
                     trn_doc_no,
                 trn_doc_no
                     trn_debit_no,
                 a.trn_doc_type,
                 a.trn_type,
                 TRUNC (a.trn_doc_gl_dt)
                     trn_doc_gl_dt,
                 a.trn_os_code,
                 (SELECT DISTINCT
                         NVL (
                             DECODE (os_type,
                                     'Branch', os_code,
                                     os_ref_os_code),
                             '100')
                    FROM hi_org_structure o, all_entity e
                   WHERE     e.ent_os_code = o.os_code(+)
                         AND e.ent_aent_code = b.ent_aent_code
                         AND e.ent_code = b.ent_code)
                     trn_branch_code,
                 a.trn_fin_code,
                 a.trn_per_code,
                 NVL (
                     (SELECT DISTINCT pr.pr_assr_ent_name
                        FROM uw_premium_register pr
                       WHERE     a.trn_org_code = pr.pr_org_code
                             AND a.trn_policy_index = pr.pr_pl_index
                             AND a.trn_end_index = pr.pr_end_index),
                     trn_narration)
                     trn_narration,
                 a.trn_policy_no,
                 a.trn_policy_index,
                 NVL (a.trn_end_no, 'New')
                     trn_end_no,
                 a.trn_end_index,
                 a.trn_drcr_flag,
                 a.trn_cur_code,
                 a.trn_cur_rate,
                 DECODE ( :p_currency,
                         NULL, (NVL (a.trn_doc_fc_amt, 0) * a.trn_cur_rate),
                         NVL (a.trn_doc_fc_amt, 0))
                     gross_prem,
                 NVL (
                     (SELECT SUM (
                                 DECODE (
                                     :p_currency,
                                     NULL, (  NVL (pvt.pr_fc_political, 0)
                                            * pvt.pr_cur_rate),
                                     NVL (pvt.pr_fc_political, 0)))
                        FROM uw_premium_register pvt
                       WHERE     a.trn_org_code = pvt.pr_org_code
                             AND a.trn_policy_index = pvt.pr_pl_index
                             AND a.trn_end_index = pvt.pr_end_index),
                     0)
                     pvt_amount,
                 NVL (
                     (SELECT SUM (
                                 DECODE (
                                     :p_currency,
                                     NULL, (  NVL (sd.trn_doc_fc_amt, 0)
                                            * sd.trn_cur_rate),
                                     NVL (sd.trn_doc_fc_amt, 0)))
                        FROM gl_transactions sd
                       WHERE     a.trn_org_code = sd.trn_org_code
                             AND a.trn_doc_type = sd.trn_doc_type
                             AND a.trn_doc_no = sd.trn_doc_no
                             AND a.trn_policy_index = sd.trn_policy_index
                             AND a.trn_end_index = sd.trn_end_index
                             AND sd.trn_type IN ('UW.005', 'UW.005R')
                             AND sd.trn_flex01 = 'CHARGE'
                             AND sd.trn_flex02 IN ('CHG21', 'CHG22')),
                     0)
                     sd_amount,
                 NVL (
                     (SELECT SUM (
                                 DECODE (
                                     :p_currency,
                                     NULL, (  NVL (tl.trn_doc_fc_amt, 0)
                                            * tl.trn_cur_rate),
                                     NVL (tl.trn_doc_fc_amt, 0)))
                        FROM gl_transactions tl
                       WHERE     a.trn_org_code = tl.trn_org_code
                             AND a.trn_doc_type = tl.trn_doc_type
                             AND a.trn_doc_no = tl.trn_doc_no
                             AND a.trn_policy_index = tl.trn_policy_index
                             AND a.trn_end_index = tl.trn_end_index
                             AND tl.trn_type IN ('UW.037', 'UW.037R')
                             AND tl.trn_flex01 = 'LEVY'
                             AND tl.trn_flex02 = 'CHG30'),
                     0)
                     tl_amount,
                 NVL (
                     (SELECT SUM (
                                 DECODE (
                                     :p_currency,
                                     NULL, (  NVL (phc.trn_doc_fc_amt, 0)
                                            * phc.trn_cur_rate),
                                     NVL (phc.trn_doc_fc_amt, 0)))
                        FROM gl_transactions phc
                       WHERE     a.trn_org_code = phc.trn_org_code
                             AND a.trn_doc_type = phc.trn_doc_type
                             AND a.trn_doc_no = phc.trn_doc_no
                             AND a.trn_policy_index = phc.trn_policy_index
                             AND a.trn_end_index = phc.trn_end_index
                             AND phc.trn_type IN ('UW.005', 'UW.005R')
                             AND phc.trn_flex01 = 'CHARGE'
                             AND phc.trn_flex02 = 'CHG10'),
                     0)
                     phc_amount,
                 NVL (
                     (SELECT SUM (
                                 DECODE (
                                     :p_currency,
                                     NULL, (  NVL (comm.trn_doc_fc_amt, 0)
                                            * comm.trn_cur_rate),
                                     NVL (comm.trn_doc_fc_amt, 0)))
                        FROM gl_transactions comm
                       WHERE     a.trn_org_code = comm.trn_org_code
                             AND a.trn_doc_type = comm.trn_doc_type
                             AND a.trn_doc_no = comm.trn_doc_no
                             AND a.trn_policy_index = comm.trn_policy_index
                             AND a.trn_end_index = comm.trn_end_index
                             AND comm.trn_type IN ('UW.001', 'UW.001R')
                             AND comm.trn_flex01 = 'BROKER'
                             AND comm.trn_flex02 = 'CHG42'),
                     0)
                     comm_amount,
                 NVL (
                     (SELECT SUM (
                                 DECODE (
                                     :p_currency,
                                     NULL, (  NVL (wtax.trn_doc_fc_amt, 0)
                                            * wtax.trn_cur_rate),
                                     NVL (wtax.trn_doc_fc_amt, 0)))
                        FROM gl_transactions wtax
                       WHERE     a.trn_org_code = wtax.trn_org_code
                             AND a.trn_doc_type = wtax.trn_doc_type
                             AND a.trn_doc_no = wtax.trn_doc_no
                             AND a.trn_policy_index = wtax.trn_policy_index
                             AND a.trn_end_index = wtax.trn_end_index
                             AND wtax.trn_type IN ('UW.016', 'UW.016R')
                             AND wtax.trn_flex01 = 'WITHHOLD TAX'
                             AND wtax.trn_flex02 IN ('CHG43', 'CHG44')),
                     0)
                     wtax_amount,
                 0
                     credit_net,
                 (CASE
                      WHEN EXISTS
                               (SELECT *
                                  FROM gl_matched_docs
                                 WHERE DO_HD_NO = a.TRN_DOC_NO)
                      THEN
                          'Matched'
                      ELSE
                          'Not Matched'
                  END)
                     trn_matched
            FROM all_entity b, gl_transactions a
           WHERE     b.ent_aent_code = a.trn_aent_code
                 AND b.ent_code = a.trn_ent_code
                 AND a.trn_type IN ('UW.003', 'UW.003R')
                 AND a.trn_doc_type = 'UW-POLICY'
                 AND a.trn_org_code = :p_org_code
                 AND TRUNC (a.trn_doc_gl_dt) BETWEEN TRUNC (
                                                         NVL ( :p_fm_dt,
                                                              a.trn_doc_gl_dt))
                                                 AND TRUNC (
                                                         NVL ( :p_to_dt,
                                                              a.trn_doc_gl_dt))
                 AND b.ent_aent_code = NVL ( :p_category, ent_aent_code)
                 AND b.ent_code = NVL ( :p_intermediary, ent_code)
                 AND a.trn_cur_code = NVL ( :p_currency, trn_cur_code)
          UNION ALL
          SELECT DISTINCT
                 2                                       order_flag,
                 rcp.trn_org_code,
                 b.ent_aent_code,
                 b.ent_code,
                 b.ent_name,
                 CASE
                     WHEN rcp.trn_doc_type IN
                              ('AR-RECEIPT', 'AR-RECEIPT-NS')
                     THEN
                         '9990'
                     WHEN rcp.trn_doc_type IN
                              ('AP-PAYMENT', 'AP-PAYMENT-NS')
                     THEN
                         '9991'
                     WHEN rcp.trn_doc_type IN ('GL-JOURNAL')
                     THEN
                         '9992'
                     WHEN rcp.trn_doc_type IN ('CM-CLAIMS')
                     THEN
                         '9993'
                 END                                     trn_product_code,
                 CASE
                     WHEN rcp.trn_doc_type IN
                              ('AR-RECEIPT', 'AR-RECEIPT-NS')
                     THEN
                         'Receipts'
                     WHEN rcp.trn_doc_type IN
                              ('AP-PAYMENT', 'AP-PAYMENT-NS')
                     THEN
                         'Payments'
                     WHEN rcp.trn_doc_type IN ('GL-JOURNAL')
                     THEN
                         'Journals/Credit Notes'
                     WHEN rcp.trn_doc_type IN ('CM-CLAIMS')
                     THEN
                         'Claims'
                 END                                     trn_product_name,
                 rcp.trn_doc_no,
                 trn_doc_no                              trn_debit_no,
                 rcp.trn_doc_type,
                 rcp.trn_type,
                 TRUNC (rcp.trn_doc_gl_dt)               trn_doc_gl_dt,
                 rcp.trn_os_code,
                 (SELECT DISTINCT
                         NVL (
                             DECODE (os_type,
                                     'Branch', os_code,
                                     os_ref_os_code),
                             '100')
                    FROM hi_org_structure o, all_entity e
                   WHERE     e.ent_os_code = o.os_code(+)
                         AND e.ent_aent_code = b.ent_aent_code
                         AND e.ent_code = b.ent_code)    trn_branch_code,
                 rcp.trn_fin_code,
                 rcp.trn_per_code,
                    'Unallocatted Credits : '
                 || CASE
                        WHEN rcp.trn_doc_type IN
                                 ('AR-RECEIPT', 'AR-RECEIPT-NS')
                        THEN
                               trn_flex01
                            || ' '
                            || (SELECT DISTINCT
                                       DECODE (
                                           LISTAGG (do_doc_no, ', ')
                                           WITHIN GROUP (ORDER BY do_doc_no),
                                           NULL, NULL,
                                              'For Policy No: '
                                           || LISTAGG (do_doc_no, ', ')
                                              WITHIN GROUP (ORDER BY do_doc_no))
                                  FROM ar_receipt_docs d
                                 WHERE     d.do_org_code = rcp.trn_org_code
                                       AND d.do_hd_no = rcp.trn_doc_no)
                        ELSE
                            rcp.trn_narration
                    END                                  trn_narration,
                 rcp.trn_policy_no,
                 rcp.trn_policy_index,
                 rcp.trn_end_no,
                 rcp.trn_end_index,
                 rcp.trn_drcr_flag,
                 rcp.trn_cur_code,
                 rcp.trn_cur_rate,
                 0                                       gross_prem,
                 0                                       pvt_amount,
                 0                                       sd_amount,
                 0                                       tl_amount,
                 0                                       phc_amount,
                 0                                       comm_amount,
                 0                                       wtax_amount,
                 DECODE (
                     :p_currency,
                     NULL, (NVL (rcp.trn_doc_fc_amt, 0) * rcp.trn_cur_rate),
                     NVL (rcp.trn_doc_fc_amt, 0))        credit_net,
                 'Not Matched'                           trn_matched
            FROM all_entity b, gl_transactions rcp
           WHERE     b.ent_aent_code = rcp.trn_aent_code
                 AND b.ent_code = rcp.trn_ent_code
                 AND rcp.trn_doc_type IN ('AR-RECEIPT',
                                          'AR-RECEIPT-NS',
                                          'GL-JOURNAL',
                                          'CM-CLAIMS')
                 AND rcp.trn_org_code = :p_org_code
                 AND TRUNC (rcp.trn_doc_gl_dt) BETWEEN TRUNC (
                                                           NVL (
                                                               :p_fm_dt,
                                                               rcp.trn_doc_gl_dt))
                                                   AND TRUNC (
                                                           NVL (
                                                               :p_to_dt,
                                                               rcp.trn_doc_gl_dt))
                 AND b.ent_aent_code = NVL ( :p_category, ent_aent_code)
                 AND b.ent_code = NVL ( :p_intermediary, ent_code)
                 AND rcp.trn_cur_code = NVL ( :p_currency, trn_cur_code)
                 AND trn_doc_no NOT LIKE 'Rev : %'
                 AND rcp.trn_doc_no NOT IN (SELECT DISTINCT do_hd_no
                                              FROM ar_receipt_docs
                                             WHERE do_hd_no = rcp.trn_doc_no))
   WHERE trn_doc_no NOT IN
             (SELECT hd_no
                FROM gl_je_header
               WHERE     hd_org_code = :p_org_code
                     AND hd_type = 'REVALUATION'
                     AND :p_currency = pkg_gl.get_org_base_curr ( :p_org_code))
ORDER BY order_flag, trn_narration, trn_doc_gl_dt`,
          {
            p_category: intermediaryCode,
            p_intermediary: clientCode,
            p_org_code: "50",
            p_currency: "",
            p_fm_dt: new Date(fromDate),
            p_to_dt: new Date(toDate),
          },
          { outFormat: OracleDB.OUT_FORMAT_OBJECT }
        );
        const formattedData = results.rows || [];
        return res
          .status(200)
          .json({ results: formattedData });
      } else {
        return res.status(400).json({ error: "Invalid intermediary code" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    } finally {
      if (connection) {
        connection.close();
        console.info("Connection closed successfully");
      }
    }
  }
}

const glStatementOutstanding = new GLstatementsOutstanding();
export default glStatementOutstanding;
