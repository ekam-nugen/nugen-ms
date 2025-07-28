import { Roles } from '../schemas/role.schema.js';

export class RoleEntityService {
  static async createRoleEntity(data) {
    console.log(data);
    return await Roles.create(data);
  }

  static async getAllRoleEntities(search) {
    if (search) {
      return await Roles.aggregate([
        {
          $match: {
            name: {
              $regex: `${search}`,
              $options: 'i',
            },
            isDeleted: false,
          },
        },
      ]);
    }
    return await Roles.find({ isDeleted: false });
  }

  static async getRoleEntityById(id) {
    return await Roles.findById(id);
  }

  static async updateRoleEntity(id, data) {
    return await Roles.findByIdAndUpdate(id, data, { new: true });
  }

  static async updateRoleActivityStatus(id) {
    const role = await Roles.findById(id);
    if (!role) {
      throw new Error('Role not found');
    }
    const isActive = !role.isActive; // Toggle the isActive status
    console.log(`Toggling isActive status for role ${id} to ${isActive}`);

    return await Roles.findByIdAndUpdate(id, { isActive }, { new: true });
  }

  static async deleteRoleEntity(id) {
    return await Roles.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  }
}
