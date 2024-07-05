import { Request, Response } from "express";

import pool from "../../config/oracledb-connect";
import createToken from "../../helpers/jwt";
import oracledb from "oracledb";
import jwt from "jsonwebtoken";

class UserController {
  constructor() {}
  async userLogin(req: Request, res: Response) {
    let connection;
    let result: any;
    try {
      const { ent_code } = req.body;
      connection = (await pool).getConnection();
      console.log("connected to the database");
      result = (await connection).execute(
        `SELECT ent_aent_code,
       ent_code,
       ent_name,
       ent_type,
       ENT_EMAIL,
       ENT_CELLPHONE,
       b.AENT_NAME
  FROM all_entity a, ALL_ENTITY_CATG b
 WHERE ent_status = 'ACTIVE' AND ent_code = :ent_code and ent_aent_code = b.AENT_CODE`,
        { ent_code: ent_code }
      );

      if ((await result).rows && (await result).rows.length > 0) {
        const formattedData = (await result).rows?.map((row: any) => ({
          intermediaryCode: row[0],
          entityCode: row[1],
          entityName: row[2],
          entityType: row[3],
          entityEmail: row[4],
          entityPhone: row[5],
          entityCodeName: row[6],
        }));
        const token = createToken(formattedData[0]);
        res.json({
          success: true,
          message: "Login successful!",
          accessToken: token,
        });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Invalid entity code" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "An error occurred" });
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

  async loginUser(req: Request, res: Response) {
    let connection;
    let result: any;

    try {
      const { un, pw, devType, devAddress } = req.body;

      connection = await (await pool).getConnection();
      console.log("connected to database");

      console.log(
        `Calling pkg_sa.auth_user....un...${un} and password is ${pw}`
      );

      result = await connection.execute(
        `
                BEGIN
                    pkg_sa.auth_user (
                        :p_un,
                        :p_pw,
                        :p_dev_type,
                        :p_dev_address,
                        :p_user_code,
                        :p_person_code,
                        :p_user_grp,
                        :p_user_org,
                        :p_os_code,
                        :p_trace_menu,
                        :p_name_format,
                        :p_login_change,
                        :p_sys_profile,
                        :p_org_desc,
                        :p_user_desc,
                        :p_result,
                        :p_aent_code,
                        :p_ent_code,
                        :p_ent_name,
                        :p_otp_enabled,
                        :p_device_exists,
                        :p_org_type,
                        :p_country_code,
                        :p_ward_code,
                        :p_ward_name,
                        :p_station_code,
                        :p_station_name,
                        :p_station_id,
                        :p_user_phone,
                        :p_user_email,
                        :p_assignment_no,
                        :p_login_count,
                        :p_max_sessions,
                        :p_ward_index,
                        :p_country_index,
                        :p_reg_voters,
                        :p_main_form,
                        :p_view_type,
                        :p_bg_color
                    );
                END;
            `,
        {
          p_un: un,
          p_pw: pw,
          p_dev_type: devType,
          p_dev_address: devAddress,
          p_user_code: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_person_code: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_user_grp: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_user_org: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_os_code: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_trace_menu: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_name_format: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_login_change: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_sys_profile: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_org_desc: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_user_desc: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_result: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_aent_code: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_ent_code: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_ent_name: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_otp_enabled: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_device_exists: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_org_type: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_country_code: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_ward_code: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_ward_name: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_station_code: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_station_name: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_station_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
          p_user_phone: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_user_email: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_assignment_no: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_login_count: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
          p_max_sessions: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
          p_ward_index: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_country_index: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_reg_voters: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
          p_main_form: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_view_type: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
          p_bg_color: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        }
      );

      if (result.outBinds.p_result === "0") {
        const userPayload = {
          userCode: result.outBinds.p_user_code,
          personCode: result.outBinds.p_person_code,
          userGrp: result.outBinds.p_user_grp,
          userOrg: result.outBinds.p_user_org,
          osCode: result.outBinds.p_os_code,
          traceMenu: result.outBinds.p_trace_menu,
          nameFormat: result.outBinds.p_name_format,
          loginChange: result.outBinds.p_login_change,
          sysProfile: result.outBinds.p_sys_profile,
          orgDesc: result.outBinds.p_org_desc,
          aentCode: result.outBinds.p_aent_code,
          entCode: result.outBinds.p_ent_code,
          entName: result.outBinds.p_ent_name,
          otpEnabled: result.outBinds.p_otp_enabled,
          deviceExists: result.outBinds.p_device_exists,
          orgType: result.outBinds.p_org_type,
          countryCode: result.outBinds.p_country_code,
          wardCode: result.outBinds.p_ward_code,
          wardName: result.outBinds.p_ward_name,
          stationCode: result.outBinds.p_station_code,
          stationName: result.outBinds.p_station_name,
          stationId: result.outBinds.p_station_id,
          userPhone: result.outBinds.p_user_phone,
          userEmail: result.outBinds.p_user_email,
          assignmentNo: result.outBinds.p_assignment_no,
          loginCount: result.outBinds.p_login_count,
          maxSessions: result.outBinds.p_max_sessions,
          wardIndex: result.outBinds.p_ward_index,
          countryIndex: result.outBinds.p_country_index,
          regVoters: result.outBinds.p_reg_voters,
          mainForm: result.outBinds.p_main_form,
          viewType: result.outBinds.p_view_type,
          bgColor: result.outBinds.p_bg_color,
        };

        const accessToken = jwt.sign(userPayload, "hhsyyahashhshsggaga", {
          expiresIn: "1d",
        });

        return res.status(200).json({
          success: true,
          message: "User logged in successfully!",
          userPayload: userPayload.entCode,
          accessToken,
        });
      } else {
        return res.status(400).json({
          error: "Please login with correct credentials",
          success: false,
        });
      }
    } catch (error) {
      console.error("Error occurred:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        success: false,
      });
    } finally {
      if (connection) {
        try {
          await connection.close();
          console.log("close connection success");
        } catch (err) {
          console.error("Error closing connection:", err);
        }
      }
    }
  }
  async userRoles(req: Request, res: Response) {
    let connection;
    let result: any;
    try {
      const { user_code } = req.body;
      connection = (await pool).getConnection();
      console.log("connected to the database");
      result = (await connection).execute(
        `SELECT *
  FROM (SELECT a.UR_USR_CODE     user_code,
               c.role_code       role_code,
               c.role_name       role_name,
               b.USR_DESC,
               b.usr_email,
               b.USR_ENT_CODE,
               b.USR_AENT_CODe
          FROM ad_user_roles a, ad_users b, ad_roles c
         WHERE a.UR_USR_CODE = b.USR_CODE AND a.UR_ROLE_CODE = c.ROLE_CODE)
 WHERE user_code = NVL ( :user_code, user_code)`,
        { user_code: user_code }
      );

      if ((await result).rows && (await result).rows.length > 0) {
        const formattedData = (await result).rows?.map((row: any) => ({
          userCode: row[0],
          roleCode: row[1],
          roleName: row[2],
          userDesc: row[3],
          userEmail: row[4],
          userEntityCode: row[5],
          userCategoryCode: row[6],
        }));
        res.json({
          success: true,
          message: "Login successful!",
          results: formattedData,
        });
      } else {
        res.status(401).json({ success: false, message: "Invalid user code" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "An error occurred" });
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

const userController = new UserController();
export default userController;
