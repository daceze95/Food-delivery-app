import Joi, { string } from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthPayload } from "../interfaces";
import { APP_SECRET } from "../config";

export const registerSchema = Joi.object().keys({
  email: Joi.string().required(),
  phone: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  // confirm_password: Joi.ref('password')
  confirm_password: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
});

export const adminRegisterSchema = Joi.object().keys({
  email: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  // confirm_password: Joi.ref('password')

});

export const vendorSchema = Joi.object().keys({
  email: Joi.string().required(),
  ownerName: Joi.string().required(),
  name: Joi.string().required(),
  address: Joi.string().required(),
  pincode: Joi.string().required(),
  phone: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  
});

export const loginSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

export const validatePassword = async (savedPassword:string, enteredPassword:string, salt:string) => {
  //bcrypt.compare could be used
  return await GeneratePassword(enteredPassword, salt) === savedPassword;
}

export const option = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};


export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const GenerateSignature = async (payload: AuthPayload) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
};

export const verifySignature = async (signature: string) => {
  return jwt.verify(signature, APP_SECRET);
};

export const updateSchema = Joi.object().keys({
  phone: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  address: Joi.string().required()
});

export const foodSchema = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.string().required(),
    readyTime: Joi.string().required(),
    foodType: Joi.string().required(),
  });
