import express, { Request, Response, NextFunction } from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import userRouter from './routes/users'
import indexRouter from './routes/index'
import { db } from './config/index'

db.sync().then(() => { console.log( "db connected successfully")}).catch((err) => {console.log("db connected successfully")})

const app = express();

app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());

const port = 4000;

app.use('/', indexRouter);
app.use('/users', userRouter);

app.listen(port, () =>
  console.log(`server running on http://localhost:${port}`)
);

export default app;
