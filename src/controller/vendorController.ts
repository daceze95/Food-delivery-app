import express, {Request, Response, NextFunction} from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { foodInstance } from '../model/foodModel';
import {v4 as uuidv4} from 'uuid'
import { VendorAttributes, VendorInstance } from '../model/vendorModel';
import { foodSchema, GenerateSignature, loginSchema, option, validatePassword, vendorSchema } from '../utils';

/*********************VENDOR LOGIN************* */
export const vendorLogin = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
  
        const validateVendor = loginSchema.validate(req.body, option);
  
        if(validateVendor.error){
           return res.status(400).json({
              Error:validateVendor.error.details[0].message,
           })
        }
  
        //check if the user exist
        const vendor = await VendorInstance.findOne({
           where:{email:email},
        }) as unknown as VendorAttributes
  
        if(vendor){
         const validation = await validatePassword( vendor.password, password, vendor.salt)
  
         if(validation){
          let signature = await GenerateSignature({
           id:vendor.id,
           email: vendor.email,
           serviceAvailability: vendor.serviceAvailablity 
        })
  
        return res.status(200).json({
           message:"you have successfully logged in",
           signature,
           email: vendor.email,
           role: vendor.role,
           serviceAvailablity: vendor.serviceAvailablity
  
        })
        }
        return res.status(400).json({
            msg: "wrong credentials"
        })
  
        }
  
        return res.status(400).json({
           Error: "Wrong Username or password "
        })
  
     } catch (error) {
         res.status(500).json({
             message: "Internal server Error",
             route: "/vendor/vendor-login",
             msg:error
         })
     }
}

/**********************  VENDOR ADD FOOD ********************** */
export const createFood = async(req: JwtPayload, res: Response, next: NextFunction) => {
    try {
        const { id } = req.vendor;
        
        const { name,
            description,
            category,
            price,
            foodType,
            readyTime,} = req.body

        const validatefood = foodSchema.validate(req.body, option);

        if(validatefood.error){
            return res.status(400).json({
                Error:validatefood.error.details[0].message,
            })
        }
        
            const foodId = uuidv4();
        
            const vendor = await VendorInstance.findOne({
                where:{id:id},
             }) as unknown as VendorAttributes;
    
    
                   if(vendor){
                const createFood = await foodInstance.create({
                    id: foodId,
                    name,
                    description,
                    category,
                    price,
                    foodType,
                    readyTime,
                    rating:0,
                    vendorId: id
                   })
    
               return res.status(201).json({
                message: "Food created successfully",
                createFood
               })
            }
       
    
    } catch (error) {
        res.status(500).json({
            message: "Internal server Error",
            route: "/vendor/create-food",
            msg:error
        })
    }
}
