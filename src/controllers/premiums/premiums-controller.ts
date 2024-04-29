import { Request, Response } from "express";
import pool from "../../config/oracledb-connect";

class PremiumController {
  async getPremiumsAndCommission(req: Request, res: Response) {
    let connection;
    let results: any;
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
          `SELECT NVL (
           SUM (
               CASE
                   WHEN (pr_int_end_code = '000' AND pr_bus_type != '3000')
                   THEN
                       (CASE
                            WHEN a.pr_net_effect IN ('Credit')
                            THEN
                                (  ((  (  NVL (a.pr_fc_prem, 0)
                                        + NVL (a.pr_fc_eartquake, 0)
                                        + NVL (a.pr_fc_political, 0))
                                     * -1))
                                 * a.pr_cur_rate)
                            ELSE
                                (  (  NVL (a.pr_fc_prem, 0)
                                    + NVL (a.pr_fc_eartquake, 0)
                                    + NVL (a.pr_fc_political, 0))
                                 * a.pr_cur_rate)
                        END)
                   ELSE
                       0
               END),
           0)    pr_nb,
       NVL (
           SUM (
               CASE
                   WHEN (pr_int_end_code = '110' AND pr_bus_type != '3000')
                   THEN
                       (CASE
                            WHEN a.pr_net_effect IN ('Credit')
                            THEN
                                (  ((  (  NVL (a.pr_fc_prem, 0)
                                        + NVL (a.pr_fc_eartquake, 0)
                                        + NVL (a.pr_fc_political, 0))
                                     * -1))
                                 * a.pr_cur_rate)
                            ELSE
                                (  (  NVL (a.pr_fc_prem, 0)
                                    + NVL (a.pr_fc_eartquake, 0)
                                    + NVL (a.pr_fc_political, 0))
                                 * a.pr_cur_rate)
                        END)
                   ELSE
                       0
               END),
           0)    pr_ren,
       NVL (
           SUM (
               CASE
                   WHEN (    pr_int_end_code IN ('102',
                                                 '104',
                                                 '108',
                                                 '112')
                         AND pr_bus_type != '3000')
                   THEN
                       (CASE
                            WHEN a.pr_net_effect IN ('Credit')
                            THEN
                                (  ((  (  NVL (a.pr_fc_prem, 0)
                                        + NVL (a.pr_fc_eartquake, 0)
                                        + NVL (a.pr_fc_political, 0))
                                     * -1))
                                 * a.pr_cur_rate)
                            ELSE
                                (  (  NVL (a.pr_fc_prem, 0)
                                    + NVL (a.pr_fc_eartquake, 0)
                                    + NVL (a.pr_fc_political, 0))
                                 * a.pr_cur_rate)
                        END)
                   ELSE
                       0
               END),
           0)    pr_refund,
       NVL (
           SUM (
               CASE
                   WHEN (    pr_int_end_code NOT IN ('102',
                                                     '104',
                                                     '108',
                                                     '112',
                                                     '110',
                                                     '000')
                         AND pr_bus_type != '3000')
                   THEN
                       (CASE
                            WHEN a.pr_net_effect IN ('Credit')
                            THEN
                                (  ((  (  NVL (a.pr_fc_prem, 0)
                                        + NVL (a.pr_fc_eartquake, 0)
                                        + NVL (a.pr_fc_political, 0))
                                     * -1))
                                 * a.pr_cur_rate)
                            ELSE
                                (  (  NVL (a.pr_fc_prem, 0)
                                    + NVL (a.pr_fc_eartquake, 0)
                                    + NVL (a.pr_fc_political, 0))
                                 * a.pr_cur_rate)
                        END)
                   ELSE
                       0
               END),
           0)    pr_additional,
       NVL (
           SUM (
               CASE
                   WHEN (pr_bus_type = '3000')
                   THEN
                       (CASE
                            WHEN a.pr_net_effect IN ('Credit')
                            THEN
                                (  ((  (  NVL (a.pr_fc_prem, 0)
                                        + NVL (a.pr_fc_eartquake, 0)
                                        + NVL (a.pr_fc_political, 0))
                                     * -1))
                                 * a.pr_cur_rate)
                            ELSE
                                (  (  NVL (a.pr_fc_prem, 0)
                                    + NVL (a.pr_fc_eartquake, 0)
                                    + NVL (a.pr_fc_political, 0))
                                 * a.pr_cur_rate)
                        END)
                   ELSE
                       0
               END),
           0)    pr_facin,
       NVL (
           SUM (
               CASE
                   WHEN a.pr_net_effect IN ('Credit')
                   THEN
                       (NVL (a.pr_fc_broker_comm, 0) * -1 * a.pr_cur_rate)
                   ELSE
                       (NVL (a.pr_fc_broker_comm, 0) * a.pr_cur_rate)
               END),
           0)    pr_commission
  FROM uw_premium_register a, all_entity b
 WHERE     TRUNC (pr_gl_date) BETWEEN :p_fm_dt AND :p_to_dt
       AND a.pr_int_aent_code = b.ENT_AENT_CODE
       AND a.pr_int_ent_code = b.ENT_CODE
       AND a.pr_int_aent_code = NVL ( :intermediaryCode, a.pr_int_aent_code)
       AND a.pr_int_ent_code = NVL ( :clientCode, a.pr_int_ent_code)`,
          {
            p_fm_dt: fromDate,
            p_to_dt: toDate,
            intermediaryCode: intermediaryCode,
            clientCode: clientCode,
          }
        );
      } else {
        results = (await connection).execute(
          `SELECT NVL (
           SUM (
               CASE
                   WHEN (pr_int_end_code = '000' AND pr_bus_type != '3000')
                   THEN
                       (CASE
                            WHEN a.pr_net_effect IN ('Credit')
                            THEN
                                (  ((  (  NVL (a.pr_fc_prem, 0)
                                        + NVL (a.pr_fc_eartquake, 0)
                                        + NVL (a.pr_fc_political, 0))
                                     * -1))
                                 * a.pr_cur_rate)
                            ELSE
                                (  (  NVL (a.pr_fc_prem, 0)
                                    + NVL (a.pr_fc_eartquake, 0)
                                    + NVL (a.pr_fc_political, 0))
                                 * a.pr_cur_rate)
                        END)
                   ELSE
                       0
               END),
           0)    pr_nb,
       NVL (
           SUM (
               CASE
                   WHEN (pr_int_end_code = '110' AND pr_bus_type != '3000')
                   THEN
                       (CASE
                            WHEN a.pr_net_effect IN ('Credit')
                            THEN
                                (  ((  (  NVL (a.pr_fc_prem, 0)
                                        + NVL (a.pr_fc_eartquake, 0)
                                        + NVL (a.pr_fc_political, 0))
                                     * -1))
                                 * a.pr_cur_rate)
                            ELSE
                                (  (  NVL (a.pr_fc_prem, 0)
                                    + NVL (a.pr_fc_eartquake, 0)
                                    + NVL (a.pr_fc_political, 0))
                                 * a.pr_cur_rate)
                        END)
                   ELSE
                       0
               END),
           0)    pr_ren,
       NVL (
           SUM (
               CASE
                   WHEN (    pr_int_end_code IN ('102',
                                                 '104',
                                                 '108',
                                                 '112')
                         AND pr_bus_type != '3000')
                   THEN
                       (CASE
                            WHEN a.pr_net_effect IN ('Credit')
                            THEN
                                (  ((  (  NVL (a.pr_fc_prem, 0)
                                        + NVL (a.pr_fc_eartquake, 0)
                                        + NVL (a.pr_fc_political, 0))
                                     * -1))
                                 * a.pr_cur_rate)
                            ELSE
                                (  (  NVL (a.pr_fc_prem, 0)
                                    + NVL (a.pr_fc_eartquake, 0)
                                    + NVL (a.pr_fc_political, 0))
                                 * a.pr_cur_rate)
                        END)
                   ELSE
                       0
               END),
           0)    pr_refund,
       NVL (
           SUM (
               CASE
                   WHEN (    pr_int_end_code NOT IN ('102',
                                                     '104',
                                                     '108',
                                                     '112',
                                                     '110',
                                                     '000')
                         AND pr_bus_type != '3000')
                   THEN
                       (CASE
                            WHEN a.pr_net_effect IN ('Credit')
                            THEN
                                (  ((  (  NVL (a.pr_fc_prem, 0)
                                        + NVL (a.pr_fc_eartquake, 0)
                                        + NVL (a.pr_fc_political, 0))
                                     * -1))
                                 * a.pr_cur_rate)
                            ELSE
                                (  (  NVL (a.pr_fc_prem, 0)
                                    + NVL (a.pr_fc_eartquake, 0)
                                    + NVL (a.pr_fc_political, 0))
                                 * a.pr_cur_rate)
                        END)
                   ELSE
                       0
               END),
           0)    pr_additional,
       NVL (
           SUM (
               CASE
                   WHEN (pr_bus_type = '3000')
                   THEN
                       (CASE
                            WHEN a.pr_net_effect IN ('Credit')
                            THEN
                                (  ((  (  NVL (a.pr_fc_prem, 0)
                                        + NVL (a.pr_fc_eartquake, 0)
                                        + NVL (a.pr_fc_political, 0))
                                     * -1))
                                 * a.pr_cur_rate)
                            ELSE
                                (  (  NVL (a.pr_fc_prem, 0)
                                    + NVL (a.pr_fc_eartquake, 0)
                                    + NVL (a.pr_fc_political, 0))
                                 * a.pr_cur_rate)
                        END)
                   ELSE
                       0
               END),
           0)    pr_facin,
       NVL (
           SUM (
               CASE
                   WHEN a.pr_net_effect IN ('Credit')
                   THEN
                       (NVL (a.pr_fc_broker_comm, 0) * -1 * a.pr_cur_rate)
                   ELSE
                       (NVL (a.pr_fc_broker_comm, 0) * a.pr_cur_rate)
               END),
           0)    pr_commission
  FROM uw_premium_register a, all_entity b
 WHERE     TRUNC (pr_gl_date) BETWEEN :p_fm_dt AND :p_to_dt
       AND a.PR_ASSR_AENT_CODE = b.ENT_AENT_CODE
       AND a.PR_ASSR_ENT_CODE = b.ENT_CODE
       AND a.PR_ASSR_AENT_CODE =
           NVL ( :intermediaryCode, a.PR_ASSR_AENT_CODE)
       AND a.PR_ASSR_ENT_CODE = NVL ( :clientCode, a.PR_ASSR_ENT_CODE)`,
          {
            p_fm_dt: fromDate,
            p_to_dt: toDate,
            intermediaryCode: intermediaryCode,
            clientCode: clientCode,
          }
        );
      }

      if ((await results).rows && (await results).rows.length > 0) {
        const formattedData = (await results).rows?.map((row: any) => ({
          newBusiness: row[0],
          renewals: row[1],
          refund: row[2],
          additional: row[3],
          facin: row[4],
          commission: row[5],
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
    }
  }
}

const premiumController = new PremiumController();
export default premiumController;
