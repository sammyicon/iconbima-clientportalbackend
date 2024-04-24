import { Request, Response } from "express";

import pool from "../../config/oracledb-connect";
import createToken from "../../helpers/jwt";

class UserController {
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
       ent_type
      FROM all_entity
       WHERE ent_status = 'ACTIVE' and ent_code = :ent_code `,
        { ent_code: ent_code }
      );

      if ((await result).rows && (await result).rows.length > 0) {
        const formattedData = (await result).rows?.map((row: any) => ({
          intermediaryCode: row[0],
          entityCode: row[1],
          entityName: row[2],
          entityType: row[3],
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
}

const userController = new UserController();
export default userController;
