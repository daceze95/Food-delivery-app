import { DataTypes, Model } from 'sequelize'
import {db} from '../config'

export interface foodAttributes{
    id:string,
    name:string,
    description:string,
    category:string,
    price:number,
    foodType:string,
    readyTime:string,
    rating:number,
    vendorId:string
}

export class foodInstance extends Model<foodAttributes>{}

foodInstance.init({
    id: {
        type:DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    
    foodType: {
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
    price: {
        type:DataTypes.NUMBER,
        allowNull: true,
    },
    category: {
        type:DataTypes.STRING,
        allowNull:false,
    },
    readyTime: {
        type:DataTypes.STRING,
        allowNull:true,
    },
    description: {
        type:DataTypes.STRING,
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
    vendorId: {
        type:DataTypes.UUIDV4,
        allowNull:true,
    }
}, 
{
    sequelize: db,
    tableName: "food"
})
