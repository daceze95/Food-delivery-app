"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = void 0;
const Register = (req, res, next) => {
    try {
        return res.status(200).json({
            message: 'success'
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.Register = Register;
