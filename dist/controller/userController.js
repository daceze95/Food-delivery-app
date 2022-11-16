"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = void 0;
const utility_1 = require("../utils/utility");
const Register = async (req, res, next) => {
    try {
        const { email, Phone, password, confirm_password } = req.body;
        const validateResult = utility_1.registerSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            // console.log(validateResult.error.details)
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const salt = await (0, utility_1.GenerateSalt)();
        const userPassword = await (0, utility_1.GeneratePassword)(password, salt);
        console.log(userPassword);
    }
    catch (error) {
        // console.log(error);
        res.status(500).json({
            Error: 'Internal server Error',
            route: "/users/signup"
        });
    }
};
exports.Register = Register;
