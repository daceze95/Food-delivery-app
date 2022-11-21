import express, {Request, Response, NextFunction} from 'express';
import { v4 as uuidv4 } from 'uuid';
import { registerSchema , option, GeneratePassword, GenerateSalt, GenerateOtp, mailSender, emailHtml, GenerateSignature , verifySignature, loginSchema, validatePassword, updateSchema} from '../utils'//requestOTP,
import { UserAttributes, UserIstance as UserInstances } from '../model/userModel';
import { FromAdminMail, userSubject, APP_SECRET } from '../config'
import { JwtPayload } from 'jsonwebtoken';
// import { UserInstance } from 'twilio/lib/rest/conversations/v1/user';

/************* REGISTER USERS ************/
export const Register = async(req: Request, res: Response, next: NextFunction) => {
    try {
       const {
        email,
        phone,
        password,
        confirm_password
       } = req.body;

       const id = uuidv4()
       const validateResult = registerSchema.validate(req.body,option);
       const { error } = validateResult
    //    console.log(error)
       if(error) res.status(400).json({ message: error.details[0].message }) 

    //    res.json({
    //     message:"success"
    //    })

       //generate salt
       const salt = await GenerateSalt()
       const userPassword = await GeneratePassword(password, salt);
       //    console.log(userPassword);

       //generate Otp
       const { otp, expiry } = GenerateOtp();

       //check if user exist
       const UserEmail = await UserInstances.findOne({
        where: {email:email}
       });

       const UserPhone = await UserInstances.findOne({
        where: {phone:phone}
       })
     

       if(!UserEmail && !UserPhone) {
        await UserInstances.create({
            id,
            email,
            password: userPassword,
            firstName: '',
            lastName:'',
            salt,
            address: '',
            phone,
            otp,
            otp_expiry:expiry,
            lng: 0,
            lat: 0,
            verified: false,
            role:"user"
           })
    
        //    send Otp to user
         //   await requestOTP(otp, phone);

           const html = emailHtml(otp);

           await mailSender(FromAdminMail, email ,userSubject, html)

           const UserPl = await UserInstances.findOne({
            where: {email:email}
           }) as unknown as UserAttributes

          let signature =  await GenerateSignature({
            id:UserPl.id,
            email: UserPl.email,
            verified: UserPl.verified

          })

           return res.status(201).json({
            message: "User created successfully",
            signature
           })
       }
       
    //    const User = await UserIstance.findOne({
    //     where: { email:email}
    //    })
       
       res.status(400).json({
        message: "User already exist"
       })

    } catch (error) {
        res.status(500).json({
            message: "Internal server Error",
            route: "/users/signup",
            msg:error
        })
    }
}


/***************  VERIFY USERS  *****************/
export const verifyUser = async(req:Request, res:Response) => {
   try {
      const token = req.params.signature;
     const decode = await verifySignature(token) as JwtPayload

   //   const token = req.params.signature;
   //   const decode = await verifySignature(token) 

     const UserPl = await UserInstances.findOne({
      where: {email:decode.email}
     }) as unknown as JwtPayload

   //   const UserPl = await UserIstance.findOne({
   //    where: {email:decode.email}
   //   }) as unknown as JwtPayload

     if(UserPl){
      const { otp } =req.body

      //find otp
      if(UserPl.otp === Number(otp) && UserPl.otp_expiry >= new Date()){

         // {UserPl.verified = true
         // const updatedUser = await UserIstance.update({
         //    verified:true
         // }, {where:{email:decode.email}}) as unknown as UserAttributes

         // const updatedUser = await UserIstance.findOne({
         //    where:{email:decode.email}}) as unknown as JwtPayload}


         const updatedUser = await UserPl.update({
            verified:true,
         })//as unknown as JwtPayload


         //Generate a new signature
         let signature = await GenerateSignature({
            id:updatedUser.id,
            email:updatedUser.email,
            verified:updatedUser.verified
         })

         // if(updatedUser){
         // const user = await(await UserIstance.findOne({
         //    where:{email: decode.email},
         // })) as unknown as UserAttributes

         res.status(200).json({
            msg: "You have successfully verified your account",
            signature,
            verified: updatedUser.verified
            // verified: userPl.verified
         })
      // }
      }
         return res.status(400).json({
            msg: "invalid credentials OTP or token already expired"
         })
      
     }

   } catch (error) {
      res.status(500).json({
         Error:"Internal server Error",
         route:"/users/verify",
         msg: error
      })
   }
}

