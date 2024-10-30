import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth';
import emailRoutes from './routes/email';

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(express.json());

// Setting untuk connect MongoDB
mongoose.connect('mongodb://localhost:27017/mern_dimas')
    .then(() => console.log('DB Connected'))
    .catch((err: Error) => {
        console.log('DBERROR', err)
    });

app.use('/api/auth', authRoutes);
app.use('/api/emails', emailRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
