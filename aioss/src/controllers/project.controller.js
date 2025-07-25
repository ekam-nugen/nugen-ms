import { ProjectService } from "../service/project.service.js";
import sendResponse from "../utils/response.handler.js";

export class ProjectController {
  static async createProject(req, res) {
    try {
      const project = await ProjectService.createProject(req.body);
      return sendResponse(res, {
        data: project,
        message: "Project Created successfully",
        statusCode: 201,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getAllProjects(req, res) {
    try {
      const projects = await ProjectService.getAllProjects(req.query);
      return sendResponse(res, {
        data: projects,
        message: "Project fetched successfully",
        statusCode: 200,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getProjectById(req, res) {
    try {
      const project = await ProjectService.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      return sendResponse(res, {
        data: project,
        message: "Project fetched successfully",
        statusCode: 200,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateProject(req, res) {
    try {
      const project = await ProjectService.updateProject(
        req.params.id,
        req.body,
        {
          new: 1,
        }
      );
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      return sendResponse(res, {
        data: project,
        message: "Project updated successfully",
        statusCode: 200,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async deleteProject(req, res) {
    try {
      const { projectId } = req.params;
      const project = await ProjectService.findOne(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      const status = project.isDeleted;

      const updateProjectStatus = await findOneAndUpdate(
        {
          _id: projectId,
        },
        {
          $set: {
            isDeleted: !status,
          },
        }
      );
      return sendResponse(res, {
        data: "",
        message: "Project status is updated successfully",
        statusCode: 200,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
