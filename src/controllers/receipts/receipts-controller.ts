import { Response, Request } from "express";
import pool from "../../config/oracledb-connect";
import { config } from "dotenv";
config();

class ReceiptsController {
  async getReceipts(req: Request, res: Response) {
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
         hd_index,  
         hd_no,  
         hd_trn_code,  
         hd_remitter_from,  
         hd_remitter_addr1,  
         hd_remitter_addr2,  
         hd_remitter_addr3,  
         hd_mode,  
         hd_batch_no,  
         hd_type,  
         hd_complete,  
         hd_narration,  
         hd_gl_date,  
         hd_fin_code,  
         hd_per_code,  
         hd_cur_code,  
         hd_cur_date,  
         hd_cur_rate,  
         hd_cur_rate_mode,  
         hd_cur_rate_type,  
         hd_lc_amount,  
         hd_fc_amount,  
         hd_bank_code,  
         hd_bank_branch,  
         hd_cust_doc_ref_no,  
         hd_receipt_mgl_code,  
         pkg_gl.get_main_acnt_name (hd_org_code, hd_receipt_mgl_code)  
            hd_receipt_mgl_code_xx,  
         hd_receipt_sgl_code,  
         pkg_gl.get_sub_acnt_name (hd_org_code,  
                                   hd_receipt_mgl_code,  
                                   hd_receipt_sgl_code)  
            hd_receipt_sgl_code_xx,  
         hd_source,  
         hd_chq_no,  
         hd_chq_date,  
         hd_chq_bank,  
         hd_chq_bank_branch,  
         hd_banked,  
         hd_banking_batch_no,  
         hd_posted,  
         hd_holds,  
         hd_status,  
         hd_gen_gl,  
         created_by,  
         pkg_system_admin.get_user_name (created_by) created_by_xx,  
         created_on,  
         hd_cheque_catg,  
         hd_chq_type,  
         hd_chq_status,  
         hd_bnk_picked,  
         hd_doc_code,  
         hd_chg_fc_amt,  
         hd_chg_lc_amt,  
         hd_charge,  
         hd_os_code,  
         hd_drcr_type,  
         hd_cust_doc_ref_type,  
         hd_cust_doc_ref_index,  
         hd_bnk_bank_code,  
         pkg_gl.get_bank_name (hd_bnk_bank_code) hd_bnk_bank_code_xx,  
         hd_bnk_branch_code,  
         pkg_gl.get_bank_brn_name (hd_bnk_bank_code, hd_bnk_branch_code)  
            hd_bnk_branch_code_xx,  
         hd_bnk_bank_ac,  
         pkg_gl.get_bankac_name (hd_bnk_bank_code,  
                                 hd_bnk_branch_code,  
                                 hd_bnk_bank_ac)  
            hd_bnk_bank_ac_xx,  
         hd_category,  
         hd_canc_reason,  
         hd_canc_remarks,  
         hd_paying_for,
         pkg_system_admin.get_system_desc ('RGBA_StatusValues', hd_status) status_bg_color_xx  
    from ar_receipts_header  
   where hd_org_code = :p_org_code and hd_aent_code = nvl(:intermediaryCode,hd_aent_code) and hd_ent_code=nvl(:clientCode,hd_ent_code) and hd_posted ='Y'`,
          { intermediaryCode, clientCode, p_org_code: "50" }
        );
      } else {
        results = (await connection).execute(
          `SELECT hd_org_code,
       hd_index,
       hd_no,
       hd_trn_code,
       hd_remitter_from,
       hd_remitter_addr1,
       hd_remitter_addr2,
       hd_remitter_addr3,
       hd_mode,
       hd_batch_no,
       hd_type,
       hd_complete,
       hd_narration,
       hd_gl_date,
       hd_fin_code,
       hd_per_code,
       hd_cur_code,
       hd_cur_date,
       hd_cur_rate,
       hd_cur_rate_mode,
       hd_cur_rate_type,
       hd_lc_amount,
       hd_fc_amount,
       hd_bank_code,
       hd_bank_branch,
       hd_cust_doc_ref_no,
       hd_receipt_mgl_code,
       pkg_gl.get_main_acnt_name (hd_org_code, hd_receipt_mgl_code)
           hd_receipt_mgl_code_xx,
       hd_receipt_sgl_code,
       pkg_gl.get_sub_acnt_name (hd_org_code,
                                 hd_receipt_mgl_code,
                                 hd_receipt_sgl_code)
           hd_receipt_sgl_code_xx,
       hd_source,
       hd_chq_no,
       hd_chq_date,
       hd_chq_bank,
       hd_chq_bank_branch,
       hd_banked,
       hd_banking_batch_no,
       hd_posted,
       hd_holds,
       hd_status,
       hd_gen_gl,
       created_by,
       pkg_system_admin.get_user_name (created_by)
           created_by_xx,
       created_on,
       hd_cheque_catg,
       hd_chq_type,
       hd_chq_status,
       hd_bnk_picked,
       hd_doc_code,
       hd_chg_fc_amt,
       hd_chg_lc_amt,
       hd_charge,
       hd_os_code,
       hd_drcr_type,
       hd_cust_doc_ref_type,
       hd_cust_doc_ref_index,
       hd_bnk_bank_code,
       pkg_gl.get_bank_name (hd_bnk_bank_code)
           hd_bnk_bank_code_xx,
       hd_bnk_branch_code,
       pkg_gl.get_bank_brn_name (hd_bnk_bank_code, hd_bnk_branch_code)
           hd_bnk_branch_code_xx,
       hd_bnk_bank_ac,
       pkg_gl.get_bankac_name (hd_bnk_bank_code,
                               hd_bnk_branch_code,
                               hd_bnk_bank_ac)
           hd_bnk_bank_ac_xx,
       hd_category,
       hd_canc_reason,
       hd_canc_remarks,
       hd_paying_for,
       pkg_system_admin.get_system_desc ('RGBA_StatusValues', hd_status)
           status_bg_color_xx
  FROM ar_receipts_header
 WHERE     hd_org_code = :p_org_code
       AND hd_int_aent_code = NVL ( :intermediaryCode, hd_int_aent_code)
       AND hd_int_ent_code = NVL ( :clientCode, hd_int_ent_code) and hd_posted ='Y'`,
          { intermediaryCode, clientCode, p_org_code: "50" }
        );
      }
      if ((await results).rows && (await results).rows.length > 0) {
        const formattedData = (await results).rows?.map((row: any) => ({
          reportIndex: row[1],
          receiptNo: row[2],
          from: row[4],
          narration: row[12],
          amount: row[21],
          GLDate: row[13],
          receiptMode: row[8],
          status: row[39],
          posted: row[37],
          receiptUrl: `${process.env.INTRA_REPORT_URL}/reports/rwservlet?userid=icon/IC0N@bima19c&module=D:/icon/forms_version/ar/reports/mayfair_ke/AR_E_RECEIPT&rep_doc_no=${row[2]}&p_os_code=01&p_role_code=AR.MGR&rep_param8=&p_grp_code=AR.MGR&rep_param1=&p_module_name=AR_E_RECEIPT&p_org_code=50&p_menu_code=AR000001&rep_param6=&rep_param5=&p_report_title=E RECEIPT&rep_param3=&p_user_name=ICON, Admin &rep_doc_index=${row[1]}&p_user_code=1000000&rep_param7=&destype=cache&rep_doc_org=50&rep_param2=&desformat=PDF&rep_param9=&rep_param4=&`,
        }));
        res.json({
          success: true,
          results: formattedData,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  }
}

const receiptsController = new ReceiptsController();
export default receiptsController;
