import { Response, Request } from "express";
import pool from "../../config/oracledb-connect";
import { config } from "dotenv";
config();
class ClaimCreditNotesController {
  async getClaimCreditNotes(req: Request, res: Response) {
    let connection;
    let results: any;
    try {
      const { intermediaryCode, clientCode } = req.body;
      console.log(req.body);
      connection = (await pool).getConnection();
      console.log("Database is connected");
      if (
        intermediaryCode === "15" ||
        intermediaryCode === "70" ||
        intermediaryCode === "25"
      ) {
        results = (await connection).execute(
          `select hd_org_code,    
         hd_no,    
         hd_index,    
         hd_trn_code,    
         hd_batch_no,    
         hd_narration,    
         hd_gl_date,    
         hd_cur_code,    
         hd_cur_rate,    
         hd_lc_dr_amount,    
         hd_lc_cr_amount,    
         hd_fc_dr_amount,    
         hd_fc_cr_amount,    
         hd_type,    
         hd_complete,    
         hd_status,    
         DECODE (hd_posted, 'Y', 'Yes', 'No') hd_posted,    
         a.created_by,    
         pkg_system_admin.get_user_name (a.created_by) created_by_xx,    
         pkg_system_admin.timeago (a.created_on) created_age,    
         hd_os_code,    
         pkg_sa.org_structure_name (hd_org_code, hd_os_code) hd_os_code_xx,    
         hd_canc_reason,    
         hd_canc_remarks,    
         hd_canc_date,
         pkg_system_admin.get_system_desc ('RGBA_StatusValues', hd_status) status_bg_color_xx  
           from gl_je_header a, gl_je_lines b    
          where hd_org_code = :org_code
          and b.LN_AENT_CODE=nvl(:intermediaryCode,b.LN_AENT_CODE)
          and b.LN_ENT_CODE = nvl(:clientCode,b.LN_ENT_CODE)
          and hd_type='CREDIT NOTE'
          and hd_no = b.LN_HD_NO and hd_posted = 'Y'`,
          { intermediaryCode, clientCode, org_code: "50" }
        );
      } else {
        results = (await connection).execute(
          `select hd_org_code,    
         hd_no,    
         hd_index,    
         hd_trn_code,    
         hd_batch_no,    
         hd_narration,    
         hd_gl_date,    
         hd_cur_code,    
         hd_cur_rate,    
         hd_lc_dr_amount,    
         hd_lc_cr_amount,    
         hd_fc_dr_amount,    
         hd_fc_cr_amount,    
         hd_type,    
         hd_complete,    
         hd_status,    
         DECODE (hd_posted, 'Y', 'Yes', 'No') hd_posted,    
         a.created_by,    
         pkg_system_admin.get_user_name (a.created_by) created_by_xx,    
         pkg_system_admin.timeago (a.created_on) created_age,    
         hd_os_code,    
         pkg_sa.org_structure_name (hd_org_code, hd_os_code) hd_os_code_xx,    
         hd_canc_reason,    
         hd_canc_remarks,    
         hd_canc_date,
         pkg_system_admin.get_system_desc ('RGBA_StatusValues', hd_status) status_bg_color_xx  
         from gl_je_header a, gl_je_lines b    
         where hd_org_code = :org_code
         and b.LN_LINK_AENT_CODE=nvl(:intermediaryCode,b.LN_LINK_AENT_CODE)
         and b.LN_LINK_ENT_CODE = nvl(:clientCode,b.LN_LINK_ENT_CODE)
         and hd_type='CREDIT NOTE'
         and hd_no = b.LN_HD_NO and hd_posted ='Y'`,
          { intermediaryCode, clientCode, org_code: "50" }
        );
      }
      if ((await results).rows && (await results).rows.length > 0) {
        const formattedData = (await results).rows?.map((row: any) => ({
          receiptIndex: row[2],
          journalNo: row[1],
          glDate: row[6],
          status: row[15],
          currency: row[7],
          DRTotal: row[9],
          CRTotal: row[10],
          type: row[13],
          posted: row[16],
          narration: row[5],
          receiptUrl: `${process.env.INTRA_REPORT_URL}/reports/rwservlet?userid=icon/IC0N@bima19c&module=D:/icon/forms_version/ap/reports/mayfair_ke/AP_CR_NOTE&rep_doc_no=${row[1]}&p_os_code=01&p_role_code=GL.MGR&rep_param8=&p_grp_code=GL.MGR&rep_param1=&p_module_name=AP_CR_NOTE&p_org_code=50&p_menu_code=GL000003&rep_param6=&rep_param5=&p_report_title=CLAIMS%20CREDIT%20NOTE&rep_param3=&p_user_name=ICON,%20Admin%20&rep_doc_index=${row[2]}&p_user_code=1000000&rep_param7=&destype=cache&rep_doc_org=50&rep_param2=&desformat=PDF&rep_param9=&rep_param4=&`,
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

const claimCreditNotesController = new ClaimCreditNotesController();
export default claimCreditNotesController;
