import { DataTypes, Model } from 'sequelize'
import { db } from '../config'
import { v4 as uuidv4 } from 'uuid'

export interface UserAttribute{
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    salt: string;
    address: string;
    phone: string;
    otp: number;
    otp_expiry:Date;
    Lng:number;
    lat:number;
    verified: boolean;
}

export class UserInstance extends Model<UserAttribute>{}
UserInstance.init({
    id:{
        type:DataTypes.UUIDV4,
        primaryKey:true,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
            notNull:{
                msg:"Email address is required"
            },
            isEmail:{
                msg:"please enter a valid email address"
            }
        }
    },
    password: {
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull:{
                msg:"password is required"
            },
            notEmpty:{
                msg:"provide a password"
            }
        }
    
    },
    firstName: {
        type:DataTypes.STRING,
        allowNull:true,
    },
    lastName: {
        type:DataTypes.STRING,
        allowNull:true,
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
        validate:{
            notNull:{
                msg:""
            },
            notEmpty:{
                msg:"provide a phone number"
            },

        }
    },
    otp:{
        type:DataTypes.NUMBER,
        allowNull:false,
        validate:{
            notNull:{
                msg:""
            },
            notEmpty:{
                msg:"provide a phone number"
            },

        }
    },
    otp_expiry: {
        type:DataTypes.DATE,
    allowNull:false,
    validate:{
        notNull:{
            msg:""
        }
    }
},
    Lng:{
        type:DataTypes.NUMBER,
        allowNull:true,
    },
    lat:{
        type:DataTypes.NUMBER,
        allowNull:true,
    },
    verified: {
        type:DataTypes.BOOLEAN,
        allowNull:false,
        validate:{
            notNull:{
                msg: "Otp expired"
            }
        }
    }
},

{
    sequelize: db,
    tableName: "users",
})