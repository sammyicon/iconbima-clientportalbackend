import OracleDB from "oracledb";
import pool from "../../config/oracledb-connect.js";

export class ClientPolicyCreation {
  static async createClient(req, res) {
    let connection;
    try {
      // Destructure required values from request body
      const {
        full_name,
        p_user,
        p_created_ip,
        client_type,
        gender,
        tax_no,
        phoneNumber,
        branch_code,
        email,
        clientIDNo,
      } = req.body;

      // Get connection from pool
      connection = await (await pool).getConnection();
      console.info("Database is connected");

      // PL/SQL Block with bind variables
      const plsqlBlock = `
        DECLARE
          v_client_code pkg_data.v_char_100%TYPE;
          v_message pkg_data.v_char_2000%TYPE;    
          v_count NUMBER := 0;   
        BEGIN
         
          -- Generate entity code
          pkg_system_admin.gen_entity_code_v2(
            p_org_code    => :p_org_code,
            p_aent_code   => '10',
            p_full_name   => :full_name,
            p_user        => :p_user,
            p_ent_code    => v_client_code,
            p_mes         => v_message
          );
          -- Insert entity details
          -- Check if ent_id_no already exists
          SELECT COUNT(*) INTO v_count
             FROM ALL_ENTITY
          WHERE ent_id_no = :clientIDNo and ent_email=:email;

          IF v_count > 0 THEN
            -- If ID already exists, raise an exception
            RAISE_APPLICATION_ERROR(-20001, 'Client with this ID already exists.');
          END IF;
          INSERT INTO ALL_ENTITY (ent_aent_code,
                        ent_code,
                        ent_name,
                        ent_type,
                        ent_gender,
                        ent_tax_no,
                        ent_sector,
                        ent_sub_sector,
                        ent_status,
                        ent_cellphone,
                        ent_email,
                        ent_os_code,created_by,ent_id_no)
     VALUES ('10',
             v_client_code,
             :full_name,
             :client_type,
             :gender,
             :tax_no,
             'BUSINESS',
             'Business',
             'ACTIVE',
             :phoneNumber,
             :email,
             :branch_code,:created_by,:clientIDNo);

          -- Generate GL entries for the entity
          pkg_system_admin.add_entity_gl_details(
            p_org_code    => :p_org_code,
            p_ent_name    => :full_name,
            p_aent_code   => '10',
            p_ent_code    => v_client_code,
            p_user_code   => :p_user,
            p_user_ip     => :p_created_ip,
            p_commit      => 'Y',
            p_result      => v_message
          );
          
          -- Output the result
          :p_result := v_message;
        END;
      `;

      // Bind variables
      const binds = {
        p_org_code: { val: "50", type: OracleDB.STRING },
        p_user: { val: p_user, type: OracleDB.STRING },
        p_created_ip: { val: p_created_ip, type: OracleDB.STRING },
        full_name: { val: full_name, type: OracleDB.STRING },
        client_type: { val: client_type, type: OracleDB.STRING },
        gender: { val: gender, type: OracleDB.STRING },
        tax_no: { val: tax_no, type: OracleDB.STRING },
        phoneNumber: { val: phoneNumber, type: OracleDB.STRING },
        branch_code: { val: branch_code, type: OracleDB.STRING },
        email: { val: email, type: OracleDB.STRING },
        created_by: { val: p_user, type: OracleDB.STRING },
        clientIDNo: { val: clientIDNo, type: OracleDB.STRING },
        p_result: {
          dir: OracleDB.BIND_OUT,
          type: OracleDB.STRING,
          maxSize: 2000,
        },
      };

      // Execute the PL/SQL block
      const result = await connection.execute(plsqlBlock, binds);
      console.info("Client created successfully:", result.outBinds);

      // Send response
      return res.status(200).json({
        message: "Client created successfully",
        data: result.outBinds,
      });
    } catch (error) {
      console.error("Error creating client:", error);
      return res
        .status(500)
        .json({ error: "Failed to create client", details: error.message });
    } finally {
      // Ensure the connection is always released back to the pool
      if (connection) {
        try {
          await connection.close();
        } catch (closeError) {
          console.error("Error closing the database connection:", closeError);
        }
      }
    }
  }

