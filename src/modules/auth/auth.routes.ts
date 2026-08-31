import { Router } from 'express';
import { AuthController } from './auth.controller';
import {
  authenticateJWT as auth,
  role
} from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.post('/refresh-token', AuthController.refreshToken);

router.post('/logout', AuthController.logout);

router.get('/users', auth, role('admin'), AuthController.listUsers);

router.patch('/users/:id', auth, role('admin'), AuthController.updateUser);

router.delete('/users/:id', auth, role('admin'), AuthController.deleteUser);
router.get('/roles', auth, role('admin'), AuthController.listRoles);
router.post('/users', auth, role('admin'), AuthController.createUser);
export default router;