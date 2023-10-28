//const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import conectDB from './config/db.js';
import morgan from 'morgan';
import authRoutes from './routes/authRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import productRoute from './routes/productRoute.js';
import cors from 'cors';
import path from 'path';

// configure dotenv
dotenv.config();

//database config
conectDB();

//Rest Object
const app = express();

//morgan config middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(express.static(path.join(__dirname, './client/build')))
//routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/category', categoryRoute)
app.use('/api/v1/product',productRoute)
//Rest API
app.use('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})

//Port
const PORT = process.env.PORT;

//Run Listen
app.listen(PORT, ()=>{
    console.log(`Server is running on Port ${PORT}`);
})