  static async createPolicy(req, res) {
    let connection;
    try {
      // Destructure required values from request body
      const {
        p_pr_code,
        p_int_aent_code,
        p_int_ent_code,
        p_assr_aent_code,
        p_assr_ent_code,

        p_fm_dt,
        p_to_dt,
        p_user_code,
        p_created_ip,
        p_make,
        p_model,
        p_regn_no,
        p_vehicle_use,
        p_color,
        p_engine_no,
        p_chassis_no,
        p_yom,
        p_cc,
        p_seating_cap,
        p_value,
        p_windscreen_value,
        p_radio_value,
        p_premium,
        p_vat,
        p_cover_type,
        p_vehicle_type,
        p_os_code,
      } = req.body;

      console.log("request...", req.body);

      // Get connection from pool
      connection = await (await pool).getConnection();
      console.info("Database is connected");

      // PL/SQL Block with bind variables
      const plsqlBlock = `
        DECLARE
            v_pl_index     uw_policy.pl_index%TYPE;
            v_pl_no        uw_policy.pl_no%TYPE;
            v_bima_make    pkg_data.v_char_255%TYPE;
            v_bima_model   pkg_data.v_char_255%TYPE;
        BEGIN
            -- Create the policy header
            Pkg_uw_02.create_motor_policy (
                p_org_code         => :p_org_code,
                p_pr_code          => :p_pr_code,
                p_int_aent_code    => :p_int_aent_code,
                p_int_ent_code     => :p_int_ent_code,
                p_int_site_code    => NULL,
                p_assr_aent_code   => :p_assr_aent_code,
                p_assr_ent_code    => :p_assr_ent_code,
                p_assr_site_code   => NULL,
                p_fm_dt            => :p_fm_dt,
                p_to_dt            => :p_to_dt,
                p_os_code          => :p_os_code,
                p_created_by       => :p_user_code,
                p_created_ip       => :p_created_ip,
                p_commit           => 'Y',
                p_ticket_index     => NULL,
                p_index            => v_pl_index,
                p_no               => v_pl_no
            );

            -- Validate make and model
            BEGIN
                SELECT sys_code
                  INTO v_bima_make
                  FROM ad_system_codes
                 WHERE sys_type = 'AD_VEHICLE_MAKE'
                   AND  (sys_name) =  :p_make
                   AND ROWNUM = 1;
            EXCEPTION
                WHEN NO_DATA_FOUND THEN
                    pkg_system_admin.add_sys_code (
                        p_sys_type      => 'AD_VEHICLE_MAKE',
                        p_sys_code      =>  :p_make,
                        p_sys_name      => :p_make,
                        p_sys_enabled   => 'Y',
                        p_sys_desc      => :p_make,
                        p_created_by    => :p_user_code,
                        p_commit        => 'Y'
                    );
                    v_bima_make :=  (:p_make);
            END;

            BEGIN
                SELECT sys_code
                  INTO v_bima_model
                  FROM ad_system_codes
                 WHERE sys_type = 'AD_VEHICLE_MAKE'
                   AND  (sys_name) =  :p_model
                   AND ROWNUM = 1;
            EXCEPTION
                WHEN NO_DATA_FOUND THEN
                    pkg_system_admin.add_sys_code (
                        p_sys_type      => 'AD_VEHICLE_MAKE',
                        p_sys_code      =>  :p_model,
                        p_sys_name      => :p_model,
                        p_sys_enabled   => 'Y',
                        p_sys_desc      => :p_model,
                        p_created_by    => :p_user_code,
                        p_commit        => 'Y'
                    );
                    v_bima_model :=  (:p_model);
            END;

            -- Insert vehicle details
            pkg_uw_02.ins_vehicle_w (
                p_org_code                      => :p_org_code,
                p_pl_index                      => v_pl_index,
                p_vehicle_regno                 => :p_regn_no,
                p_vehicle_use                   => :p_vehicle_use,
                p_vehicle_make                  => v_bima_make,
                p_vehicle_model                 => v_bima_model,
                p_vehicle_color                 => :p_color,
                p_vehicle_engineno              => :p_engine_no,
                p_vehicle_chassisno             => :p_chassis_no,
                p_vehicle_manyear               => :p_yom,
                p_vehicle_cc                    => :p_cc,
                p_vehicle_passangers            => :p_seating_cap,
                p_vehicle_value                 => :p_value,
                p_vehicle_windscreen            => :p_windscreen_value,
                p_vehicle_radio                 => :p_radio_value,
                p_vehicle_pll                   => 0,
                p_vehicle_premiumrate           => 0,
                p_vehicle_overridepremiumrate   => 0,
                p_vehicle_premium               => :p_premium,
                p_vehicle_vat                   => :p_vat,
                p_vehicle_grosspremium          => :p_premium,
                p_created_by                    => :p_user_code,
                p_created_ip                    => :p_created_ip,
                p_policy_type                   => :p_vehicle_use,
                p_cover_type                    => :p_cover_type,
                p_order                         => 1,
                p_debitnote_no                  => NULL,
                p_sticker_no                    => NULL,
                p_vehicle_type                  => :p_vehicle_type,
                p_vehicle_weight                => NULL,
                p_risknote_no                   => NULL,
                p_covernote_no                  => NULL,
                p_tira_risk_code                => NULL,
                p_broker_code                   => NULL
            );
        END;
      `;

      // Bind variables
      const binds = {
        p_org_code: { val: "50", type: OracleDB.STRING },
        p_pr_code: { val: p_pr_code || null, type: OracleDB.STRING },
        p_os_code: { val: p_os_code, type: OracleDB.STRING },
        p_int_aent_code: {
          val: p_int_aent_code || null,
          type: OracleDB.STRING,
        },
        p_int_ent_code: {
          val: p_int_ent_code || null,
          type: OracleDB.STRING,
        },
        p_assr_aent_code: {
          val: p_assr_aent_code || null,
          type: OracleDB.STRING,
        },
        p_assr_ent_code: {
          val: p_assr_ent_code || null,
          type: OracleDB.STRING,
        },

        p_fm_dt: {
          val: p_fm_dt ? new Date(p_fm_dt) : null,
          type: OracleDB.DATE,
        },
        p_to_dt: {
          val: p_to_dt ? new Date(p_to_dt) : null,
          type: OracleDB.DATE,
        },
        p_user_code: {
          val: p_user_code || null,
          type: OracleDB.STRING,
        },
        p_created_ip: {
          val: p_created_ip || null,
          type: OracleDB.STRING,
        },
        p_make: { val: p_make || null, type: OracleDB.STRING },
        p_model: { val: p_model || null, type: OracleDB.STRING },
        p_regn_no: { val: p_regn_no || null, type: OracleDB.STRING },
        p_vehicle_use: {
          val: p_vehicle_use || null,
          type: OracleDB.STRING,
        },
        p_color: { val: p_color || null, type: OracleDB.STRING },
        p_engine_no: {
          val: p_engine_no || null,
          type: OracleDB.STRING,
        },
        p_chassis_no: {
          val: p_chassis_no || null,
          type: OracleDB.STRING,
        },
        p_yom: {
          val: p_yom ? parseInt(p_yom, 10) : null,
          type: OracleDB.NUMBER,
        },
        p_cc: {
          val: p_cc ? parseInt(p_cc, 10) : null,
          type: OracleDB.NUMBER,
        },
        p_seating_cap: {
          val: p_seating_cap ? parseInt(p_seating_cap, 10) : null,
          type: OracleDB.NUMBER,
        },
        p_value: {
          val: p_value ? parseFloat(p_value) : null,
          type: OracleDB.NUMBER,
        },
        p_windscreen_value: {
          val: p_windscreen_value ? parseFloat(p_windscreen_value) : null,
          type: OracleDB.NUMBER,
        },
        p_radio_value: {
          val: p_radio_value ? parseFloat(p_radio_value) : null,
          type: OracleDB.NUMBER,
        },
        p_premium: {
          val: p_premium ? parseFloat(p_premium) : null,
          type: OracleDB.NUMBER,
        },
        p_vat: {
          val: p_vat ? parseFloat(p_vat) : null,
          type: OracleDB.NUMBER,
        },
        p_cover_type: {
          val: p_cover_type || null,
          type: OracleDB.STRING,
        },
        p_vehicle_type: {
          val: p_vehicle_type || null,
          type: OracleDB.STRING,
        },
      };

      // Execute the PL/SQL block
      const result = await connection.execute(plsqlBlock, binds, {
        autoCommit: true,
        outFormat: OracleDB.OUT_FORMAT_OBJECT,
      });
      console.info("Policy created successfully:", result.rows);

      // Send response
      return res.status(200).json({
        message: "Policy created successfully",
        data: (await result).rows,
      });
    } catch (error) {
      console.error("Error creating policy:", error);
      return res
        .status(500)
        .json({ error: "Failed to create policy", details: error.message });
    } finally {
      // Ensure the connection is always released back to the pool
      if (connection) {
        try {
          await connection.close();
        } catch (closeError) {
          console.error("Error closing the database connection:", closeError);
        }
      }
    }
  }
  static async getOrgBranches(req, res) {
    let connection;

    try {
      connection = (await pool).getConnection();

      const results = (await connection).execute(
        `select os_org_code,os_code,os_name from hi_org_structure`,
        [],
        {
          outFormat: OracleDB.OUT_FORMAT_OBJECT,
        }
      );

      return res.status(200).json({ results: (await results).rows });
    } catch (error) {
      console.error("error getting org branches", error);
      return res
        .status(500)
        .json({ error: "error getting org branches", details: error.message });
    } finally {
      if (connection) {
        try {
          (await connection).close();
        } catch (error) {
          console.error("error closing db", error);
        }
      }
    }
  }
  static async getSystemCodes(req, res) {
    let connection;

    try {
      connection = (await pool).getConnection();

      const results = (await connection).execute(
        `select sys_code,sys_name,sys_desc,sys_type from AD_SYSTEM_CODES WHERE SYS_TYPE in ('AD_VEHICLE_TYPE','AD_VEHICLE_USE','Institutional_Sector')`,
        [],
        {
          outFormat: OracleDB.OUT_FORMAT_OBJECT,
        }
      );
      return res.status(200).json({ results: (await results).rows });
    } catch (error) {
      console.error("error getting system codes", error);
      return res
        .status(500)
        .json({ error: "error getting system codes", details: error.message });
    } finally {
      if (connection) {
        try {
          (await connection).close();
        } catch (error) {
          console.error("error closing db", error);
        }
      }
    }
  }

  static async getCoverProducts(req, res) {
    let connection;

    try {
      connection = (await pool).getConnection();

      const results = (await connection).execute(
        `select pr_org_code,pr_code,pr_name from uw_products`,
        [],
        {
          outFormat: OracleDB.OUT_FORMAT_OBJECT,
        }
      );
      return res.status(200).json({ results: (await results).rows });
    } catch (error) {
      console.error("error getting products", error);
      return res
        .status(500)
        .json({ error: "error getting products", details: error.message });
    } finally {
      if (connection) {
        try {
          (await connection).close();
        } catch (error) {
          console.error("error closing db", error);
        }
      }
    }
  }
}
