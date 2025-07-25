import { EntitiesService } from '../service/entity.service.js';
import log from '../config/logger.js';

/**
 * Authentication Controller
 * @class
 */
export class EntityController {
  /**
   * Sync the entities json data
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static async syncEntities(req, res) {
    try {
      EntitiesService.syncEntitiesJsonData();
      log.info(`Entities json data synced successfully`);
      res.json({ message: 'Entities json data synced successfully' });
    } catch (error) {
      log.error(`Error syncing entities JSON data: ${error.message}`);
      res.status(500).json({ message: 'Error syncing entities JSON data' });
    }
  }

  // getEntities data
  /**
   * Get the entities data
   */
  static async getEntitiesData(req, res) {
    try {
      const entitiesInfo = await EntitiesService.getEntitiesData(req.user);
      log.info(`Entities fetched successfully`);
      return res.status(200).json({ data: entitiesInfo });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Create a new entity route
   * @body {Object} req - Request object
   * @returns {Object} - Response object with created entity data
   */
  static async createEntityRoute(req, res) {
    try {
      const entity = await EntitiesService.createEntityRoute(req.body);
      log.info(`Entity created successfully`);
      return res.status(201).json({ data: entity });
    } catch (error) {
      log.error(`Error creating entity: ${error.message}`);
      return res.status(500).json({ message: 'Error creating entity' });
    }
  }
}
