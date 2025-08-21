// src/routes/travelInsurance.service.js
import pool from "../../config/oracledb-connect.js";

export class TravelInsuranceService {
  // ---------- unchanged ----------
  static async getTravelCertificates(req, res) {
    let connection;
    let results;
    try {
      const { intermediaryCode, clientCode } = req.body;
      connection = (await pool).getConnection();
      console.log("Database is connected");

      if (["15", "70", "25"].includes(String(intermediaryCode))) {
        results = (await connection).execute(
          `SELECT pl_no,
                  pl_end_no,
                  PKG_SYSTEM_ADMIN.GET_ENTITY_NAME (pl_int_aent_code, pl_int_ent_code) intermediary,
                  PKG_SYSTEM_ADMIN.GET_ENTITY_NAME (pl_assr_aent_code, pl_assr_ent_code) insured,
                  pl_flex09 travel_cert_no,
                  pl_flex10 travel_cert_url
             FROM uw_policy a, uw_policy_class
            WHERE pl_org_code = pc_org_code
              AND pl_index = pc_pl_index
              AND pl_end_index = pc_end_index
              AND pc_mc_code = '14'
              AND pl_type = 'Normal'
              AND pl_flex09 IS NOT NULL
              AND pl_int_aent_code = :p_intermediary_aent_code
              AND pl_int_ent_code = :p_intermediary_ent_code
         ORDER BY a.created_on DESC`,
          {
            p_intermediary_aent_code: intermediaryCode,
            p_intermediary_ent_code: clientCode,
          }
        );
      } else {
        return res.json({ success: true, results: [] });
      }

      if ((await results).rows?.length) {
        const formattedData = (await results).rows.map((row) => ({
          policyNo: row[0],
          endNo: row[1],
          intermediary: row[2],
          insured: row[3],
          travelCertNo: row[4],
          travelCertUrl: row[5],
        }));
        return res.json({ success: true, results: formattedData });
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

  // ---------- helpers ----------
  static resolveCoverageType(policyProductCode) {
    // Robust mapping: supports number or string codes; supports underscores or spaces in DB
    const code = Number(policyProductCode);
    const map = {
      140: ["BUDGET"],
      141: ["SCHENGEN"],
      142: ["GLOBAL BASIC", "GLOBAL_BASIC"],
      143: ["GLOBAL PLUS", "GLOBAL_PLUS"],
      144: ["GLOBAL EXTRA", "GLOBAL_EXTRA"],
    };
    const options = map[code];
    if (!options) return null;
    // Prefer the space version (first entry) as your DB seemed to accept e.g. "SCHENGEN" and "GLOBAL BASIC"
    return options[0];
  }

  static calcAge(dobStr) {
    // Accepts ISO or "dd-MMM-yyyy"
    const d = new Date(dobStr);
    if (Number.isNaN(d.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
    return age;
  }

  // ---------- DB ----------
  static async fetchPremiumFromDB(
    connection,
    { age, days, coverType, currency, tripType }
  ) {
    if (age == null || days == null || !coverType) {
      throw new Error("Missing required fields (age, days, coverType)");
    }

    const sql = `
      SELECT ROUND(
               TR_RATE
               * NVL(
                   (SELECT TR_RATE
                      FROM tr_travel_rates
                     WHERE TR_CATEGORY = 'Age'
                       AND :p_age BETWEEN tr_from AND tr_to
                       AND tr_cover_type = :p_cover_type),
                   1
                 )
               * (CASE
                    WHEN :p_currency = 'USD' THEN 1
                    WHEN :p_currency = 'KSH' THEN (
                      SELECT rate
                        FROM gl_currency_rates
                       WHERE rate_fm_cur_code = 'USD'
                         AND RATE_TO_CUR_CODE = 'KSH'
                         AND TRUNC(SYSDATE) BETWEEN TRUNC(RATE_FM_DATE) AND TRUNC(RATE_TO_DATE)
                    )
                  END)
             , 2) AS total_premium
        FROM tr_travel_rates
       WHERE TR_CATEGORY = 'Days'
         AND :p_days BETWEEN tr_from AND tr_to
         AND tr_cover_type = :p_cover_type
         AND tr_trip_type = NVL(:p_trip_type, 'SINGLE_TRIP')
    `;

    // Your DB columns are VARCHAR2, so bind as strings
    const binds = {
      p_age: String(age),
      p_days: String(days),
      p_cover_type: String(coverType),
      p_currency: String(currency || "USD"),
      p_trip_type: String(tripType || "SINGLE_TRIP"),
    };

    const result = await connection.execute(sql, binds);
    if (result.rows?.length) {
      return Number(result.rows[0][0]); // single number
    }
    throw new Error(
      `No premium for age=${age}, days=${days}, coverType=${coverType}, tripType=${tripType}, currency=${currency}`
    );
  }

  // ---------- business logic ----------
  static async calculatePremiumsInternal(connection, policyDetails) {
    const {
      firstName,
      passportNo,
      duration,
      otherTravellers,
      policyProductCode,
      dob,
      currency,
      tripType,
    } = policyDetails;

    // Resolve cover type from product code
    const coverageType = this.resolveCoverageType(policyProductCode);
    if (!coverageType) throw new Error("Invalid cover code");

    const breakdown = [];
    let total = 0;

    const addTravellerPremium = async (trav, label) => {
      const age = this.calcAge(trav.dob);
      if (age == null || age < 0) {
        // Skip obviously invalid DOBs rather than crashing
        breakdown.push({
          name: trav.firstName || label,
          passport: trav.passportNo || "N/A",
          dob: trav.dob,
          age: null,
          premium: 0,
          error: "Invalid DOB",
        });
        return 0;
      }

      const p = await this.fetchPremiumFromDB(connection, {
        age,
        days: duration,
        coverType: coverageType,
        currency,
        tripType,
      });

      breakdown.push({
        name: trav.firstName || label,
        passport: trav.passportNo || "N/A",
        dob: trav.dob,
        age,
        premium: +Number(p).toFixed(2),
      });
      return Number(p);
    };

    // Principal
    total += await addTravellerPremium(
      { firstName, passportNo, dob },
      "Principal"
    );

    // Others — handle safely if it's not an array
    if (Array.isArray(otherTravellers) && otherTravellers.length) {
      for (let i = 0; i < otherTravellers.length; i++) {
        total += await addTravellerPremium(
          otherTravellers[i],
          `Traveller ${i + 1}`
        );
      }
    }

    return {
      policyProductCode: Number(policyProductCode),
      premiumForeign: +Number(total).toFixed(2), // name kept for compatibility with your FE
      currency, // helpful to keep
      breakdown,
    };
  }

  // ---------- controller ----------
  static async calculateAllPremiums(req, res) {
    let connection;
    try {
      const { policies } = req.body;
      if (!policies || !Array.isArray(policies)) {
        return res.status(400).json({ error: "Missing or invalid policies" });
      }

      connection = await (await pool).getConnection();

      const results = [];
      for (const policy of policies) {
        try {
          const premium = await this.calculatePremiumsInternal(
            connection,
            policy.policyDetails
          );
          results.push({
            policyProductCode: premium.policyProductCode,
            premiumForeign: premium.premiumForeign,
            currency: premium.currency,
            breakdown: premium.breakdown,
          });
        } catch (err) {
          console.error(
            `Error for policyProductCode ${policy?.policyDetails?.policyProductCode}:`,
            err.message
          );
          results.push({
            policyProductCode: Number(policy?.policyDetails?.policyProductCode),
            premiumForeign: null,
            currency: policy?.policyDetails?.currency || "USD",
            breakdown: [],
          });
        }
      }

      return res.status(200).json({ premiums: results });
    } catch (error) {
      console.error("Error in calculateAllPremiums:", error);
      return res.status(500).json({ error: "Error calculating premiums" });
    } finally {
      if (connection) await connection.close();
    }
  }
}
