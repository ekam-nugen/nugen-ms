import express from "express";
import { ProjectController } from "../controllers/project.controller.js";

const router = express.Router();

router
  .route("/project")
  .get(ProjectController.getAllProjects)
  .post(ProjectController.createProject);

router
  .route("/project/:id")
  .get(ProjectController.getProjectById)
  .put(ProjectController.updateProject)
  .delete(ProjectController.deleteProject);

export default router;
