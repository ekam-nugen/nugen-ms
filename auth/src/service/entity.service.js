import { ValidationError } from 'ajv';
import EntitiesJson from '../constants/entites.json' assert { type: 'json' };
import { RoleEntityRoutes } from '../schemas/role-entity-routes.schema.js';
import { UserOrganization } from '../schemas/user-organization.schema.js';
import { Entities } from '../schemas/entities.schema.js';
/**
 * Authentication Service
 * @class
 */
export class EntitiesService {
  /**
   * Sync entity data
   */
  static async syncEntitiesJsonData() {
    const entitiesJson = EntitiesJson.entitiesJson;
    try {
      if (entitiesJson && entitiesJson.length > 0) {
        entitiesJson.forEach(async (entity) => {
          const entityData = await Entities.findOne({
            name: entity.title,
            isDeleted: false,
          });
          if (!entityData) {
            await Entities.create({
              name: entity.title,
            });
            console.log(`Entity ${entity.title} created successfully.`);
          }
        });
      } else {
        console.error('No entities data found in JSON.');
      }
    } catch (error) {
      throw new Error('Error syncing entities JSON data:', error);
    }
  }

  /**
   * Get Entity data
   */
  static async getEntitiesData(user) {
    try {
      const { userId } = user;

      const userRoleExist = await UserOrganization.findOne({
        userId: userId,
      });
      if (!userRoleExist) {
        throw new ValidationError('User role does not exist');
      }
      const userRole = userRoleExist.role;

      if (userRole !== 'admin') {
        throw new ValidationError("Can't perform this action.");
      }
      const entitiesInfo = await Entities.find();
      return entitiesInfo;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Create a new entity
   * @param {Object} entityData - The data for the new entity
   * @returns {Object} - The created entity
   */
  static async createEntityRoute(entityData) {
    try {
      const { entityId, route, method } = entityData;
      if (!entityId || !route || !method) {
        throw new ValidationError(
          'Invalid input data. Please provide entityId, route, and method.',
        );
      }
      const existingEntity = await RoleEntityRoutes.findOne({
        entityId: entityId,
        route: route,
        method: method,
        isDeleted: false,
      });
      if (existingEntity) {
        throw new ValidationError('Entity already exists');
      }
      const newEntity = await RoleEntityRoutes.create({
        entityId: entityId,
        route: route,
        method: method,
        isDeleted: false,
      });
      return newEntity;
    } catch (error) {
      console.error('Error creating entity:', error);
      throw new ValidationError('Error creating entity: ' + error.message);
    }
  }
}
