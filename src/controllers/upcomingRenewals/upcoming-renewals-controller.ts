import { Response, Request } from "express";
import pool from "../../config/oracledb-connect";
import { config } from "dotenv";
config();

class UpcomingRenewals {
  async getUpcomingRenewals(req: Request, res: Response) {
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
          `  SELECT DISTINCT
         pl_org_code,
         pl_index,
         pl_os_code,
         pl_flex19
             pl_reason,
         pl_os_code || ' Totals'
             os_code,
         pkg_sa.org_structure_name (pl_org_code, pl_os_code)
             os_name,
         pl_status,
         pkg_uw.get_product_name (pl_org_code, pl_pr_code)
             pl_product,
         pl_no,
         ROUND (NVL (sv_fc_si, 0), 0)
             pl_si,
         ROUND (NVL (sv_fc_prem, 0), 0)
             pl_tot_prem,
         NVL (PM_REN_LC_PREM, 0)
             pl_fap,
         pl_to_dt,
         A.pl_cur_code,
         pkg_system_admin.get_entity_name (pl_assr_aent_code, pl_assr_ent_code)
             pl_insured,
         pkg_system_admin.get_entity_name (pl_int_aent_code, pl_int_ent_code)
             pl_intermediary,
         pl_int_aent_code,
         pl_int_ent_code,
         pl_assr_aent_code,
         pl_assr_ent_code,
         ent_email,
         ENT_CELLPHONE,
         NVL (lr_ratio, 0)
             lr_ratio,
         (SELECT pn_note
            FROM uw_policy_notes
           WHERE pn_pl_index = a.pl_index AND ROWNUM = 1)
             reasons
    FROM (SELECT *
            FROM (SELECT aa.*,
                         RANK ()
                             OVER (PARTITION BY pl_index
                                   ORDER BY pl_end_index DESC)    rnk
                    FROM uh_policy aa
                   WHERE     TRUNC (pl_to_dt + 1) BETWEEN ( :p_fm_dt)
                                                      AND ( :p_to_dt)
                         AND TRUNC (pl_fm_dt) NOT BETWEEN ( :p_fm_dt)
                                                      AND ( :p_to_dt))
           WHERE rnk = 1) a,
         uh_policy_class b,
         (  SELECT sv_org_code,
                   sv_pl_index,
                   sv_end_index,
                   sv_mc_code,
                   sv_sc_code,
                   SUM (NVL (sv_fc_prem, 0))     sv_fc_prem,
                   SUM (NVL (sv_fc_si, 0))       sv_fc_si,
                   SUM (NVL (sv_lc_prem, 0))     sv_lc_prem,
                   SUM (NVL (sv_lc_si, 0))       sv_lc_si
              FROM uh_policy_risk_covers
          GROUP BY sv_org_code,
                   sv_pl_index,
                   sv_end_index,
                   sv_mc_code,
                   sv_sc_code) c,
         (SELECT DISTINCT NVL (os_org_code, :p_org_code)     os_org_code,
                          NVL (os_code, '100')               os_code,
                          NVL (os_name, 'Un-Assigned')       os_name,
                          NVL (os_ref_os_code, os_code)      os_ref_os_code,
                          os_type,
                          ent_code,
                          ent_aent_code,ENT_EMAIL,ENT_CELLPHONE
            FROM hi_org_structure, all_entity
           WHERE ent_os_code = os_code(+)) k,
         (  SELECT lr_pl_index,
                   LR_INT_AENT_CODE,
                   LR_INT_ENT_CODE,
                   AVG (lr_ratio)     lr_ratio
              FROM uw_policy_loss_ratio
             WHERE lr_date = (SELECT MAX (lr_date) FROM uw_policy_loss_ratio)
          GROUP BY lr_pl_index, LR_INT_AENT_CODE, LR_INT_ENT_CODE) q,
         (  SELECT SUM (PM_REN_LC_PREM) PM_REN_LC_PREM, pm_pl_index
              FROM uw_policy_risk_smi
          GROUP BY pm_pl_index) r
   WHERE     a.pl_org_code = b.pc_org_code
         AND a.pl_index = b.pc_pl_index
         AND a.pl_end_index = b.pc_end_index
         AND a.pl_org_code = k.os_org_code
         AND a.pl_int_aent_code = k.ent_aent_code
         AND a.pl_int_ent_code = k.ent_code
         AND b.pc_org_code = c.sv_org_code(+)
         AND b.pc_pl_index = c.sv_pl_index(+)
         AND b.pc_end_index = c.sv_end_index(+)
         AND b.pc_mc_code = c.sv_mc_code(+)
         AND a.PL_INT_AENT_CODE = NVL ( :intermerdiaryCode,PL_INT_AENT_CODE)
         and a.PL_INT_ENT_CODE=nvl(:clientCode,pl_int_ent_code)
         AND b.pc_sc_code = c.sv_sc_code(+)
         AND a.pl_index = q.lr_pl_index(+)
         AND a.pl_int_aent_code = q.LR_INT_AENT_CODE(+)
         AND a.pl_int_ent_code = q.LR_INT_ENT_CODE(+)
         AND a.pl_index = r.pm_pl_index(+)
         AND pl_org_code = :p_org_code
         AND pl_status IN ('Active', 'Endorsed', 'Open')
         AND pl_index NOT IN
                 (SELECT pl_index
                    FROM uw_policy
                   WHERE pl_status NOT IN ('Active', 'Endorsed', 'Open'))
         AND (SELECT pl_oneoff
                FROM uw_policy
               WHERE pl_index = a.pl_index) = 'N'
         AND pl_type = 'Normal'
ORDER BY pl_no`,
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
          policyNo: row[8],
          insured: row[14],
          intermediary: row[15],
          product: row[7],
          expiryDate: row[12],
          sumInsured: row[9],
          currentPremium: row[10],
          renewalPremium: row[11],
          lossRatio: row[22],
          branch: row[5],
          phoneNo: row[21],
          email: row[20],
          reason: row[3],
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

const upcomingRenewals = new UpcomingRenewals();
export default upcomingRenewals;
