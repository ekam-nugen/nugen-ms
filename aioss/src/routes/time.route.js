import express from "express";
import { TimeClockController } from "../controllers/timeClock.controller.js";

const router = express.Router();

router.post("/time-clock/clock-in", TimeClockController.clockIn);
router.put("/time-clock/clock-out", TimeClockController.clockOut);

router.get("/time-clock/:timeLogId", TimeClockController.getTimeLog);
router.get("/time-clock/user/:userId", TimeClockController.getUserTimeLogs);

export default router;
