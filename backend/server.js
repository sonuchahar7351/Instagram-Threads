import express from 'express';
import path from 'path'
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
// import {v2 as cloudinary} from 'cloudinary';
import {app,server} from "./socket/socket.js";
import job from './cron/cron.js';
// import {cors} from cors;

dotenv.config();
connectDB();

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

job.start();

const PORT=process.env.PORT || 5000;
const _dirname = path.resolve();




app.use(express.json({limit:"50mb"})); //To parse JSON data in the req.body 
app.use(express.urlencoded({extended:true})) // to parse form data in the req.body 
app.use(cookieParser());
// app.use(cors());

// Routes 
app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/message',messageRoutes);


// Serve static assests if in production

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(_dirname,'/frontend/dist')))
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(_dirname,'frontend','dist','index.html'))
    })
}

server.listen(PORT,()=>console.log(`server is started at http://localhost:${PORT}`))