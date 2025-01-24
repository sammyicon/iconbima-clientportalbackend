import pool from "../../config/oracledb-connect.js";

class PremiumReportsController {
  async getPremiumReports(req, res) {
    let connection;
    let results;
    try {
      const { intermediaryCode, clientCode, fromDate, toDate } = req.body;

      connection = (await pool).getConnection();
      console.log("connected to database");
      if (
        intermediaryCode === "15" ||
        intermediaryCode === "70" ||
        intermediaryCode === "25"
      ) {
        results = (await connection).execute(
          `SELECT pr_org_code,
         pr_pl_index,
         pr_end_index,
         pr_pl_no,
         pr_end_no,
         pr_issue_date,
         pr_gl_date,
         pr_fm_dt,
         pr_to_dt,
         pr_mc_code,
         UPPER ( pr_mc_name)
             pr_class,
         pr_sc_code,
         pr_sc_code
             pr_sc_code_i,
          pr_sc_name
             pr_sub_class,
         pr_pr_code,
         pr_pr_code || ' - ' || pr_pr_name
             pr_product,
         pr_int_aent_code,
         pr_int_ent_code,
         pr_int_ent_name
             pr_intermediary,
         pr_assr_aent_code,
         pr_assr_ent_code,
         pr_assr_ent_name
             pr_insured,
         pr_os_code,
         pr_os_name
             pl_os_name,
         pr_int_end_code,
         CASE
             WHEN pr_int_end_code IN ('000') THEN 1
             WHEN pr_int_end_code IN ('110') THEN 4
             WHEN pr_net_effect IN ('Credit') THEN 3
             ELSE 2
         END
             pr_end_order,
         CASE
             WHEN pr_int_end_code IN ('000') THEN 'New Business'
             WHEN pr_int_end_code IN ('110') THEN 'Renewals'
             WHEN pr_net_effect IN ('Credit') THEN 'Refunds'
             ELSE 'Extras'
         END
             pr_end_type,
         pr_cur_code,
         pr_cur_rate,
         pr_net_effect,
         NVL (
             DECODE ( :p_currency,
                     NULL, NVL ((NVL (pr_fc_si, 0) * pr_cur_rate), 0),
                     NVL (pr_fc_si, 0)),
             0)
             pr_lc_si,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL (
                                           (NVL (pr_fc_prem, 0) * pr_cur_rate),
                                           0),
                                 NVL (pr_fc_prem, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL ((NVL (pr_fc_prem, 0) * pr_cur_rate), 0),
                             NVL (pr_fc_prem, 0)),
                         0)
             END,
             0)
             pr_lc_prem,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL (
                                           (  NVL (pr_fc_eartquake, 0)
                                            * pr_cur_rate),
                                           0),
                                 NVL (pr_fc_eartquake, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL (
                                       (NVL (pr_fc_eartquake, 0) * pr_cur_rate),
                                       0),
                             NVL (pr_fc_eartquake, 0)),
                         0)
             END,
             0)
             pr_lc_eartquake,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL (
                                           (  NVL (pr_fc_political, 0)
                                            * pr_cur_rate),
                                           0),
                                 NVL (pr_fc_political, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL (
                                       (NVL (pr_fc_political, 0) * pr_cur_rate),
                                       0),
                             NVL (pr_fc_political, 0)),
                         0)
             END,
             0)
             pr_lc_political,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL (
                                           (  NVL (pr_fc_broker_comm, 0)
                                            * pr_cur_rate),
                                           0),
                                 NVL (pr_fc_broker_comm, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL (
                                       (  NVL (pr_fc_broker_comm, 0)
                                        * pr_cur_rate),
                                       0),
                             NVL (pr_fc_broker_comm, 0)),
                         0)
             END,
             0)
             pr_lc_broker_comm,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL (
                                           (  NVL (pr_fc_broker_tax, 0)
                                            * pr_cur_rate),
                                           0),
                                 NVL (pr_fc_broker_tax, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL (
                                       (NVL (pr_fc_broker_tax, 0) * pr_cur_rate),
                                       0),
                             NVL (pr_fc_broker_tax, 0)),
                         0)
             END,
             0)
             pr_lc_broker_tax,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL (
                                           (  NVL (pr_fc_stamp_duty, 0)
                                            * pr_cur_rate),
                                           0),
                                 NVL (pr_fc_stamp_duty, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL (
                                       (NVL (pr_fc_stamp_duty, 0) * pr_cur_rate),
                                       0),
                             NVL (pr_fc_stamp_duty, 0)),
                         0)
             END,
             0)
             pr_lc_stamp_duty,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL (
                                           (  NVL (pr_fc_phc_fund, 0)
                                            * pr_cur_rate),
                                           0),
                                 NVL (pr_fc_phc_fund, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL (
                                       (NVL (pr_fc_phc_fund, 0) * pr_cur_rate),
                                       0),
                             NVL (pr_fc_phc_fund, 0)),
                         0)
             END,
             0)
             pr_lc_phc_fund,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL (
                                           (  NVL (pr_fc_training_levy, 0)
                                            * pr_cur_rate),
                                           0),
                                 NVL (pr_fc_training_levy, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL (
                                       (  NVL (pr_fc_training_levy, 0)
                                        * pr_cur_rate),
                                       0),
                             NVL (pr_fc_training_levy, 0)),
                         0)
             END,
             0)
             pr_lc_training_levy,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL ((NVL (pr_fc_pta, 0) * pr_cur_rate),
                                            0),
                                 NVL (pr_fc_pta, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL ((NVL (pr_fc_pta, 0) * pr_cur_rate), 0),
                             NVL (pr_fc_pta, 0)),
                         0)
             END,
             0)
             pr_lc_pta,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL ((NVL (pr_fc_aa, 0) * pr_cur_rate),
                                            0),
                                 NVL (pr_fc_pta, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL ((NVL (pr_fc_aa, 0) * pr_cur_rate), 0),
                             NVL (pr_fc_pta, 0)),
                         0)
             END,
             0)
             pr_lc_aa,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL (
                                           (  NVL (pr_fc_loading, 0)
                                            * pr_cur_rate),
                                           0),
                                 NVL (pr_fc_loading, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL ((NVL (pr_fc_loading, 0) * pr_cur_rate),
                                        0),
                             NVL (pr_fc_loading, 0)),
                         0)
             END,
             0)
             pr_lc_loading,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL (
                                           (  NVL (pr_fc_discount, 0)
                                            * pr_cur_rate),
                                           0),
                                 NVL (pr_fc_discount, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL (
                                       (NVL (pr_fc_discount, 0) * pr_cur_rate),
                                       0),
                             NVL (pr_fc_discount, 0)),
                         0)
             END,
             0)
             pr_lc_discount
    FROM uw_premium_register
   WHERE     pr_org_code = :p_org_code
         AND TRUNC (pr_gl_date) BETWEEN :p_fm_dt AND :p_to_dt
         AND pr_int_aent_code = NVL ( :intermediaryCode, pr_int_aent_code)
         AND pr_int_ent_code = NVL ( :clientCode, pr_int_ent_code)
ORDER BY pr_org_code, pr_pl_index, pr_end_index`,
          {
            p_currency: "",
            p_org_code: "50",
            p_fm_dt: fromDate,
            p_to_dt: toDate,
            intermediaryCode: intermediaryCode,
            clientCode: clientCode,
          }
        );
      } else {
        results = (await connection).execute(
          `SELECT pr_org_code,
         pr_pl_index,
         pr_end_index,
         pr_pl_no,
         pr_end_no,
         pr_issue_date,
         pr_gl_date,
         pr_fm_dt,
         pr_to_dt,
         pr_mc_code,
         UPPER ( pr_mc_name)
             pr_class,
         pr_sc_code,
         pr_sc_code
             pr_sc_code_i,
         pr_sc_name
             pr_sub_class,
         pr_pr_code,
         pr_pr_code || ' - ' || pr_pr_name
             pr_product,
         pr_int_aent_code,
         pr_int_ent_code,
         pr_int_ent_name
             pr_intermediary,
         pr_assr_aent_code,
         pr_assr_ent_code,
         pr_assr_ent_name
             pr_insured,
         pr_os_code,
         pr_os_name
             pl_os_name,
         pr_int_end_code,
         CASE
             WHEN pr_int_end_code IN ('000') THEN 1
             WHEN pr_int_end_code IN ('110') THEN 4
             WHEN pr_net_effect IN ('Credit') THEN 3
             ELSE 2
         END
             pr_end_order,
         CASE
             WHEN pr_int_end_code IN ('000') THEN 'New Business'
             WHEN pr_int_end_code IN ('110') THEN 'Renewals'
             WHEN pr_net_effect IN ('Credit') THEN 'Refunds'
             ELSE 'Extras'
         END
             pr_end_type,
         pr_cur_code,
         pr_cur_rate,
         pr_net_effect,
         NVL (
             DECODE ( :p_currency,
                     NULL, NVL ((NVL (pr_fc_si, 0) * pr_cur_rate), 0),
                     NVL (pr_fc_si, 0)),
             0)
             pr_lc_si,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL (
                                           (NVL (pr_fc_prem, 0) * pr_cur_rate),
                                           0),
                                 NVL (pr_fc_prem, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL ((NVL (pr_fc_prem, 0) * pr_cur_rate), 0),
                             NVL (pr_fc_prem, 0)),
                         0)
             END,
             0)
             pr_lc_prem,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL (
                                           (  NVL (pr_fc_eartquake, 0)
                                            * pr_cur_rate),
                                           0),
                                 NVL (pr_fc_eartquake, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL (
                                       (NVL (pr_fc_eartquake, 0) * pr_cur_rate),
                                       0),
                             NVL (pr_fc_eartquake, 0)),
                         0)
             END,
             0)
             pr_lc_eartquake,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL (
                                           (  NVL (pr_fc_political, 0)
                                            * pr_cur_rate),
                                           0),
                                 NVL (pr_fc_political, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL (
                                       (NVL (pr_fc_political, 0) * pr_cur_rate),
                                       0),
                             NVL (pr_fc_political, 0)),
                         0)
             END,
             0)
             pr_lc_political,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL (
                                           (  NVL (pr_fc_broker_comm, 0)
                                            * pr_cur_rate),
                                           0),
                                 NVL (pr_fc_broker_comm, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL (
                                       (  NVL (pr_fc_broker_comm, 0)
                                        * pr_cur_rate),
                                       0),
                             NVL (pr_fc_broker_comm, 0)),
                         0)
             END,
             0)
             pr_lc_broker_comm,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL (
                                           (  NVL (pr_fc_broker_tax, 0)
                                            * pr_cur_rate),
                                           0),
                                 NVL (pr_fc_broker_tax, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL (
                                       (NVL (pr_fc_broker_tax, 0) * pr_cur_rate),
                                       0),
                             NVL (pr_fc_broker_tax, 0)),
                         0)
             END,
             0)
             pr_lc_broker_tax,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL (
                                           (  NVL (pr_fc_stamp_duty, 0)
                                            * pr_cur_rate),
                                           0),
                                 NVL (pr_fc_stamp_duty, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL (
                                       (NVL (pr_fc_stamp_duty, 0) * pr_cur_rate),
                                       0),
                             NVL (pr_fc_stamp_duty, 0)),
                         0)
             END,
             0)
             pr_lc_stamp_duty,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL (
                                           (  NVL (pr_fc_phc_fund, 0)
                                            * pr_cur_rate),
                                           0),
                                 NVL (pr_fc_phc_fund, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL (
                                       (NVL (pr_fc_phc_fund, 0) * pr_cur_rate),
                                       0),
                             NVL (pr_fc_phc_fund, 0)),
                         0)
             END,
             0)
             pr_lc_phc_fund,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL (
                                           (  NVL (pr_fc_training_levy, 0)
                                            * pr_cur_rate),
                                           0),
                                 NVL (pr_fc_training_levy, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL (
                                       (  NVL (pr_fc_training_levy, 0)
                                        * pr_cur_rate),
                                       0),
                             NVL (pr_fc_training_levy, 0)),
                         0)
             END,
             0)
             pr_lc_training_levy,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL ((NVL (pr_fc_pta, 0) * pr_cur_rate),
                                            0),
                                 NVL (pr_fc_pta, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL ((NVL (pr_fc_pta, 0) * pr_cur_rate), 0),
                             NVL (pr_fc_pta, 0)),
                         0)
             END,
             0)
             pr_lc_pta,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL ((NVL (pr_fc_aa, 0) * pr_cur_rate),
                                            0),
                                 NVL (pr_fc_pta, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL ((NVL (pr_fc_aa, 0) * pr_cur_rate), 0),
                             NVL (pr_fc_pta, 0)),
                         0)
             END,
             0)
             pr_lc_aa,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL (
                                           (  NVL (pr_fc_loading, 0)
                                            * pr_cur_rate),
                                           0),
                                 NVL (pr_fc_loading, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL ((NVL (pr_fc_loading, 0) * pr_cur_rate),
                                        0),
                             NVL (pr_fc_loading, 0)),
                         0)
             END,
             0)
             pr_lc_loading,
         NVL (
             CASE
                 WHEN pr_net_effect IN ('Credit')
                 THEN
                     NVL (
                         (  (DECODE (
                                 :p_currency,
                                 NULL, NVL (
                                           (  NVL (pr_fc_discount, 0)
                                            * pr_cur_rate),
                                           0),
                                 NVL (pr_fc_discount, 0)))
                          * -1),
                         0)
                 ELSE
                     NVL (
                         DECODE (
                             :p_currency,
                             NULL, NVL (
                                       (NVL (pr_fc_discount, 0) * pr_cur_rate),
                                       0),
                             NVL (pr_fc_discount, 0)),
                         0)
             END,
             0)
             pr_lc_discount
    FROM uw_premium_register
   WHERE     pr_org_code = :p_org_code
         AND TRUNC (pr_gl_date) BETWEEN :p_fm_dt AND :p_to_dt
         AND pr_assr_aent_code = NVL ( :intermediaryCode, pr_assr_aent_code)
         AND pr_assr_ent_code = NVL ( :clientCode, pr_assr_ent_code)
ORDER BY pr_org_code, pr_pl_index, pr_end_index`,
          {
            p_currency: "",
            p_org_code: "50",
            p_fm_dt: fromDate,
            p_to_dt: toDate,
            intermediaryCode: intermediaryCode,
            clientCode: clientCode,
          }
        );
      }

      if ((await results).rows && (await results).rows.length > 0) {
        const formattedData = (await results).rows?.map((row) => ({
          policyNo: row[3],
          endNo: row[4],
          sumInsured: row[30],
          premClass: row[10],
          premSubClass: row[13],
          insuredName: row[21],
          issueDate: row[5],
          start: row[7],
          expiry: row[8],
          premium: row[31],
          earthQuake: row[32],
          pvt: row[33],
          stamp: row[36],
          PHCfund: row[36],
          traningLevy: row[38],
          PTACharge: row[39],
          AACharge: row[40],
          brokerComm: row[34],
          witHoldingTax: row[35],
          brokerCommNet: row[35],
          netPremium: row[35],
          agent: row[18],
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

const premiumReportsController = new PremiumReportsController();
export default premiumReportsController;
