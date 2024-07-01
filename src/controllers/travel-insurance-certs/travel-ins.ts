import { Request, Response } from "express";
import pool from "../../config/oracledb-connect";

export class TravelInsuranceService {
  static async getTravelCertificates(req: Request, res: Response) {
    let connection;
    let results: any;
    try {
      const { intermediaryCode, clientCode } = req.body;
      connection = (await pool).getConnection();
      console.log("Database is connected");
      if (
        intermediaryCode === "15" ||
        intermediaryCode === "70" ||
        intermediaryCode === "25"
      ) {
        results = (await connection).execute(
          `SELECT pl_no,
       pl_end_no,
       PKG_SYSTEM_ADMIN.GET_ENTITY_NAME (pl_int_aent_code, pl_int_ent_code)
           intermediary,
       PKG_SYSTEM_ADMIN.GET_ENTITY_NAME (pl_assr_aent_code, pl_assr_ent_code)
           insured,
       pl_flex09
           travel_cert_no,
       pl_flex10
           travel_cert_url
  FROM uw_policy a, uw_policy_class
 WHERE     pl_org_code = pc_org_code
       AND pl_index = pc_pl_index
       AND pl_end_index = pc_end_index
       AND pc_mc_code = '14'
       AND pl_type = 'Normal'
       --AND pl_flex09 IS NOT NULL
       AND pl_int_aent_code = :p_intermediary_aent_code
       AND pl_int_ent_code = :p_intermediary_ent_code`,
          {
            p_intermediary_aent_code: intermediaryCode,
            p_intermediary_ent_code: clientCode,
          }
        );
      } else {
        res.json({
          success: true,
          results: [],
        });
      }

      if ((await results).rows && (await results).rows.length > 0) {
        const formattedData = (await results).rows?.map((row: any) => ({
          policyNo: row[0],
          endNo: row[1],
          intermediary: row[2],
          insured: row[3],
          travelCertNo: row[4],
          travelCertUrl: row[5],
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
