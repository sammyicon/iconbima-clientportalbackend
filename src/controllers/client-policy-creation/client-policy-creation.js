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
          WHERE ent_id_no = :clientIDNo;

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
}