/***************  LOGIN USERS  *****************/
export const login = async (req:Request, res:Response) => {

   try {
      const { email, password } = req.body;

      const validateUser = loginSchema.validate(req.body, option);

      if(validateUser.error){
         return res.status(400).json({
            Error:validateUser.error.details[0].message,
         })
      }

      //check if the user exist
      const user = await UserInstances.findOne({
         where:{email:email},
      }) as unknown as UserAttributes

      if(user.verified){
       const validation = await validatePassword(user.password, password,user.salt)

       if(validation){
        let signature = await GenerateSignature({
         id:user.id,
         email: user.email,
         verified:user.verified 
      })

      return res.status(200).json({
         message:"you have successfully logged in",
         signature,
         email: user.email,
         verified: user.verified

      })
      }

      }

      return res.status(400).json({
         Error: "Wrong Username or password "
      })

   } catch (error) {
       res.status(500).json({
           message: "Internal server Error",
           route: "/users/signup",
           msg:error
       })
   }
}


/***************  RESEND-OTP USERS  *****************/
export const resendOTP = async (req:Request, res:Response) => {
   try {
      const token = req.params.signature;
      const decode = await verifySignature(token) as JwtPayload;

      //check if user is registered

      //Generate OTP
      const {otp, expiry} = GenerateOtp();

      const updatedUser = await UserInstances.update(
         {
            otp, otp_expiry:expiry
         },{where: {email:decode.email}}
      )as unknown as UserAttributes

      if(updatedUser){
         const User = await UserInstances.findOne({
            where:{email: decode.email},
         }) as unknown as UserAttributes
         //send otp to user phone if present

         //send mail to user
         const html = emailHtml(otp);
         await mailSender(FromAdminMail, User.email ,userSubject, html);

         return res.status(200).json({
            message: "OTP resent to registered phone number and email"
         })

      }

   } catch (error) {
      res.status(500).json({
         message: "Internal server Error",
         route: "/users/resend-otp/:signature",
         msg:error
     })
   }
}

/***************  USERS PROFILE  *****************/
export const getAllUsers = async (req:Request, res:Response) => {
   try {
      const limit = req.query.limit as number | undefined
      // const users = await UserInstances.findAll({})
      const users = await UserInstances.findAndCountAll({
         limit: limit
      })
      
      return res.status(200).json({
         message: "You have successfully retrieved all users", //users,
         users:users.rows,// used when the method is findAndCountAll
         count:users.count
      })
      
   } catch (error) {
      res.status(500).json({
         message: "Internal server Error",
         route: "/users/get-all-users/",
         msg:error
     })
   }
}

/***************  GET SINGLE USER  *****************/
export const getUser = async (req:JwtPayload, res:Response) => {
   try {
      const {id} = req.user

      const User = await UserInstances.findOne({
         where:{id: id}
      })as unknown as UserAttributes

     if(User) {
      return res.status(200).json({
         User
      })
   }else{
      return res.status(400).json({
         message: "User not found"
      })
   }

   } catch (error) {
     return res.status(500).json({
         message: "Internal server Error",
         route: "/users/get-user/",
         msg:error
     })
   }
}

export const updateUserProfile = async (req:JwtPayload, res:Response) => {

   try {
      const id = req.user.id;
      const {firstName, lastName, address, phone} = req.body

      //joi validation
      const validateResult = updateSchema.validate(req.body, option);
   
      if(validateResult.error){
         return res.status(400).json({ 
            message: validateResult.error.details[0].message 
         }) 
         
      }

      //check if the user is a registered user
      const User = await UserInstances.findOne({
         where:{id:id},
      }) as unknown as UserAttributes;

      if(!User){
         return res.status(400).json({
            Error: "You are not authorised to update"
         })
      }

      const updatedUser = await UserInstances.update({
            firstName,
            lastName,
            phone,
            address
         }, {where:{id: id}}) as unknown as UserAttributes;

         if(updatedUser){
            const User = await UserInstances.findOne({
               where:{id:id},
            }) as unknown as UserAttributes
            return res.status(200).json({
               msg: "You have successfully updated your account",
               User
            })
         }

         return res.status(400).json({
            msg: "There is an error"
         })


   } catch (error) {
      return res.status(500).json({
         message: "Internal server Error",
         route: "/users/update-profile/",
         msg:error
     })
   }
}

//forgot password