import express from 'express';
import { loginHandler, logoutHandler, registerHandler } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { createUserSchema, loginUserSchema } from '../schemas/user.schema';
const router = express.Router();

// Register user route
router.post('/register', validate(createUserSchema), registerHandler);
router.post('/logout', logoutHandler);
// Login user route
router.post('/login', validate(loginUserSchema), loginHandler);

export default router;
