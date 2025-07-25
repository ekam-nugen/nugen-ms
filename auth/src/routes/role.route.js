import express from 'express';
import { RoleEntityController } from '../controllers/role.controller.js';

const router = express.Router();

router
  .route('/role')
  .post(RoleEntityController.create)
  .get(RoleEntityController.getAll);
router
  .route('/role/:id')
  .get(RoleEntityController.getById)
  .put(RoleEntityController.update)
  .patch(RoleEntityController.updateRoleActivityStatus)
  .delete(RoleEntityController.delete);

export default router;
