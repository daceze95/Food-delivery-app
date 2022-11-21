import {NextFunction, Request, Response, } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { APP_SECRET }from '../config'
import { UserAttributes, UserIstance } from '../model/userModel';
import { VendorAttributes, VendorInstance } from '../model/vendorModel';

export const auth = async (req:JwtPayload, res:Response, next:NextFunction) => {
    try {
        const authorization = req.headers.authorization as string
        // const Bearer = authorization.split(" ")
        // const token = Bearer[1]

        if(!authorization){
            return res.status(401).json({
                Error: "Unauthorized"
            })
        }

        const token = authorization.slice(7, authorization.length)
        let verified = jwt.verify(token, APP_SECRET)

        if(!verified){
            return res.status(401).json({
                Error:"unauthorized"
            })
        }

        const { id } = verified as {[Key:string]:string}

        const user = await UserIstance.findOne({
            where:{id:id}
        }) as unknown as UserAttributes

        if (!user){
            return res.status(401).json({
                Error: "Invalid Credentials"
            })
        }

        req.user = verified

        next()


    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            route: "/users/get-user",
            msg: error
        })
    }

}


/***************** AUTH VENDOR **********************/
export const authVendor = async (req:JwtPayload, res:Response, next:NextFunction) => {
    try {
        const authorization = req.headers.authorization as string

        if(!authorization){
            return res.status(401).json({
                Error: "Unauthorized"
            })
        }

        const token = authorization.slice(7, authorization.length)
        let verified = jwt.verify(token, APP_SECRET)

        if(!verified){
            return res.status(401).json({
                Error:"unauthorized"
            })
        }

        const { id } = verified as {[Key:string]:string}

        const vendor = await VendorInstance.findOne({
            where:{id:id}
        }) as unknown as VendorAttributes

        if (!vendor){
            return res.status(401).json({
                Error: "Invalid Credentials"
            })
        }

        req.vendor = verified

        next()


    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            route: "/vendor/create-food",
            msg: error
        })
    }

}