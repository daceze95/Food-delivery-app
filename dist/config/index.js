"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_SECRET = exports.userSubject = exports.FromAdminMail = exports.GMAIL_PW = exports.GMAIL_USER = exports.fromAdminPhone = exports.authToken = exports.accountSid = exports.db = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.db = new sequelize_1.Sequelize('app', '', '', {
    storage: "./food.sqlite",
    dialect: "sqlite",
    logging: false
});
exports.accountSid = process.env.AccountSid;
exports.authToken = process.env.AuthToken;
exports.fromAdminPhone = process.env.fromAdninPhone;
exports.GMAIL_USER = process.env.Gmail_User;
exports.GMAIL_PW = process.env.Gmail_PW;
exports.FromAdminMail = process.env.FromAdminMail;
exports.userSubject = process.env.userSubject;
exports.APP_SECRET = process.env.APP_SECRET;
