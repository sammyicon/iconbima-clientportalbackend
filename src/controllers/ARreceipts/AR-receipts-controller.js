import pool from "../../config/oracledb-connect.js";

class ARreceiptsController {
  async getARreceipts(req, res) {
    let connection;
    let results;
    try {
      const { intermediaryCode, clientCode, fromDate, toDate } = req.body;

      connection = (await pool).getConnection();
      console.log("connected to database");
      if (
        intermediaryCode === "15" ||
        intermediaryCode === "70" ||
        intermediaryCode === "25"
      ) {
        results = (await connection).execute(
          `SELECT hd_org_code,
         hd_index,
         hd_os_code,
         LN_SGL_CODE,
       
         UPPER (pkg_sa.org_structure_name (hd_org_code, hd_os_code))
             branch,
         hd_no,
         TO_CHAR (hd_gl_date, 'dd/mm/rrrr')
             gl_date,
         hd_receipt_mgl_code,
         pkg_cust.get_mgl_bank_code (hd_org_code, hd_receipt_mgl_code)
             hd_bank_code,
         ln_mgl_code
             ln_mgl_code,
         ln_aent_code,
         ln_ent_code,
         hd_cur_code,
         hd_cur_code,
         hd_paying_for,
         NVL (hd_fc_amount, 0)
             reciept_amt,
         DECODE (hd_mode, 'CHEQUE', hd_mode || ' NO ' || hd_chq_no, hd_mode)
             hd_mode,
         hd_chq_no,
         hd_chq_bank,
         UPPER (
             NVL (pkg_system_admin.get_ent_catg_name (ln_aent_code), 'none'))
             category,
         UPPER (hd_remitter_from)
             paid_by,
         ln_ent_code
             on_account_code,
         UPPER (pkg_system_admin.get_entity_name (ln_aent_code, ln_ent_code))
             on_account_name,
         hd_cust_doc_ref_type
             receipt_type,
         do_doc_no
             doc_no,
         UPPER (NVL (ln_narration, hd_narration))
             hd_narration,
         UPPER (pkg_system_admin.get_user_name (ar_receipts_header.created_by))
             cashier,
         hd_status
    FROM ar_receipts_header ,
         ar_receipt_lines  ,
         (  SELECT DISTINCT
                   do_org_code,
                   do_hd_no,
                   LISTAGG (do_doc_no, CHR (10) ON OVERFLOW TRUNCATE)
                       WITHIN GROUP (ORDER BY do_doc_no)    do_doc_no
              FROM (SELECT do_org_code, do_hd_no, do_doc_no FROM ar_receipt_docs)
          GROUP BY do_org_code, do_hd_no)
   WHERE     hd_org_code = ln_org_code(+)
         AND hd_no = ln_hd_no(+)
         AND hd_org_code = do_org_code(+)
         AND hd_no = do_hd_no(+)
         AND hd_complete = 'Y'
         AND hd_status NOT IN ('Cancelled')
         AND hd_posted = 'Y'
          
         AND hd_ent_code = NVL ( :clientCode, hd_ent_code)
         AND hd_aent_code = NVL ( :intermediaryCode, hd_aent_code)
         AND hd_status IN ('Completed', 'Cancelled')
        
         AND hd_no IN (SELECT DISTINCT trn_doc_no
                         FROM gl_transactions
                        WHERE trn_doc_type IN ('AR-RECEIPT'))
         AND hd_org_code = :p_org_code
         AND NVL (hd_banked, 'N') = NVL ( :p_banked, NVL (hd_banked, 'N'))
         AND TRUNC (hd_gl_date) BETWEEN ( :p_fm_dt) AND ( :p_to_dt)
ORDER BY hd_gl_date`,
          {
            p_banked: "N",
            p_org_code: "50",
            p_fm_dt: new Date(fromDate),
            p_to_dt: new Date(toDate),
            intermediaryCode: intermediaryCode,
            clientCode: clientCode,
          }
        );
      } else {
        results = (await connection).execute(
          `SELECT hd_org_code,
         hd_index,
         hd_os_code,
         LN_SGL_CODE,
       
         UPPER (pkg_sa.org_structure_name (hd_org_code, hd_os_code))
             branch,
         hd_no,
         TO_CHAR (hd_gl_date, 'dd/mm/rrrr')
             gl_date,
         hd_receipt_mgl_code,
         pkg_cust.get_mgl_bank_code (hd_org_code, hd_receipt_mgl_code)
             hd_bank_code,
         ln_mgl_code
             ln_mgl_code,
         ln_aent_code,
         ln_ent_code,
         hd_cur_code,
         hd_cur_code,
         hd_paying_for,
         NVL (hd_fc_amount, 0)
             reciept_amt,
         DECODE (hd_mode, 'CHEQUE', hd_mode || ' NO ' || hd_chq_no, hd_mode)
             hd_mode,
         hd_chq_no,
         hd_chq_bank,
         UPPER (
             NVL (pkg_system_admin.get_ent_catg_name (ln_aent_code), 'none'))
             category,
         UPPER (hd_remitter_from)
             paid_by,
         ln_ent_code
             on_account_code,
         UPPER (pkg_system_admin.get_entity_name (ln_aent_code, ln_ent_code))
             on_account_name,
         hd_cust_doc_ref_type
             receipt_type,
         do_doc_no
             doc_no,
         UPPER (NVL (ln_narration, hd_narration))
             hd_narration,
         UPPER (pkg_system_admin.get_user_name (ar_receipts_header.created_by))
             cashier,
         hd_status
    FROM ar_receipts_header ,
         ar_receipt_lines  ,
         (  SELECT DISTINCT
                   do_org_code,
                   do_hd_no,
                   LISTAGG (do_doc_no, CHR (10) ON OVERFLOW TRUNCATE)
                       WITHIN GROUP (ORDER BY do_doc_no)    do_doc_no
              FROM (SELECT do_org_code, do_hd_no, do_doc_no FROM ar_receipt_docs)
          GROUP BY do_org_code, do_hd_no)
   WHERE     hd_org_code = ln_org_code(+)
         AND hd_no = ln_hd_no(+)
         AND hd_org_code = do_org_code(+)
         AND hd_no = do_hd_no(+)
         AND hd_complete = 'Y'
         AND hd_status NOT IN ('Cancelled')
         AND hd_posted = 'Y'
          
         AND hd_int_ent_code = NVL ( :clientCode, hd_int_ent_code)
         AND hd_int_aent_code = NVL ( :intermediaryCode, hd_int_aent_code)
         AND hd_status IN ('Completed', 'Cancelled')
        
         AND hd_no IN (SELECT DISTINCT trn_doc_no
                         FROM gl_transactions
                        WHERE trn_doc_type IN ('AR-RECEIPT'))
         AND hd_org_code = :p_org_code
         AND NVL (hd_banked, 'N') = NVL ( :p_banked, NVL (hd_banked, 'N'))
         AND TRUNC (hd_gl_date) BETWEEN ( :p_fm_dt) AND ( :p_to_dt)
ORDER BY hd_gl_date`,
          {
            p_banked: "N",
            p_org_code: "50",
            p_fm_dt: new Date(fromDate),
            p_to_dt: new Date(toDate),
            intermediaryCode: intermediaryCode,
            clientCode: clientCode,
          }
        );
      }

      if ((await results).rows && (await results).rows.length > 0) {
        const formattedData = (await results).rows?.map((row) => ({
          currencyCode: row[12],
          receiptAmount: row[15],
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
}

const arReceiptsController = new ARreceiptsController();
export default arReceiptsController;
