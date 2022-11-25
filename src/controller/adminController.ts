import express, {Request, Response, NextFunction} from 'express'
import { adminRegisterSchema, GenerateOtp, GeneratePassword, GenerateSalt, GenerateSignature, option, vendorSchema } from '../utils'//requestOTP,
import { v4 as uuidv4 } from 'uuid';
import { UserAttributes, UserIstance as UserInstances } from '../model/userModel';
import { FromAdminMail, userSubject, APP_SECRET } from '../config'
import jwt, { JwtPayload } from 'jsonwebtoken';
import { VendorAttributes, VendorInstance } from '../model/vendorModel';


/***************** Register superAdmin *******************/
export const superAdmin = async(req:Request, res: Response, next: NextFunction) => {
    try {
        const uuidUser = uuidv4()
        
       const {
        email,
        firstName,
        lastName,
        address,
        phone,
        password
       } = req.body;

       //validate body input
       const validateResult = adminRegisterSchema.validate(req.body,option);
       const { error } = validateResult
    
       if(error) res.status(400).json({ 
        message: error.details[0].message
        }) 

       //generate salt
       const salt = await GenerateSalt()
       const adminPassword = await GeneratePassword(password, salt);

       //generate Otp
       const { otp, expiry } = GenerateOtp();


        //check if admin exist
           const admin = await UserInstances.findOne({
            where: {email:email, phone:phone}//email
           }) as unknown as UserAttributes


           //create admin
           if(!admin) {

            await UserInstances.create({
                id:uuidUser,
                email,
                password: adminPassword,
                firstName,
                lastName,
                salt,
                address,
                phone,
                otp,
                otp_expiry:expiry,
                lng: 0,
                lat: 0,
                verified: true,
                role:"superAdmin"
               })

               const admin = await UserInstances.findOne({
                where: {email:email}//email
               }) as unknown as UserAttributes   

           //generate signature for admin
          let signature =  await GenerateSignature({
            id:admin.id,
            email: admin.email,
            verified: admin.verified
          }) as unknown as UserAttributes

           return res.status(201).json({
            message: "superAdmin created successfully",
            signature
           })
       }

       return res.status(400).json({
        message: "superAdmin already exist"
       })

    } catch (error) {
        res.status(500).json({
            message: "Internal server Error",
            route: "/admins/create-super-admin",
            msg:error
        })
    }
}


/*******************admin***************/
export const createAdmin = async(req: JwtPayload, res: Response, next: NextFunction) => {
    try {
        const { id } = req.user;

       const {
        email,
        firstName,
        lastName,
        address,
        phone,
        password
       } = req.body;

       const uuidUser = uuidv4()

       //check if input is valid
       const validateResult = adminRegisterSchema.validate(req.body,option);
       const { error } = validateResult
    
       if(error) res.status(400).json({ message: error.details[0].message }) 

       //generate salt
       const salt = await GenerateSalt()
       const adminPassword = await GeneratePassword(password, salt);
       

       //generate Otp
       const { otp, expiry } = GenerateOtp();


        //check if admin exist
           const admin = await UserInstances.findOne({
            where: {id:id}//email
           }) as unknown as UserAttributes

        //    if(admin.email == email || admin.phone == phone){
        //     return res.status(400).json({
        //         message: "Email or phone already exist"
        //     })
        //    }

           //create admin
           if(admin.role === "superAdmin") {

            const user = await UserInstances.findOne({
                where: {email:email, phone:phone}//email
               }) as unknown as UserAttributes


               if(!user){
            await UserInstances.create({
                id: uuidUser,
                email,
                password: adminPassword,
                firstName,
                lastName,
                salt,
                address,
                phone,
                otp,
                otp_expiry:expiry,
                lng: 0,
                lat: 0,
                verified: true,
                role:"admin"
               })

               const admin = await UserInstances.findOne({
                where: {id:id}//email
               }) as unknown as UserAttributes   

           //generate signature for admin
          let signature =  await GenerateSignature({
            id:admin.id,
            email: admin.email,
            verified: admin.verified
          })

           return res.status(201).json({
            message: "Admin created successfully",
            signature
           })
        }
       }

       return res.status(400).json({
        message: "Admin already exist"
       })

    } catch (error) {
        res.status(500).json({
            message: "Internal server Error",
            route: "/admins/create-admin",
            msg:error
        })
    }
}

/***************** CREATE VENDOR ******************/
export const createVendor = async(req: JwtPayload, res: Response, next: NextFunction) => {
    try {
        const {id} = req.user
console.log(req)
       const {
        name,
        ownerName,
        pincode,
        phone,
        address,
        email,
        password,
    } = req.body;

    const uuidVendor = uuidv4()

    const validateResult = vendorSchema.validate(req.body, option);
    const { error } = validateResult
    
       if(error) return res.status(400).json({ 
        message: error.details[0].message
        }) 

        //GenerateSalt
        const salt = await GenerateSalt()
       const vendorPassword = await GeneratePassword(password, salt);

       const Admin= await UserInstances.findOne({
        where: {id:id}//email
       }) as unknown as UserAttributes   

       const vendor= await VendorInstance.findOne({
        where: {email:email}//email
       }) as unknown as VendorAttributes   

       if(Admin.role === "admin" || Admin.role === "superAdmin"){

        if(!vendor){
        const createVendor = await VendorInstance.create({
            id:uuidVendor,
            name,
            ownerName,
            pincode,
            phone,
            address,
            email,
            password: vendorPassword,
            serviceAvailablity: false,
            salt,
            rating:0,
            role:"vendor"
           })

           return res.status(201).json({
            message: "vendor created successfully",
            createVendor
           })
        }
        return res.status(400).json({
            message: "vendor already exist",
           })
       }

       return res.status(400).json({
        message: "Not an admin therefore unauthorized",
       })
        
    } catch (error) {
        res.status(500).json({
            Error:"Internal server Error",
            route:"/admins/create-vendors",
            msg: error
         })
    }
}