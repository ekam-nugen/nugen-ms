import { Project } from "../schemas/project.schema.js";

export class ProjectService {
  // Create a new project
  static async createProject(data) {
    try {
      const project = new Project(data);
      await project.save();
      return project;
    } catch (error) {
      throw new Error("Failed to create project: " + error.message);
    }
  }

  // Get all projects (optional: filter by organizationId)
  static async getAllProjects(query) {
    try {
      const filter = { isDeleted: false };
      if (query.organizationId) {
        filter.organizationId = query.organizationId;
      }
      return await Project.find(filter);
    } catch (error) {
      throw new Error("Failed to fetch projects: " + error.message);
    }
  }

  // Get a project by ID
  static async getProjectById(id) {
    try {
      const project = await Project.findById(id);
      if (!project || project.isDeleted) return null;
      return project;
    } catch (error) {
      throw new Error("Failed to fetch project: " + error.message);
    }
  }

  // Update a project by ID
  static async updateProject(id, updateData) {
    try {
      const project = await Project.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!project || project.isDeleted) return null;
      return project;
    } catch (error) {
      throw new Error("Failed to update project: " + error.message);
    }
  }

  // Soft delete a project by ID
  static async deleteProject(id) {
    try {
      const project = await Project.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
      );
      return project;
    } catch (error) {
      throw new Error("Failed to delete project: " + error.message);
    }
  }
}
