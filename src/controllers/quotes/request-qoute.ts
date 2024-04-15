import { Request, Response } from "express";
import { IMotor } from "../../types/request-quote";

class QuotesController {
  async requestMotorQuote(req: IMotor, res: Response) {
    try {
      const { model, reqNumber, endDate, startDate, use, yearOfManufacture } =
        req;
    } catch (error) {
      console.error(error);
    }
  }
}

const quoteController = new QuotesController();
export default quoteController;
