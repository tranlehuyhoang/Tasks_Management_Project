import express from "express";
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRouter from './routes/userRoute.js';
import boardRoute from './routes/boardRoute.js';
import sectionRoute from './routes/sectionRoute.js';
import taskRoute from './routes/taskRoute.js';

import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import cors from 'cors';




dotenv.config();
connectDB();
const port = process.env.PORT || 300
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/', (req, res) => res.send('Server ready'))
app.use('/api/users', userRouter);
app.use('/api/boards', boardRoute);
app.use('/api/sections', sectionRoute);
app.use('/api/tasks', taskRoute);


app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server start port ${port}`))