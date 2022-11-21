import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import userRouter from './routes/users'
import adminRouter from './routes/admin'
import indexRouter from './routes/index'
import vendorRouter from './routes/vendor'
import { db } from './config/index'
import dotenv from 'dotenv'
import twilio from 'twilio'

dotenv.config()

db.sync().then(() => { console.log( "db connected successfully")}).catch((err) => {console.log("db connected successfully")})

const app = express();

app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());

const port = process.env.PORT || 4000;

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/admins', adminRouter);
app.use('/vendor', vendorRouter);

app.listen(port, () =>
  console.log(`server running on http://localhost:${port}`)
);

export default app;
