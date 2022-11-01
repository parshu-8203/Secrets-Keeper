//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');
//hashing npm package


// const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}))




mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// const secret = process.env.SECRET;


// userSchema.plugin(encrypt,{secret:secret,encryptedFields:['password']});


const User = mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",function(req,res) {
    const un = req.body.username;
    //hashing the user entered password
    const pass = md5(req.body.password); 
    User.findOne({email:un},function(err,foundUser){
        if(err) {
            console.log("Error not found");
        }
        else
        {
            if(foundUser) 
            {
                if(foundUser.password === pass) {
                    res.render("secrets");
                }
                else
                {
                    console.log("Invalid Password");
                }
            }
        }
    })
})

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res) {
    const newu = new User({
        email: req.body.username,
        password: md5(req.body.password)
    })
    newu.save(function(err) {
        if(err) {
            console.log("Error occured while registering");
        }
        else
        {
            res.render("secrets");
        }
    })
})

app.listen(3000,function() {
    console.log("Server started on port 3000");
})