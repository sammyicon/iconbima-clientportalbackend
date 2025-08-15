import pool from "../../config/oracledb-connect.js";

export class TravelInsuranceService {
  static async getTravelCertificates(req, res) {
    let connection;
    let results;
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
       AND pl_flex09 IS NOT NULL
       AND pl_int_aent_code = :p_intermediary_aent_code
       AND pl_int_ent_code = :p_intermediary_ent_code order by a.created_on desc`,
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
        const formattedData = (await results).rows?.map((row) => ({
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

  static calculatePremiums(req, res) {
    try {
      const { policyPayload } = req.body;
      const { duration, otherTravellers, policyProductCode, dob, tripType } =
        policyPayload.policyDetails;

      // Map your cover codes to coverage names
      const coverageMap = {
        140: "BUDGET",
        141: "SCHENGEN",
        142: "GLOBAL_BASIC",
        143: "GLOBAL_PLUS",
        144: "GLOBAL_EXTRA",
      };

      const coverageType = coverageMap[policyProductCode];
      if (!coverageType) {
        return res.status(400).json({ error: "Invalid cover code" });
      }

      // Premium table (USD values from your brochure)
      const premiumTable = {
        BUDGET: {
          Individual: [12, 16, 22, 24, 25, 39, 60, 79, 95, 133, 241, 333],
          Family: [28, 37, 51, 55, 58, 90, 137, 183, 220, 305, 553, 767],
        },
        SCHENGEN: {
          Individual: [13, 17, 24, 25, 27, 34, 66, 85, 101, 129, 191, 265],
          Family: [29, 39, 55, 57, 60, 77, 149, 192, 229, 293, 434, 603],
        },
        GLOBAL_BASIC: {
          Individual: [19, 22, 31, 34, 37, 48, 84, 108, 163, 209, 316, 438],
          Family: [43, 51, 72, 77, 84, 111, 192, 248, 375, 481, 727, 1008],
        },
        GLOBAL_PLUS: {
          Individual: [23, 30, 37, 40, 42, 61, 99, 128, 207, 265, 401, 556],
          Family: [53, 70, 85, 91, 96, 140, 228, 294, 475, 611, 923, 1279],
        },
        GLOBAL_EXTRA: {
          Individual: [26, 35, 42, 43, 48, 70, 111, 144, 237, 305, 461, 639],
          Family: [60, 80, 97, 98, 110, 161, 256, 331, 546, 701, 1060, 1469],
        },
      };

      // Duration brackets mapping (indexes correspond to premiumTable arrays)
      const durationBrackets = [
        4, // index 0
        7, // index 1
        10, // index 2
        15, // index 3
        21, // index 4
        30, // index 5
        60, // index 6
        90, // index 7
        180, // index 8 (multi-trip: max 92 days each)
        365, // index 9 (multi-trip annual)
        180, // index 10 (continuous trip)
        365, // index 11 (continuous annual)
      ];

      // Special handling for 180/365 cases
      let index;
      if (duration > 90) {
        if (tripType === "MULTI_TRIP") {
          if (duration <= 180) index = 8;
          else if (duration <= 365) index = 9;
        } else if (tripType === "CONTINUOUS") {
          if (duration <= 180) index = 10;
          else if (duration <= 365) index = 11;
        }
      } else {
        index = durationBrackets.findIndex((max) => duration <= max);
      }

      if (index === undefined || index === -1) {
        return res.status(400).json({ error: "Duration not supported" });
      }

      // Function to calculate age
      const calcAge = (dobStr) => {
        const birthDate = new Date(dobStr);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      };

      // Function to get age multiplier
      const getAgeMultiplier = (age, coverageType) => {
        if (age < 18) return 0.5; // Children
        if (age >= 66 && age <= 75) return 1.5;
        if (age >= 76 && age <= 80) return 2;
        if (age >= 81 && coverageType === "SCHENGEN") return 4;
        return 1; // Default adult 18–65
      };

      // Calculate total premium for all travelers
      let totalPremiumUSD = 0;

      // Principal traveler
      const principalAge = calcAge(dob);
      const principalBasePremium =
        premiumTable[coverageType]["Individual"][index];
      totalPremiumUSD +=
        principalBasePremium * getAgeMultiplier(principalAge, coverageType);

      // Additional travelers
      if (Array.isArray(otherTravellers) && otherTravellers.length > 0) {
        otherTravellers.forEach((trav) => {
          const age = calcAge(trav.dob);
          const base = premiumTable[coverageType]["Individual"][index];
          totalPremiumUSD += base * getAgeMultiplier(age, coverageType);
        });
      }

      // Tax and charges
      const taxRate = 0.16;
      const stampDutyUSD = 2;
      const taxUSD = +(totalPremiumUSD * taxRate).toFixed(2);

      const chargeForeign = {
        tax: taxUSD,
        stampDuty: stampDutyUSD,
      };

      // Convert to KES
      const exchangeRate = 130;
      const premiumLocal = +(totalPremiumUSD * exchangeRate).toFixed(2);

      const chargeLocal = {
        tax: +(taxUSD * exchangeRate).toFixed(2),
        stampDuty: +(stampDutyUSD * exchangeRate).toFixed(2),
      };

      // Return result
      return res.status(200).json({
        premiumForeign: +totalPremiumUSD.toFixed(2),
        premiumLocal,
        charges: {
          chargeForeign,
          chargeLocal,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error calculating premium" });
    }
  }
}
