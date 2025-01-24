import pool from "../../config/oracledb-connect.js";

export class ClientPolicyCreation {
  static async createClient(req, res) {
    let connection;
    try {
      // Destructure required values from request body
      const { p_org_code, p_aent_code, p_full_name, p_user, p_created_ip } =
        req.body;

      // Get connection from pool
      connection = await (await pool).getConnection();
      console.info("Database is connected");

      // PL/SQL Block with bind variables
      const plsqlBlock = `
        DECLARE
          v_client_code pkg_data.v_char_100%TYPE;
          v_message pkg_data.v_char_2000%TYPE;       
        BEGIN
          -- Generate entity code
          pkg_system_admin.gen_entity_code_v2(
            p_org_code    => :p_org_code,
            p_aent_code   => :p_aent_code,
            p_full_name   => :p_full_name,
            p_user        => :p_user,
            p_ent_code    => v_client_code,
            p_mes         => v_message
          );
          -- Insert entity details
          INSERT INTO ALL_ENTITY (ent_aent_code, ent_code)
          VALUES ('10', v_client_code);

          -- Generate GL entries for the entity
          pkg_system_admin.add_entity_gl_details(
            p_org_code    => :p_org_code,
            p_ent_name    => :p_full_name
            p_aent_code   => :p_aent_code,
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
        p_org_code,
        p_aent_code,
        p_user,
        p_created_ip,
        p_full_name, // Combine names
        p_result: { dir: pool.BIND_OUT, type: pool.STRING }, // Output parameter
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
