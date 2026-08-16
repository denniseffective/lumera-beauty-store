import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { productRouter } from './productRoutes.js';
import { notFound, errorHandler } from './middleware.js';

export const app=express();
app.use(helmet());
app.use(cors({origin:process.env.FRONTEND_URL || 'http://localhost:3000'}));
app.use(express.json({limit:'100kb'}));
app.get('/api/health',(req,res)=>res.json({status:'ok'}));
app.use('/api',productRouter);
app.use(notFound);
app.use(errorHandler);
