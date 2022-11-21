import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const db = new Sequelize('app', '', '', {
    storage: "./food.sqlite",
    dialect: "sqlite",
    logging: false
})

export const accountSid = process.env.AccountSid;
export const authToken = process.env.AuthToken;
export const fromAdminPhone = process.env.fromAdninPhone;
export const GMAIL_USER = process.env.Gmail_User;
export const GMAIL_PW = process.env.Gmail_PW;
export const FromAdminMail = process.env.FromAdminMail as string;
export const userSubject = process.env.userSubject as string;
export const APP_SECRET = process.env.APP_SECRET as string