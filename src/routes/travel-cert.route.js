import { Router } from "express";
import { TravelInsuranceService } from "../controllers/travel-insurance-certs/travel-ins.js";
import { ExchangeRateService } from "../controllers/exchangeRate/exchange_rate.js";

const travelCertRouter = Router();

travelCertRouter.post("/travel-certs", (req, res) => {
  TravelInsuranceService.getTravelCertificates(req, res);
});

travelCertRouter.post(
  "/calculate_all_premiums",
  TravelInsuranceService.calculateAllPremiums.bind(TravelInsuranceService)
);

travelCertRouter.post("/exchange_rate", ExchangeRateService.getExchangeRate);

export default travelCertRouter;
