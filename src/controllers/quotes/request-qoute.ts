import { Request, Response } from "express";
import { IMotor, INonMotor } from "../../types/request-quote";

class QuotesController {
  async requestMotorQuote(req: IMotor, res: Response) {
    try {
      const { model, reqNumber, endDate, startDate, use, yearOfManufacture } =
        req;
      return res.status(200).json({ message: "This is motor quote" });
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
