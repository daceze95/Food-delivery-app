import express, { } from 'express';
// import {  } from '../controller/vendorController';
import { vendorLogin, createFood, vendorProfile, deleteFood} from '../controller/vendorController';
import { authVendor } from '../middleware/auth';

const router = express.Router();

router.get('/get-profile', authVendor, vendorProfile)
router.post('/vendor-login', vendorLogin)
router.post('/create-food', authVendor, createFood)
router.delete('/delete-food/:foodId', authVendor, deleteFood)

export default router;