import express, { } from 'express';
import { createAdmin, createVendor, superAdmin } from '../controller/adminController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/create-super-admin', superAdmin)
router.post('/create-admin', auth, createAdmin)
router.post('/create-vendors', auth, createVendor)

export default router;