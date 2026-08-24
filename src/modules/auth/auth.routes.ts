import { Router } from 'express';
import { AuthController } from './auth.controller';
import {
  authenticateJWT as auth,
  role
} from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register',auth,role('admin','hotel','customer'), AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', AuthController.logout);
router.patch('/users/:id', AuthController.updateUser);
router.delete('/users/:id', auth, role('admin'), AuthController.deleteUser);

export default router;