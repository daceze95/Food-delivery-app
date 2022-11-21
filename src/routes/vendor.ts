import express, { } from 'express';
// import {  } from '../controller/vendorController';
import { vendorLogin, createFood} from '../controller/vendorController';
import { authVendor } from '../middleware/auth';

const router = express.Router();

router.post('/vendor-login', vendorLogin)
router.post('/create-food', authVendor, createFood)

export default router;