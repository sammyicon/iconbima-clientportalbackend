import { Router } from "express";
import { TravelInsuranceService } from "../controllers/travel-insurance-certs/travel-ins.js";

const travelCertRouter = Router();

travelCertRouter.post("/travel-certs", (req, res) => {
  TravelInsuranceService.getTravelCertificates(req, res);
});

export default travelCertRouter;
