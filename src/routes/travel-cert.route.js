import { Router } from "express";
import { TravelInsuranceService } from "../controllers/travel-insurance-certs/travel-ins.js";

const travelCertRouter = Router();

travelCertRouter.post("/travel-certs", (req, res) => {
  TravelInsuranceService.getTravelCertificates(req, res);
});

travelCertRouter.post("/calculate_cover_premium", (req, res) => {
  TravelInsuranceService.calculatePremiums(req, res);
});

export default travelCertRouter;
