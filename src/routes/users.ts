import express from 'express';
import { login, Register, resendOTP, verifyUser, getAllUsers, getUser, updateUserProfile } from '../controller/userController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/signup', Register)
router.post('/verify/:signature', verifyUser)
router.post('/login', login)
router.get('/resend-otp/:signature', resendOTP)
router.get('/get-all-users', getAllUsers)
router.get('/get-user', auth, getUser)
router.patch('/update-profile', auth, updateUserProfile)


export default router;