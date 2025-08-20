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

  static calculatePremiumsInternal(policyDetails) {
    const {
      firstName,
      passportNo,
      duration,
      otherTravellers,
      policyProductCode,
      dob,
      tripType,
    } = policyDetails;

    const coverageMap = {
      140: "BUDGET",
      141: "SCHENGEN",
      142: "GLOBAL_BASIC",
      143: "GLOBAL_PLUS",
      144: "GLOBAL_EXTRA",
    };

    const coverageType = coverageMap[policyProductCode];
    if (!coverageType) {
      throw new Error("Invalid cover code");
    }

    // Premium table (USD)
    const premiumTable = {
      BUDGET: {
        Individual: [12, 16, 22, 24, 25, 39, 60, 79, 95, 133, 241, 333],
      },
      SCHENGEN: {
        Individual: [13, 17, 24, 25, 27, 34, 66, 85, 101, 129, 191, 265],
      },
      GLOBAL_BASIC: {
        Individual: [19, 22, 31, 34, 37, 48, 84, 108, 163, 209, 316, 438],
      },
      GLOBAL_PLUS: {
        Individual: [23, 30, 37, 40, 42, 61, 99, 128, 207, 265, 401, 556],
      },
      GLOBAL_EXTRA: {
        Individual: [26, 35, 42, 43, 48, 70, 111, 144, 237, 305, 461, 639],
      },
    };

    // Duration brackets mapping
    const durationBrackets = [
      { max: 4 }, // index 0
      { max: 7 },
      { max: 10 },
      { max: 15 },
      { max: 21 },
      { max: 30 },
      { max: 60 },
      { max: 90 },
      { max: 180, type: "MULTI_TRIP" }, // index 8
      { max: 365, type: "MULTI_TRIP" }, // index 9
      { max: 180, type: "CONTINUOUS" }, // index 10
      { max: 365, type: "CONTINUOUS" }, // index 11
    ];

    // Pick correct index based on duration and tripType
    let index = durationBrackets.findIndex((b) => {
      if (b.type) {
        return b.max >= duration && tripType === b.type;
      }
      return b.max >= duration && !b.type;
    });

    if (index === -1) {
      throw new Error("Duration not supported");
    }

    // Calculate age
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

    // Age multiplier rules
    const getAgeMultiplier = (age, coverageType) => {
      if (age < 18) return 0.5;
      if (age >= 66 && age <= 75) return 1.5;
      if (age >= 76 && age <= 80) return 2;
      if (age >= 81 && coverageType === "SCHENGEN") return 4;
      return 1;
    };

    // Calculate total premium
    let totalPremiumUSD = 0;
    const principalAge = calcAge(dob);
    const principalPremium = premiumTable[coverageType].Individual[index];
    // totalPremiumUSD +=
    //   principalPremium * getAgeMultiplier(principalAge, coverageType);

    let breakdown = [];

    const addTravellerPremium = (trav, label) => {
      const age = calcAge(trav.dob);
      const basePremium = premiumTable[coverageType].Individual[index];
      const finalPremium = basePremium * getAgeMultiplier(age, coverageType);

      breakdown.push({
        name: trav.firstName || label,
        passport: trav.passportNo || "N/A",
        dob: trav.dob,
        age,
        premium: +finalPremium.toFixed(2),
      });

      return finalPremium;
    };

    // Principal
    totalPremiumUSD += addTravellerPremium(
      { firstName: firstName, passportNo: passportNo, dob },
      "Principal"
    );

    // Other Travellers
    if (Array.isArray(otherTravellers) && otherTravellers.length > 0) {
      otherTravellers.forEach((trav, i) => {
        totalPremiumUSD += addTravellerPremium(trav, `Traveller ${i + 1}`);
      });
    }

    // Reverse calculate base premium from total in table
    const reverseBasePremium = (totalPremiumFromTable) => {
      const stampDutyUSD = 0.5;
      const taxRate = 0.16;
      return (totalPremiumFromTable - stampDutyUSD) / (1 + taxRate);
    };

    // Final price is simply baseTotal + tax + stamp duty (once)
    const stampDutyUSD = 0.5;
    const taxRate = 0.16;
    const taxUSD = +(totalPremiumUSD * taxRate).toFixed(2);

    // Convert to KES
    const exchangeRate = 130;
    const premiumLocal = +(totalPremiumUSD * exchangeRate).toFixed(2);

    const chargeForeign = {
      tax: taxUSD.toFixed(2),
      stampDuty: stampDutyUSD.toFixed(2),
    };
    const chargeLocal = {
      tax: +(taxUSD * exchangeRate).toFixed(2),
      stampDuty: +(stampDutyUSD * exchangeRate).toFixed(2),
    };

    return {
      policyProductCode,
      premiumForeign: +totalPremiumUSD.toFixed(2),
      premiumLocal,
      breakdown,
      charges: {
        chargeForeign,
        chargeLocal,
      },
      exchangeRate,
    };
  }

  static calculateAllPremiums(req, res) {
    try {
      const { policies } = req.body;
      if (!Array.isArray(policies)) {
        return res.status(400).json({ error: "Invalid policies format" });
      }

      const results = policies.map((policy) => {
        try {
          return this.calculatePremiumsInternal(policy.policyDetails);
        } catch (err) {
          return {
            policyProductCode: policy.policyDetails.policyProductCode,
            premiumForeign: null,
          };
        }
      });

      return res.status(200).json({ premiums: results });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error calculating premiums" });
    }
  }
}
