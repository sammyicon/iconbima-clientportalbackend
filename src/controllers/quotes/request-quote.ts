import { Request, Response } from "express";
import { IMotor, INonMotor, IQuote, IUser } from "../../types";
import MotorQuoteModel from "../../models/Quotes";
import UserModel from "../../models/User";

class QuotesController {
  async requestMotorQuote(req: IMotor, res: Response) {
    try {
      const { model, reqNumber, value, use, yearOfManufacture } = req;

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
          use,
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

  async selectMotorQuote(req: IQuote, res: Response) {
    try {
      const {
        user,
        PHCfund,
        model,
        premium,
        reqNumber,
        stamp_duty,
        trainning_levy,
        use,
        yearOfManufacture,
      } = req;

      const selectedQuotes = new MotorQuoteModel({
        user,
        model,
        PHCfund,
        premium,
        reqNumber,
        stamp_duty,
        trainning_levy,
        use,
        yearOfManufacture,
      });
      await selectedQuotes.save();
      return res
        .status(200)
        .json({ success: true, message: "quotes saved successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  }

  async fetchUserQuotes(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const user = await UserModel.findById(id);
      const userQuotes = await MotorQuoteModel.findOne({ user: user });
      if (userQuotes) {
        return res.status(200).json({ quotes: userQuotes });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  }

  async requestNonMotorQuote(req: INonMotor, res: Response) {
    try {
      const { address, city, products, purpose } = req;
      return res.status(200).json({ message: "This is non-motor quote" });
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  }
}

const quoteController = new QuotesController();
export default quoteController;
