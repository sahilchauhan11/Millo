import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoDbConnection from './utils/mongoDbConnection.js';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import messageRoutes from './routes/message.routes.js'; 
import { server,app } from './socket/socketIo.js'


dotenv.config();
const port = process.env.PORT ;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [process.env.URL];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
  
app.use(cors(corsOptions));

app.use('/api/v1/user',userRoutes);
app.use('/api/v1/post',postRoutes);
app.use('/api/v1/message',messageRoutes);


server.listen(port, () => {
  mongoDbConnection();
  console.log(`Server  listen at port->${port}`);
});








