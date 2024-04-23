import { Router } from 'express';
import {
    login,
    logout,
    register,
} from '../controller/auth.controller.js'

const router = Router();

router.get('/logout', logout);
router.post('/login', login);
router.post('/register', register);

export default router;