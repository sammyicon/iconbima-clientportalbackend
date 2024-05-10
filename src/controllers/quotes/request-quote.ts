import { Request, Response } from "express";
import { IMotor } from "../../types";
import axios from "axios";

class QuotesController {
  async requestMotorQuote(req: IMotor, res: Response) {
    try {
      const { model, reqNumber, value, yearOfManufacture } = req;

      const currentYear = new Date(Date.now()).getFullYear();
      let error = "";
      if (currentYear - yearOfManufacture > 15) {
        error = "Year of manufucture cannot be more than 15 years!";
      } else if (yearOfManufacture > currentYear) {
        error = "Year of manufacture cannot be future!!";
      }
      if (error.length > 1) {
        return res.status(400).json({ error: error });
      }
      const premium = Math.round((value * 3.4) / 100);
      const stamp_duty = 40;
      const trainning_levy = Math.round((premium * 0.2) / 100);
      const PHCfund = Math.round((value * 0.25) / 100);
      const totalPremium = Math.round(
        premium + stamp_duty + trainning_levy + PHCfund
      );
      let days = 0;
      if (currentYear % 4 === 0) {
        days += 366;
      } else {
        days += 365;
      }

      const response = [
        {
          model,
          reqNumber,
          value,
          yearOfManufacture,
          premium,
          stamp_duty,
          trainning_levy,
          PHCfund,
          totalPremium,
          days,
        },
      ];

      return res.status(200).json({ success: true, response: response });
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  }
  async createPolicy(req: Request, res: Response) {
    try {
      const {
        kraPin,
        name,
        address,
        mobileNumber,
        email,
        coverDateFrom,
        coverDateTo,
        vehicleReg,
        vehicleUse,
        vehicleManYear,
        vehiclePremium,
        grossPremium,
        vehicleMake,
        vehicleModel,
      } = req.body;

      const response = await axios.post(
        "http://105.27.207.82:8101/icon/bima/motor_policy_api/create_motor_policy",
        {
          data: [
            {
              api_token: "",
              api_user: "1000000",
              debitNoteNo: "39281",
              transSource: "DIRECT",
              policyFromDate: coverDateFrom,
              policyExpiryDate: coverDateTo,
              policyType: "OG",
              policyCurrency: "KSH",
              policyNumber: "",
              brokerpoLicyNumber: "39281",
              insurancepolicyNumber: "",
              debitstatus: "NEW",
              brokerCode: "D-DI01",
              brokerName: "Nairobi Direct",
              brokerAddress: "",
              brokerPhone: "",
              brokerEmail: "ckipkorir@iconsoft.co",
              brokerTIN: "",
              brokerVRN: "",
              clientCode: "CO-0376",
              clientType: "2",
              clientName: name,
              clientAddress: address,
              clientOccupation: "",
              clientPhysicalAddress: address,
              clientMobile: mobileNumber,
              clientEmail: email,
              clientTIN: kraPin,
              clientVRN: "29010951J",
              BinderPolicy: "",
              ProcessingMonth: "",
              clientRegion: "4",
              clientDistrict: "411",
              clientDateOfBirth: "",
              tiraProductCode: "SP014003000000",
              branchCode: "01",
              vehicles: [
                {
                  coverDateFrom: coverDateFrom,
                  coverDateTo: coverDateTo,
                  riskNoteNo: "55819",
                  registrationNo: vehicleReg,
                  vehicleMake: vehicleMake,
                  vehicleModel: vehicleModel,
                  vehicleCoverType: "TRA-TPO",
                  vehicleUse: vehicleUse,
                  vehicleType: "",
                  vehicleColor: "Multicolour",
                  vehicleEngineNo: "0",
                  vehicleChassisNo: "LGS3LNS7XFOTS0035",
                  vehicleEntertainmentSystemPremuim: 0,
                  vehicleEntertainmentsystemValue: 0,
                  vehicleStickerNo: "23002-10772-83808",
                  vehicleManYear: vehicleManYear,
                  vehicleCC: 0,
                  vehiclePassangers: 0,
                  vehicleValue: 0,
                  vehicleWindScreen: 0,
                  vehicleWindScreenPremuim: 0,
                  vehicleWindScreenValue: 0,
                  vehicleRadio: 0,
                  vehiclePLL: 0,
                  vehiclePremiumRate: 0,
                  vehicleOverridePremiumRate: 0,
                  vehiclePremium: vehiclePremium,
                  vatAmount: 0,
                  grossPremium: grossPremium,
                  vehicleWindScreen1: "0.0000",
                  vehicleGrossWeight: "8221.00",
                  vehicleTareWeight: "8220.00",
                  vehicleNoOfAxles: "3",
                  vehicleAxleDistance: "0",
                  vehicleOwnerCategory: "2",
                  vehicleMotorUsage: "2",
                  vehicleMotorCategory: "1",
                  vehicleModelNumber: "TRAILER",
                  tiraRiskCode: "SP014003000021",
                  tiraStickerNo: "23002-10772-83808",
                  tiraCoverNoteNo: "12523-10783-19508",
                },
              ],
            },
          ],
        }
      );
      if (response.data) {
        return res.status(200).json({ response: response.data });
      }
    } catch (error) {
      console.error(error);
    }
  }
}

const quoteController = new QuotesController();
export default quoteController;
