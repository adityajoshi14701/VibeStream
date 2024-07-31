// this is the basic syntax of importing dotenv file in which in config we state the path of env file
// require('dotenv').config({path:'./env'});
import dotenv from 'dotenv';
import { app } from './app.js';
dotenv.config({path:'./env'})

import connectDB from "./db/index.js";

connectDB()
.then(()=>{
    app.listen(process.env.PORT ||8000,()=>{
        console.log(`Server is running at  Port :${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("Mongo DB connection failed !!!",err)
});
