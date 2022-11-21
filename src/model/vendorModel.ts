import { DataTypes, Model } from 'sequelize'
import {v4 as uuidv4 } from 'uuid';
import {db} from '../config'
import { foodInstance } from './foodModel';

export interface VendorAttributes{
    id: string;
    name: string;
    ownerName: string;
    pincode: string;
    phone: string;
    address:string;
    email:string;
    password:string;
    salt:string;
    serviceAvailablity:boolean;
    rating:number
    role:string;
    // otp: number;
    // otp_expiry: Date;
    // lng:number;
    // lat: number;
    // verified:boolean;

}

export class VendorInstance extends Model<VendorAttributes>{}

VendorInstance.init({
    id: {
        type:DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type:DataTypes.STRING,
        allowNull: false,
        unique:true,
        validate: {
            notNull: {
                msg: 'Email address is required'
            },
            isEmail: {
                msg: "please provide only valid email"
            }
        }
    },
    password: {
        type:DataTypes.STRING,
        allowNull:false,
        validate: {
            notNull: {
                msg: "password is required"
            },
            notEmpty: {
                msg: "provide a password",
            },
        }
    },
    name: {
        type:DataTypes.STRING,
        allowNull: true,
    },
    ownerName: {
        type:DataTypes.STRING,
        allowNull: true,
    },
    salt: {
        type:DataTypes.STRING,
        allowNull:false,
    },
    address: {
        type:DataTypes.STRING,
        allowNull:true,
    },
    phone: {
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate: {
            notNull:{
                msg: "phone number is required"
            },
            notEmpty: {
                msg: "provide a phone number",
            },
        }
    },
    pincode: {
        type:DataTypes.NUMBER,
        allowNull:true,
    },
    serviceAvailablity: {
        type:DataTypes.BOOLEAN,
        allowNull:true,
    },
    rating: {
        type:DataTypes.NUMBER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "User must e verified",
            },
            notEmpty: {
                msg: "User not verified",
            },
        }
    },
    role: {
        type:DataTypes.STRING,
        allowNull:true,
    }
},
    {
        sequelize:db,
        tableName: 'vendor'
    }
);

VendorInstance.hasMany(foodInstance, {foreignKey:"vendorId", as:"food"}) ;
foodInstance.belongsTo(VendorInstance, {foreignKey:"vendorId", as:"vendor"})