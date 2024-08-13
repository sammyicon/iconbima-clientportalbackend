import { Response, Request } from "express";
import pool from "../../config/oracledb-connect";
import { config } from "dotenv";
config();

class ExpectedRenewals {
  async getExpectedRenewals(req: Request, res: Response) {
    let connection;
    let results: any;
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
          ` SELECT DISTINCT
       pl_org_code,
       pl_index,
       pl_no,
       pl_os_code,
       pl_end_internal_code,
       pl_pr_code,
       pl_os_code || ' Totals'
           os_code,
       pkg_sa.org_structure_name (pl_org_code, pl_os_code)
           os_name,
       pl_status,
       pkg_uw.get_product_name (pl_org_code, pl_pr_code)
           pl_product,
       TRUNC (pl_to_dt)
           pl_to_dt,
       pkg_system_admin.get_entity_name (pl_assr_aent_code, pl_assr_ent_code)
           pl_insured,
       pkg_system_admin.get_entity_name (pl_int_aent_code, pl_int_ent_code)
           pl_intermediary,
       NVL (lr_ratio, 0)
           lr_ratio,
       pl_int_aent_code,
       pl_int_ent_code,
       pl_assr_aent_code,
       (SELECT pn_note
          FROM uw_policy_notes
         WHERE pn_pl_index = a.pl_index AND ROWNUM = 1)
           reasons,
       pl_assr_ent_code,
       NVL (pl_flex19, 'Un-Tagged')
           pl_reason,
       NVL (pl_flex20, 'Not Provided')
           pl_remarks,
       (NVL (sv_fc_si, 0) * pl_cur_rate)
           pr_si,
       (NVL (sv_fc_prem, 0) * pl_cur_rate)
           pl_tot_prem,
       NVL (PM_REN_FC_PREM, 0)
           pl_fap
  FROM (SELECT *
          FROM (SELECT aa.*,
                       RANK ()
                           OVER (PARTITION BY pl_index
                                 ORDER BY pl_end_index DESC)    rnk
                  FROM uh_policy aa
                 WHERE     TRUNC (pl_to_dt + 1) BETWEEN TRUNC ( :p_fm_dt)
                                                    AND TRUNC ( :p_to_dt)
                       AND TRUNC (pl_fm_dt) NOT BETWEEN TRUNC ( :p_fm_dt)
                                                    AND TRUNC ( :p_to_dt))
         WHERE rnk = 1) a,
       uh_policy_class  b,
       (  SELECT sv_org_code,
                 sv_pl_index,
                 sv_end_index,
                 NVL (SUM (NVL (sv_fc_si, 0)), 0)       sv_fc_si,
                 NVL (SUM (NVL (sv_fc_prem, 0)), 0)     sv_fc_prem
            FROM uh_policy_risk_covers
        GROUP BY sv_org_code, sv_pl_index, sv_end_index) c,
       (SELECT DISTINCT NVL (os_org_code, :p_org_code)     os_org_code,
                        NVL (os_code, '100')               os_code,
                        NVL (os_name, 'Un-Assigned')       os_name,
                        NVL (os_ref_os_code, os_code)      os_ref_os_code,
                        os_type,
                        ent_code,
                        ent_aent_code
          FROM hi_org_structure, all_entity
         WHERE ent_os_code = os_code(+)) k,
       (  SELECT SUM (PM_REN_FC_PREM) PM_REN_FC_PREM, pm_pl_index
            FROM uw_policy_risk_smi
        GROUP BY pm_pl_index) r,
       (  SELECT lr_pl_index,
                 LR_INT_AENT_CODE,
                 LR_INT_ENT_CODE,
                 AVG (lr_ratio)     lr_ratio
            FROM uw_policy_loss_ratio
           WHERE lr_date = (SELECT MAX (lr_date) FROM uw_policy_loss_ratio)
        GROUP BY lr_pl_index, LR_INT_AENT_CODE, LR_INT_ENT_CODE) q
 WHERE     pl_org_code = :p_org_code
       AND pl_org_code = b.pc_org_code
       AND pl_index = b.pc_pl_index
       AND pl_status IN ('Active', 'Endorsed', 'Open')
       AND pl_index NOT IN
               (SELECT pl_index
                  FROM uw_policy
                 WHERE pl_status NOT IN ('Active', 'Endorsed', 'Open'))
       AND a.pl_org_code = k.os_org_code
       AND a.pl_int_aent_code = k.ent_aent_code
       AND a.pl_int_ent_code = k.ent_code
       AND a.pl_org_code = c.sv_org_code(+)
       AND a.pl_org_code = c.sv_org_code(+)
       AND a.pl_index = c.sv_pl_index(+)
       AND a.pl_end_index = c.sv_end_index(+)
       AND a.pl_index = r.pm_pl_index(+)
       AND a.pl_index = q.lr_pl_index(+)
        AND a.PL_INT_AENT_CODE = NVL ( :intermerdiaryCode,a.PL_INT_AENT_CODE)
         and a.PL_INT_ENT_CODE=nvl(:clientCode,a.pl_int_ent_code)
       AND a.pl_int_aent_code =
            q.LR_INT_AENT_CODE(+)
       AND a.pl_int_ent_code =  q.LR_INT_ENT_CODE(+)
       AND (SELECT COUNT (*)
              FROM uw_endorsements
             WHERE     pe_org_code = pl_org_code
                   AND pe_pl_index = pl_index
                   AND pe_int_end_code IN ('110', '103')
                   AND pe_status = 'Approved'
                   AND TRUNC (pe_fm_date) BETWEEN TRUNC ( :p_fm_dt)
                                              AND TRUNC ( :p_to_dt)) =
           0
       /*and (select count (*)
              from uw_policy_renewals
             where     pe_org_code = pl_org_code
                   and pe_pl_index = pl_index
                   and pkg_uw.get_internal_end_code (pe_org_code,
                                                     pe_end_code) = '110'
                   and trunc (pe_fm_date) between trunc (:p_fm_dt)
                                              and trunc (:p_to_dt )) = 0*/
       AND (SELECT pl_oneoff
              FROM uw_policy
             WHERE pl_index = a.pl_index) = 'N'
       AND pl_type = 'Normal'
       AND TRUNC (pl_to_dt + 1) BETWEEN TRUNC ( :p_fm_dt)
                                    AND TRUNC ( :p_to_dt)`,
          {
            clientCode: clientCode,
            intermerdiaryCode: intermediaryCode,
            p_org_code: "50",
            p_fm_dt: fromDate,
            p_to_dt: toDate,
          }
        );
      } else {
        return res.status(200).json({ success: false, results: [] });
      }
      if ((await results).rows && (await results).rows.length > 0) {
        const formattedData = (await results).rows?.map((row: any) => ({
          policyNo: row[2],
          insured: row[11],
          intermediary: row[12],
          product: row[9],
          expiryDate: row[10],
          sumInsured: row[21],
          currentPremium: row[22],
          renewalPremium: row[23],
          lossRatio: row[13],
          branch: row[7],
          phoneNo: row[17],
          email: row[18],
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

const expectedRenewals = new ExpectedRenewals();
export default expectedRenewals;
