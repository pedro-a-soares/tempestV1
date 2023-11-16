import express from 'express';
import { getMeHandler, updateProfile } from '../controllers/user.controller';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import { updateUserProfileSchema } from '../schemas/user.schema';

const router = express.Router();
router.use(deserializeUser, requireUser);

// Get user info route
router.get('/me', getMeHandler);
router.patch('/me', validate(updateUserProfileSchema), updateProfile);

export default router;

