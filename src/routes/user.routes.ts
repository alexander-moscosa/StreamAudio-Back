import { Router } from "express";
import { getUserByUsername, register, login } from '../controllers/user.controller';

const router = Router();

router.get('/:username', getUserByUsername);
router.post('/register', register);
router.post('/login', login);

export default router;