import express, { Application } from 'express';
import http from 'http';
import { init as initSocketIO } from './utils/socket';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import aiRoutes from './routes/aiRoutes';
import cors from 'cors';

const app:Application = express();
const server: http.Server = http.createServer(app);

app.use(express.json());
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/ai',aiRoutes);

initSocketIO(server);

export { app, server };
