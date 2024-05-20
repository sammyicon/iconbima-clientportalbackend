import { config } from "dotenv";
config();
export const getReportConfig = (
  docNumber: string | number,
  docIndex: string | number
) => {
  let reportUrl: string | undefined | null = "";
  if (process.env.COMPANY === "INTRA") {
    reportUrl = `http://192.168.1.112:9002/reports/rwservlet?userid=ICON/IC0N@bima19c&module=D:/icon/forms_version/ar/reports/mayfair_ke/AR_RECEIPT&rep_doc_no=${docNumber}&p_os_code=01&p_role_code=AR.MGR&rep_param8=&p_grp_code=AR.MGR&rep_param1=&p_module_name=AR_RECEIPT&p_org_code=50&p_menu_code=AR000001&rep_param6=&rep_param5=&p_report_title=RECEIPT&rep_param3=&p_user_name=ICON,Admin &rep_doc_index=${docIndex}&p_user_code=1000000&rep_param7=&destype=cache&rep_doc_org=50&rep_param2=&desformat=PDF&rep_param9=&rep_param4=&`;
  } else if (process.env.COMPANY === "MAYFAIR") {
    reportUrl = process.env.MAYFAIR_REPORT_URL;
  } else if (process.env.COMPANY === "MAYFAIR_TEST") {
    reportUrl = `http://192.168.0.210:9002/reports/rwservlet?userid=ICON/B1MA@test19c&module=F:/icon/forms_version/ar/reports/mayfair_ke/AR_RECEIPT&rep_doc_no=${docNumber}&p_os_code=01&p_role_code=AR.MGR&rep_param8=&p_grp_code=AR.MGR&rep_param1=&p_module_name=AR_RECEIPT&p_org_code=50&p_menu_code=AR000001&rep_param6=&rep_param5=&p_report_title=RECEIPT&rep_param3=&p_user_name=ICON,Admin &rep_doc_index=${docIndex}&p_user_code=1000000&rep_param7=&destype=cache&rep_doc_org=50&rep_param2=&desformat=PDF&rep_param9=&rep_param4=&`;
  } else {
    reportUrl = null;
  }

  return reportUrl;
};
