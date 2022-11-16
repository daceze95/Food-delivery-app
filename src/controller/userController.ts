import express, { Request, Response, NextFunction } from "express";
import { registerSchema, option, GeneratePassword, GenerateSalt } from "../utils/utility";

export const Register = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, Phone, password, confirm_password } = req.body;

    const validateResult = registerSchema.validate(req.body, option);
    if (validateResult.error) {
      // console.log(validateResult.error.details)
      return res.status(400).json({
        Error: validateResult.error.details[0].message
      });
    }
    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt)

    console.log(userPassword)
  } catch (error) {
    // console.log(error);
    res.status(500).json({
        Error:'Internal server Error',
        route: "/users/signup"
    })
  }
};
