"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getUser = exports.getAllUsers = exports.resendOTP = exports.login = exports.verifyUser = exports.Register = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("../utils"); //requestOTP,
const userModel_1 = require("../model/userModel");
const config_1 = require("../config");
// import { UserInstance } from 'twilio/lib/rest/conversations/v1/user';
/************* REGISTER USERS ************/
const Register = async (req, res, next) => {
    try {
        const { email, phone, password, confirm_password } = req.body;
        const id = (0, uuid_1.v4)();
        const validateResult = utils_1.registerSchema.validate(req.body, utils_1.option);
        const { error } = validateResult;
        //    console.log(error)
        if (error)
            res.status(400).json({ message: error.details[0].message });
        //    res.json({
        //     message:"success"
        //    })
        //generate salt
        const salt = await (0, utils_1.GenerateSalt)();
        const userPassword = await (0, utils_1.GeneratePassword)(password, salt);
        //    console.log(userPassword);
        //generate Otp
        const { otp, expiry } = (0, utils_1.GenerateOtp)();
        //check if user exist
        const UserEmail = await userModel_1.UserIstance.findOne({
            where: { email: email }
        });
        const UserPhone = await userModel_1.UserIstance.findOne({
            where: { phone: phone }
        });
        if (!UserEmail && !UserPhone) {
            await userModel_1.UserIstance.create({
                id,
                email,
                password: userPassword,
                firstName: '',
                lastName: '',
                salt,
                address: '',
                phone,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: false,
                role: "user"
            });
            //    send Otp to user
            //   await requestOTP(otp, phone);
            const html = (0, utils_1.emailHtml)(otp);
            await (0, utils_1.mailSender)(config_1.FromAdminMail, email, config_1.userSubject, html);
            const UserPl = await userModel_1.UserIstance.findOne({
                where: { email: email }
            });
            let signature = await (0, utils_1.GenerateSignature)({
                id: UserPl.id,
                email: UserPl.email,
                verified: UserPl.verified
            });
            return res.status(201).json({
                message: "User created successfully",
                signature
            });
        }
        //    const User = await UserIstance.findOne({
        //     where: { email:email}
        //    })
        res.status(400).json({
            message: "User already exist"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server Error",
            route: "/users/signup",
            msg: error
        });
    }
};
exports.Register = Register;
/***************  VERIFY USERS  *****************/
const verifyUser = async (req, res) => {
    try {
        const token = req.params.signature;
        const decode = await (0, utils_1.verifySignature)(token);
        //   const token = req.params.signature;
        //   const decode = await verifySignature(token) 
        const UserPl = await userModel_1.UserIstance.findOne({
            where: { email: decode.email }
        });
        //   const UserPl = await UserIstance.findOne({
        //    where: {email:decode.email}
        //   }) as unknown as JwtPayload
        if (UserPl) {
            const { otp } = req.body;
            //find otp
            if (UserPl.otp === Number(otp) && UserPl.otp_expiry >= new Date()) {
                // {UserPl.verified = true
                // const updatedUser = await UserIstance.update({
                //    verified:true
                // }, {where:{email:decode.email}}) as unknown as UserAttributes
                // const updatedUser = await UserIstance.findOne({
                //    where:{email:decode.email}}) as unknown as JwtPayload}
                const updatedUser = await UserPl.update({
                    verified: true,
                }); //as unknown as JwtPayload
                //Generate a new signature
                let signature = await (0, utils_1.GenerateSignature)({
                    id: updatedUser.id,
                    email: updatedUser.email,
                    verified: updatedUser.verified
                });
                // if(updatedUser){
                // const user = await(await UserIstance.findOne({
                //    where:{email: decode.email},
                // })) as unknown as UserAttributes
                res.status(200).json({
                    msg: "You have successfully verified your account",
                    signature,
                    verified: updatedUser.verified
                    // verified: userPl.verified
                });
                // }
            }
            return res.status(400).json({
                msg: "invalid credentials OTP or token already expired"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/verify",
            msg: error
        });
    }
};
exports.verifyUser = verifyUser;
/***************  LOGIN USERS  *****************/
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateUser = utils_1.loginSchema.validate(req.body, utils_1.option);
        if (validateUser.error) {
            return res.status(400).json({
                Error: validateUser.error.details[0].message,
            });
        }
        //check if the user exist
        const user = await userModel_1.UserIstance.findOne({
            where: { email: email },
        });
        if (user.verified) {
            const validation = await (0, utils_1.validatePassword)(user.password, password, user.salt);
            if (validation) {
                let signature = await (0, utils_1.GenerateSignature)({
                    id: user.id,
                    email: user.email,
                    verified: user.verified
                });
                return res.status(200).json({
                    message: "you have successfully logged in",
                    signature,
                    email: user.email,
                    verified: user.verified
                });
            }
        }
        return res.status(400).json({
            Error: "Wrong Username or password "
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server Error",
            route: "/users/signup",
            msg: error
        });
    }
};
exports.login = login;
/***************  RESEND-OTP USERS  *****************/
const resendOTP = async (req, res) => {
    try {
        const token = req.params.signature;
        const decode = await (0, utils_1.verifySignature)(token);
        //check if user is registered
        //Generate OTP
        const { otp, expiry } = (0, utils_1.GenerateOtp)();
        const updatedUser = await userModel_1.UserIstance.update({
            otp, otp_expiry: expiry
        }, { where: { email: decode.email } });
        if (updatedUser) {
            const User = await userModel_1.UserIstance.findOne({
                where: { email: decode.email },
            });
            //send otp to user phone if present
            //send mail to user
            const html = (0, utils_1.emailHtml)(otp);
            await (0, utils_1.mailSender)(config_1.FromAdminMail, User.email, config_1.userSubject, html);
            return res.status(200).json({
                message: "OTP resent to registered phone number and email"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server Error",
            route: "/users/resend-otp/:signature",
            msg: error
        });
    }
};
exports.resendOTP = resendOTP;
/***************  USERS PROFILE  *****************/
const getAllUsers = async (req, res) => {
    try {
        const limit = req.query.limit;
        // const users = await UserInstances.findAll({})
        const users = await userModel_1.UserIstance.findAndCountAll({
            limit: limit
        });
        return res.status(200).json({
            message: "You have successfully retrieved all users",
            users: users.rows,
            count: users.count
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server Error",
            route: "/users/get-all-users/",
            msg: error
        });
    }
};
exports.getAllUsers = getAllUsers;
/***************  GET SINGLE USER  *****************/
const getUser = async (req, res) => {
    try {
        const { id } = req.user;
        const User = await userModel_1.UserIstance.findOne({
            where: { id: id }
        });
        if (User) {
            return res.status(200).json({
                User
            });
        }
        else {
            return res.status(400).json({
                message: "User not found"
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server Error",
            route: "/users/get-user/",
            msg: error
        });
    }
};
exports.getUser = getUser;
const updateUserProfile = async (req, res) => {
    try {
        const id = req.user.id;
        const { firstName, lastName, address, phone } = req.body;
        //joi validation
        const validateResult = utils_1.updateSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                message: validateResult.error.details[0].message
            });
        }
        //check if the user is a registered user
        const User = await userModel_1.UserIstance.findOne({
            where: { id: id },
        });
        if (!User) {
            return res.status(400).json({
                Error: "You are not authorised to update"
            });
        }
        const updatedUser = await userModel_1.UserIstance.update({
            firstName,
            lastName,
            phone,
            address
        }, { where: { id: id } });
        if (updatedUser) {
            const User = await userModel_1.UserIstance.findOne({
                where: { id: id },
            });
            return res.status(200).json({
                msg: "You have successfully updated your account",
                User
            });
        }
        return res.status(400).json({
            msg: "There is an error"
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server Error",
            route: "/users/update-profile/",
            msg: error
        });
    }
};
exports.updateUserProfile = updateUserProfile;
//forgot password
