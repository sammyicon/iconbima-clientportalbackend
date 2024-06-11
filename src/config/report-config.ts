import { config } from "dotenv";
config();
export const getARReceiptsReportConfig = (
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

export const getTaxInvoiceReportConfig = (
  docNumber: string | number,
  docIndex: string | number
) => {
  let reportUrl: string | undefined | null = "";
  if (process.env.COMPANY === "INTRA") {
    reportUrl = `http://192.168.1.112:8001/icon/reports?p_module_name=UW_TAX_INVOICE_ER&destype=cache&desformat=PDF&rep_param1=0&rep_param2=Normal&rep_param3=KSH&rep_param4=Y&rep_param5=&rep_param6=&rep_param7=&rep_param8=&rep_param9=&rep_doc_index=${docIndex}&rep_doc_org=50&rep_doc_no=${docNumber}&p_role_code=UW.ADF&p_org_code=50&p_menu_code=100011&p_grp_code=UW.ADF&p_os_code=01&p_user_code=1000000&p_user_name=ICON,%20Admin%20&p_report_title=Tax%20Invoice&`;
  } else if (process.env.COMPANY === "MAYFAIR") {
    reportUrl = process.env.MAYFAIR_REPORT_URL;
  } else if (process.env.COMPANY === "MAYFAIR_TEST") {
    reportUrl = `http://192.168.0.210:9002/reports/rwservlet?userid=ICON/B1MA@test19c&module=F:/icon/forms_version/ar/reports/mayfair_ke/AR_RECEIPT&rep_doc_no=${docNumber}&p_os_code=01&p_role_code=AR.MGR&rep_param8=&p_grp_code=AR.MGR&rep_param1=&p_module_name=AR_RECEIPT&p_org_code=50&p_menu_code=AR000001&rep_param6=&rep_param5=&p_report_title=RECEIPT&rep_param3=&p_user_name=ICON,Admin &rep_doc_index=${docIndex}&p_user_code=1000000&rep_param7=&destype=cache&rep_doc_org=50&rep_param2=&desformat=PDF&rep_param9=&rep_param4=&`;
  } else {
    reportUrl = null;
  }

  return reportUrl;
};

export const getJournaleReportConfig = (
  docNumber: string | number,
  docIndex: string | number
) => {
  let reportUrl: string | undefined | null = "";
  if (process.env.COMPANY === "INTRA") {
    reportUrl = `http://192.168.1.112:9002/reports/rwservlet?userid=icon/IC0N@bima19c&module=D:/icon/forms_version/ap/reports/mayfair_ke/AP_CR_NOTE&rep_doc_no=${docNumber}&p_os_code=01&p_role_code=GL.MGR&rep_param8=&p_grp_code=GL.MGR&rep_param1=&p_module_name=AP_CR_NOTE&p_org_code=50&p_menu_code=GL000003&rep_param6=&rep_param5=&p_report_title=CLAIMS%20CREDIT%20NOTE&rep_param3=&p_user_name=ICON,%20Admin%20&rep_doc_index=28073&p_user_code=1000000&rep_param7=&destype=cache&rep_doc_org=50&rep_param2=&desformat=PDF&rep_param9=&rep_param4=&`;
  } else if (process.env.COMPANY === "MAYFAIR") {
    reportUrl = process.env.MAYFAIR_REPORT_URL;
  } else if (process.env.COMPANY === "MAYFAIR_TEST") {
    reportUrl = `http://192.168.0.210:9002/reports/rwservlet?userid=ICON/B1MA@test19c&module=F:/icon/forms_version/ar/reports/mayfair_ke/AR_RECEIPT&rep_doc_no=${docNumber}&p_os_code=01&p_role_code=AR.MGR&rep_param8=&p_grp_code=AR.MGR&rep_param1=&p_module_name=AR_RECEIPT&p_org_code=50&p_menu_code=AR000001&rep_param6=&rep_param5=&p_report_title=RECEIPT&rep_param3=&p_user_name=ICON,Admin &rep_doc_index=${docIndex}&p_user_code=1000000&rep_param7=&destype=cache&rep_doc_org=50&rep_param2=&desformat=PDF&rep_param9=&rep_param4=&`;
  } else {
    reportUrl = null;
  }

  return reportUrl;
};

export const getPolicyDocumentsReports = (
  docIndex: string | number,
  docNumber: string | number,
  endIndex: string | number
) => {
  let policyUrl;
  let debitOrCreditUrl;

  if (process.env.COMPANY === "INTRA") {
    debitOrCreditUrl = `http://192.168.1.112:8001/icon/reports?p_module_name=UW_DRCR_NOTE_01_NEW&destype=cache&desformat=PDF&rep_param1=${endIndex}&rep_param2=Normal&rep_param3=KSH&rep_param4=Y&rep_param5=&rep_param6=&rep_param7=&rep_param8=&rep_param9=&rep_doc_index=${docIndex}&rep_doc_org=50&rep_doc_no=${docNumber}&p_role_code=UW.ADF&p_org_code=50&p_menu_code=100011&p_grp_code=UW.ADF&p_os_code=01&p_user_code=1000000&p_user_name=ICON,%20Admin%20&p_report_title=DEBIT%20NOTE&`;
    policyUrl = ` http://192.168.1.112:8001/icon/reports?p_module_name=UW_MOT_POL&destype=cache&desformat=PDF&rep_param1=${endIndex}&rep_param2=Normal&rep_param3=KSH&rep_param4=Y&rep_param5=&rep_param6=&rep_param7=&rep_param8=&rep_param9=&rep_doc_index=${docIndex}&rep_doc_org=50&rep_doc_no=${docNumber}&p_role_code=UW.ADF&p_org_code=50&p_menu_code=100011&p_grp_code=UW.ADF&p_os_code=01&p_user_code=1000000&p_user_name=ICON,%20Admin%20&p_report_title=MOTOT%20POLICY%20DOCUMENT&`;
  } else if (process.env.COMPANY === "MAYFAIR_TEST") {
    debitOrCreditUrl = `http://192.168.1.112:8001/icon/reports?p_module_name=UW_DRCR_NOTE_01_NEW&destype=cache&desformat=PDF&rep_param1=0&rep_param2=Normal&rep_param3=KSH&rep_param4=Y&rep_param5=&rep_param6=&rep_param7=&rep_param8=&rep_param9=&rep_doc_index=${docIndex}&rep_doc_org=50&rep_doc_no=${docNumber}&p_role_code=UW.ADF&p_org_code=50&p_menu_code=100011&p_grp_code=UW.ADF&p_os_code=01&p_user_code=1000000&p_user_name=ICON,%20Admin%20&p_report_title=DEBIT%20NOTE&`;
    policyUrl = ` http://192.168.1.112:8001/icon/reports?p_module_name=UW_MOT_POL&destype=cache&desformat=PDF&rep_param1=0&rep_param2=Normal&rep_param3=KSH&rep_param4=Y&rep_param5=&rep_param6=&rep_param7=&rep_param8=&rep_param9=&rep_doc_index=${docIndex}&rep_doc_org=50&rep_doc_no=${docNumber}&p_role_code=UW.ADF&p_org_code=50&p_menu_code=100011&p_grp_code=UW.ADF&p_os_code=01&p_user_code=1000000&p_user_name=ICON,%20Admin%20&p_report_title=MOTOT%20POLICY%20DOCUMENT&`;
  }

  return {
    policyUrl,
    debitOrCreditUrl,
  };
};
