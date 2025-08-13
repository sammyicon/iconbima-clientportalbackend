import pool from "../../config/oracledb-connect.js";
import { config } from "dotenv";
config();

class CommisionPayableController {
  async getCommissionPayble(req, res) {
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
          ` SELECT *
    FROM (  SELECT pr_org_code,
                   pr_pl_index,
                   pr_end_index,
                   pr_net_effect,
                   pr_pl_no,
                   pr_end_no,
                   pr_gl_date,
                   pr_int_aent_code,
                   pr_int_ent_code,
                   pr_assr_aent_code,
                   pr_assr_ent_code,
                   pr_catg_name,
                   pr_intermediary,
                   pr_insured,
                   pr_cur_code,
                   calc_fc_tax,
                   SUM (broker_comm_fc)       broker_comm_fc,
                   SUM (broker_tax_fc)        broker_tax_fc,
                   fc_basic_premium,
                   SUM (fc_total_premium)     fc_total_premium,
                   fc_paid_prem,
                   fc_paid_comm
              FROM (SELECT DISTINCT
                           pr_org_code,
                           pr_pl_index,
                           pr_end_index,
                           pr_net_effect,
                           pr_pl_no,
                           pr_pr_code,
                           pr_end_no,
                           TO_CHAR (pr_gl_date, 'dd-Mon-RRRR')
                               pr_gl_date,
                           pr_int_aent_code,
                           pr_int_ent_code,
                           pr_assr_aent_code,
                           pr_assr_ent_code,
                           pkg_system_admin.get_ent_catg_name (pr_int_aent_code)
                               pr_catg_name,
                           pkg_system_admin.get_entity_name (pr_int_aent_code,
                                                             pr_int_ent_code)
                               pr_intermediary,
                           INITCAP (
                               pkg_system_admin.get_entity_name (
                                   pr_assr_aent_code,
                                   pr_assr_ent_code))
                               pr_insured,
                           pr_cur_code,
                             pkg_uw_00.get_withheld_tax_f (pr_org_code,
                                                           pr_pl_index,
                                                           pr_end_index,
                                                           'FC')
                           * DECODE ( :p_currency, pr_cur_code, 1, pr_cur_rate)
                           * DECODE (pr_net_effect,
                                     'Debit', 1,
                                     'Credit', -1,
                                     0)
                               calc_fc_tax,
                             NVL (pr_fc_broker_comm, 0)
                           * DECODE ( :p_currency, pr_cur_code, 1, pr_cur_rate)
                           * DECODE (pr_net_effect,
                                     'Debit', 1,
                                     'Credit', -1,
                                     0)
                               broker_comm_fc,
                             NVL (pr_fc_broker_tax, 0)
                           * DECODE ( :p_currency, pr_cur_code, 1, pr_cur_rate)
                           * DECODE (pr_net_effect,
                                     'Debit', 1,
                                     'Credit', -1,
                                     0)
                               broker_tax_fc,
                             PKG_UW_00.GET_POLICY_TOTAL_PREM (
                                 P_ORG_CODE     => pr_org_code,
                                 P_PL_INDEX     => pr_pl_index,
                                 P_END_INDEX    => pr_end_index,
                                 P_PR_CODE      => NULL,
                                 P_MC_CODE      => NULL,
                                 P_SC_CODE      => NULL,
                                 P_SS_CODE      => NULL,
                                 P_RISK_INDEX   => NULL,
                                 P_CC_CODE      => NULL,
                                 p_amt_type     => 'FC')
                           * DECODE ( :p_currency, pr_cur_code, 1, pr_cur_rate)
                           * DECODE (pr_net_effect,
                                     'Debit', 1,
                                     'Credit', -1,
                                     0)
                               fc_basic_premium,
                             NVL (pr_fc_prem, 0)
                           + NVL (pr_fc_eartquake, 0)
                           + NVL (pr_fc_political, 0)
                           + NVL (pr_fc_stamp_duty, 0)
                           + NVL (pr_fc_phc_fund, 0)
                           + NVL (pr_fc_training_levy, 0)
                           + NVL (pr_fc_aa, 0)
                           + NVL (pr_fc_pta, 0)
                           + NVL (PR_FC_911_RR, 0)
                           +   NVL (PR_FC_INFAMA_CARD, 0)
                             * DECODE ( :p_currency, pr_cur_code, 1, pr_cur_rate)
                             * DECODE (pr_net_effect,
                                       'Debit', 1,
                                       'Credit', -1,
                                       0)
                               fc_total_premium,
                             pkg_uw_00.get_paid_premium (pr_org_code,
                                                         pr_pl_index,
                                                         pr_end_index)
                           * DECODE ( :p_currency, pr_cur_code, 1, pr_cur_rate)
                           * DECODE (pr_net_effect,
                                     'Debit', 1,
                                     'Credit', -1,
                                     0)
                               fc_paid_prem,
                             NVL (
                                 pkg_uw_00.get_paid_commission (pr_org_code,
                                                                pr_pl_index,
                                                                pr_end_index),
                                 0)
                           * DECODE ( :p_currency, pr_cur_code, 1, pr_cur_rate)
                           * DECODE (pr_net_effect,
                                     'Debit', 1,
                                     'Credit', -1,
                                     0)
                               fc_paid_comm
                      FROM uw_premium_register a,
                           all_entity       b,
                           (SELECT hd_no,
                                   do_hd_no,
                                   hd_gl_date,
                                   do_doc_index,
                                   do_end_index,
                                   do_doc_type,
                                   do_doc_no
                              FROM ar_receipts_header, ar_receipt_docs docs
                             WHERE     hd_org_code = do_org_code
                                   AND hd_no = do_hd_no
                                   AND do_doc_type IN ('Policy',
                                                       'Endorsement',
                                                       'Vehicle',
                                                       'Debits')
                                   AND hd_posted = 'Y'
                                   AND hd_complete = 'Y'
                                   AND hd_status = 'Completed') d
                     WHERE     pr_org_code = :p_org_code
                           AND pr_int_aent_code = ent_aent_code
                           AND pr_int_ent_code = ent_code
                           AND a.pr_pl_index = do_doc_index(+)
                           AND a.pr_end_index = d.do_end_index(+)
                           AND TRUNC (
                                   (CASE
                                        WHEN pr_net_effect = 'Debit'
                                        THEN
                                            d.hd_gl_date
                                        WHEN pr_net_effect = 'Credit'
                                        THEN
                                            pr_gl_date
                                    END)) BETWEEN  ( :p_fm_dt)
                                              AND  ( :p_to_dt)
                           AND pr_cur_code = NVL ( :p_currency, pr_cur_code)
                           AND pr_os_code = NVL ( :p_branch, pr_os_code)
                           AND pr_int_ent_code =
                               NVL ( :p_intermediary, pr_int_ent_code)
                           AND pr_net_effect IN ('Debit', 'Credit')
                           AND pr_int_aent_code IN ('25', '70')
                    UNION
                    SELECT *
                      FROM (SELECT DISTINCT
                                   pr_org_code,
                                   pr_pl_index,
                                   pr_end_index,
                                   pr_net_effect,
                                   pr_pl_no,
                                   pr_pr_code,
                                   pr_end_no,
                                   TO_CHAR (pr_gl_date, 'dd-Mon-RRRR')
                                       pr_gl_date,
                                   pr_int_aent_code,
                                   pr_int_ent_code,
                                   pr_assr_aent_code,
                                   pr_assr_ent_code,
                                   pkg_system_admin.get_ent_catg_name (
                                       pr_int_aent_code)
                                       pr_catg_name,
                                   pkg_system_admin.get_entity_name (
                                       pr_int_aent_code,
                                       pr_int_ent_code)
                                       pr_intermediary,
                                   INITCAP (
                                       pkg_system_admin.get_entity_name (
                                           pr_assr_aent_code,
                                           pr_assr_ent_code))
                                       pr_insured,
                                   pr_cur_code,
                                     pkg_uw_00.get_withheld_tax_f (pr_org_code,
                                                                   pr_pl_index,
                                                                   pr_end_index,
                                                                   'FC')
                                   * DECODE ( :p_currency,
                                             pr_cur_code, 1,
                                             pr_cur_rate)
                                   * DECODE (pr_net_effect,
                                             'Debit', 1,
                                             'Credit', -1,
                                             0)
                                       calc_fc_tax,
                                     NVL (pr_fc_broker_comm, 0)
                                   * DECODE ( :p_currency,
                                             pr_cur_code, 1,
                                             pr_cur_rate)
                                   * DECODE (pr_net_effect,
                                             'Debit', 1,
                                             'Credit', -1,
                                             0)
                                       broker_comm_fc,
                                     NVL (pr_fc_broker_tax, 0)
                                   * DECODE ( :p_currency,
                                             pr_cur_code, 1,
                                             pr_cur_rate)
                                   * DECODE (pr_net_effect,
                                             'Debit', 1,
                                             'Credit', -1,
                                             0)
                                       broker_tax_fc,
                                     PKG_UW_00.GET_POLICY_TOTAL_PREM (
                                         P_ORG_CODE     => pr_org_code,
                                         P_PL_INDEX     => pr_pl_index,
                                         P_END_INDEX    => pr_end_index,
                                         P_PR_CODE      => NULL,
                                         P_MC_CODE      => NULL,
                                         P_SC_CODE      => NULL,
                                         P_SS_CODE      => NULL,
                                         P_RISK_INDEX   => NULL,
                                         P_CC_CODE      => NULL,
                                         p_amt_type     => 'FC')
                                   * DECODE ( :p_currency,
                                             pr_cur_code, 1,
                                             pr_cur_rate)
                                   * DECODE (pr_net_effect,
                                             'Debit', 1,
                                             'Credit', -1,
                                             0)
                                       fc_basic_premium,
                                     NVL (pr_fc_prem, 0)
                                   + NVL (pr_fc_eartquake, 0)
                                   + NVL (pr_fc_political, 0)
                                   + NVL (pr_fc_stamp_duty, 0)
                                   + NVL (pr_fc_phc_fund, 0)
                                   + NVL (pr_fc_training_levy, 0)
                                   + NVL (pr_fc_aa, 0)
                                   + NVL (pr_fc_pta, 0)
                                   + NVL (PR_FC_911_RR, 0)
                                   +   NVL (PR_FC_INFAMA_CARD, 0)
                                     * DECODE ( :p_currency,
                                               pr_cur_code, 1,
                                               pr_cur_rate)
                                     * DECODE (pr_net_effect,
                                               'Debit', 1,
                                               'Credit', -1,
                                               0)
                                       fc_total_premium,
                                     pkg_uw_00.get_paid_premium (pr_org_code,
                                                                 pr_pl_index,
                                                                 pr_end_index)
                                   * DECODE ( :p_currency,
                                             pr_cur_code, 1,
                                             pr_cur_rate)
                                   * DECODE (pr_net_effect,
                                             'Debit', 1,
                                             'Credit', -1,
                                             0)
                                       fc_paid_prem,
                                     NVL (
                                         pkg_uw_00.get_paid_commission (
                                             pr_org_code,
                                             pr_pl_index,
                                             pr_end_index),
                                         0)
                                   * DECODE ( :p_currency,
                                             pr_cur_code, 1,
                                             pr_cur_rate)
                                   * DECODE (pr_net_effect,
                                             'Debit', 1,
                                             'Credit', -1,
                                             0)
                                       fc_paid_comm
                              FROM uw_premium_register a, all_entity b
                             WHERE     pr_org_code = :p_org_code
                                   AND pr_int_aent_code = ent_aent_code
                                   AND pr_int_ent_code = ent_code
                                   AND TRUNC (pr_gl_date) BETWEEN  (
                                                                      :p_fm_dt)
                                                              AND  (
                                                                      :p_to_dt)
                                   AND pr_cur_code =
                                       NVL ( :p_currency, pr_cur_code)
                                   AND pr_os_code = NVL ( :p_branch, pr_os_code)
                                   AND pr_int_ent_code =
                                       NVL ( :p_intermediary, pr_int_ent_code)
                                   AND pr_net_effect IN ('Debit')
                                   AND pr_int_aent_code IN ('25', '70')
                                   AND pr_pl_index || '-' || pr_end_index NOT IN
                                           (SELECT    do_doc_index
                                                   || '-'
                                                   || do_end_index
                                              FROM ar_receipts_header,
                                                   ar_receipt_docs docs
                                             WHERE     hd_org_code = do_org_code
                                                   AND hd_no = do_hd_no
                                                   AND do_doc_type IN
                                                           ('Policy',
                                                            'Endorsement',
                                                            'Vehicle',
                                                            'Debits')
                                                   AND hd_posted = 'Y'
                                                   AND hd_complete = 'Y'
                                                   AND hd_status = 'Completed'
                                                   AND TRUNC (hd_gl_date) BETWEEN  (
                                                                                      :p_fm_dt)
                                                                              AND  (
                                                                                      :p_to_dt)))
                     WHERE     NVL (broker_comm_fc, 0) - NVL (calc_fc_tax, 0) > 0
                           AND   NVL (broker_comm_fc, 0)
                               - NVL (calc_fc_tax, 0)
                               - NVL (fc_paid_comm, 0) >
                               0)
          GROUP BY pr_org_code,
                   pr_pl_index,
                   pr_end_index,
                   pr_net_effect,
                   pr_pl_no,
                   pr_end_no,
                   pr_gl_date,
                   pr_int_aent_code,
                   pr_int_ent_code,
                   pr_assr_aent_code,
                   pr_assr_ent_code,
                   pr_catg_name,
                   pr_intermediary,
                   fc_paid_prem,
                   fc_paid_comm,
                   calc_fc_tax,
                   fc_basic_premium,
                   pr_cur_code,
                   pr_insured)
   WHERE (CASE
              WHEN pr_net_effect = 'Debit'
              THEN
                  (NVL (fc_total_premium, 0) - NVL (fc_paid_prem, 0))
              ELSE
                  0
          END) <=
         NVL (
             PKG_SYSTEM_ADMIN.GET_SYSTEM_DESC ('ApPaymentCodes',
                                               'MinPremiumComm'),
             0)
--  &p_status_where
ORDER BY pr_int_aent_code, pr_intermediary, pr_pl_no DESC`,
          {
            p_intermediary: clientCode,
            p_org_code: "50",
            p_currency: "",
            p_fm_dt: new Date(fromDate),
            p_to_dt: new Date(toDate),
            p_branch: "",
          }
        );
      } else {
        return res.status(200).json({ success: false, results: [] });
      }
      if ((await results).rows && (await results).rows.length > 0) {
        const formattedData = (await results).rows?.map((row) => ({
          policyNo: row[4],
          endNo: row[5],
          glDate: row[6],
          insured: row[13],
          totalPremium: row[19],
          paidPremium: row[20],
          osPremium: row[19] - row[20],
          basicPremium: row[18],
          commRate: row[16],
          commission: row[16],
          WHTonComm: row[17],
          paidComm: row[21],
          netPayable: row[17] - row[21],
          currencyCode: row[14],
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
          (await connection).release();
          console.info("Connection closed successfully");
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}

const commisionPayableController = new CommisionPayableController();
export default commisionPayableController;
