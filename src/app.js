import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import e from 'cors';
const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))

// the configuration limits the size of the incoming json object/file
app.use(express.json({
    limit:"16kb",
}))

//to configure url encoding , extended enables us to give objects within objects
app.use(express.urlencoded({
    extended:true,
    limit:'16 kb',
}))

//static configuration : 
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.routes.js"

app.use('/api/v1/users',userRouter);

export {app};