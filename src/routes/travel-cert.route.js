import { Router } from "express";
import { TravelInsuranceService } from "../controllers/travel-insurance-certs/travel-ins.js";

const travelCertRouter = Router();

travelCertRouter.post("/travel-certs", (req, res) => {
  TravelInsuranceService.getTravelCertificates(req, res);
});

// travelCertRouter.post(
//   "/travel/calculate_cover_premium",
//   TravelInsuranceService.calculatePremiums.bind(TravelInsuranceService)
// );

travelCertRouter.post(
  "/calculate_all_premiums",
  TravelInsuranceService.calculateAllPremiums.bind(TravelInsuranceService)
);

export default travelCertRouter;
