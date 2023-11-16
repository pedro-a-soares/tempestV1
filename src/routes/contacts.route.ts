import express from 'express';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { getContacts, updateContacts } from '../controllers/contacts.controller';
import { validate } from '../middleware/validate';
import { createContactSchema } from '../schemas/contacts.schema';

const router = express.Router();
router.use(deserializeUser, requireUser);

// Get user info route
router.get('/', getContacts);
router.post('/', validate(createContactSchema), updateContacts)

export default router;

