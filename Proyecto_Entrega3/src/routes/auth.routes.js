import { Router } from 'express';
import {
    login,
    logout,
    register,
    // getCurrentUser,
} from '../controller/auth.controller.js'

const router = Router();

router.get('/logout', logout);
router.post('/login', login);
router.post('/register', register);
// router.get('/current', getCurrentUser);

export default router;