import express from "express";
import { TimeOffController } from "../controllers/timeOff.controller.js";
import { validateRequest } from "../middleware/validate-request.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router
  .route("/timeOff")
  .get(authenticateToken, TimeOffController.getUserTimeOffRequests)
  .post(
    authenticateToken,
    validateRequest("createTimeOffRequestSchema"),
    TimeOffController.createTimeOffRequest
  )
  .put(authenticateToken, TimeOffController.timeOffApproval);

router
  .route("/timeOff/stats")
  .get(authenticateToken, TimeOffController.fetchTimeOffStats);

export default router;
