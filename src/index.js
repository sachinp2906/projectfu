const express = require('express')
const mongoose = require('mongoose')
const route = require('./routes/route.js')
const multer = require('multer')
//const { AppConfig } = require('aws-sdk');
const app = express()
app.use(express.json())
app.use(multer().any())



mongoose.connect('mongodb+srv://sachinfu:2906@sachinfu.fcpe6tc.mongodb.net/group26database', {
    useNewUrlParser : true
})
.then(()=>console.log("mongoDb is connected"))
.catch(err=>console.log(err))

app.use('/' , route)
app.listen((process.env.PORT || 3000) , function() {
    console.log("app running on port 3000")
})