import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { connectDB } from './config/db';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/errorHandler';



const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


connectDB();

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/user', userRoutes);

app.use(errorHandler);

export default app;
