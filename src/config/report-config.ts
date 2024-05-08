import { config } from "dotenv";
config();
export const getReportConfig = () => {
  let reportUrl: string | undefined | null = "";
  if (process.env.COMPANY === "INTRA") {
    reportUrl = process.env.INTRA_REPORT_URL;
  } else if (process.env.COMPANY === "MAYFAIR") {
    reportUrl = process.env.MAYFAIR_REPORT_URL;
  } else {
    reportUrl = null;
  }
  return reportUrl;
};
