import { RoleEntityService } from '../service/role.service.js';

export class RoleEntityController {
  static async create(req, res) {
    try {
      const entity = await RoleEntityService.createRoleEntity(req.body);
      res.status(201).json({ message: 'Data created succ', data: entity });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getAll(req, res) {
    try {
      const { search } = req.query;
      const entities = await RoleEntityService.getAllRoleEntities(search);
      res.json({ data: entities });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const entity = await RoleEntityService.getRoleEntityById(req.params.id);
      if (!entity) return res.status(404).json({ error: 'Not found' });
      res.json(entity);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const entity = await RoleEntityService.updateRoleEntity(
        req.params.id,
        req.body,
      );
      if (!entity) return res.status(404).json({ error: 'Not found' });
      res.json(entity);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async updateRoleActivityStatus(req, res) {
    try {
      const { id } = req.params;
      const entity = await RoleEntityService.updateRoleActivityStatus(id);
      if (!entity) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Status updated successfully', entity });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const entity = await RoleEntityService.deleteRoleEntity(req.params.id);
      if (!entity) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Deleted successfully', entity });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
