import express, {Request, Response, NextFunction} from 'express';

export const Register = (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(200).json({
            message: 'success'
        })
    } catch (error) {
        console.log(error)
    }
}