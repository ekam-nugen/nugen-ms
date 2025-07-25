import express from "express";
import dashboardRoutes from "./dashboard.route.js";
import projectRoutes from "./project.route.js";
import timelogRoutes from "./time.route.js";

const router = express();

router.use(dashboardRoutes);
router.use(projectRoutes);
router.use(timelogRoutes);

export default router;
