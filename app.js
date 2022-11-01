require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRound = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}))


mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", function (req, res) {
    const un = req.body.username;

    const pass = (req.body.password);
    User.findOne({ email: un }, function (err, foundUser) {
        if (err) {
            console.log("Error not found");
        }
        else {
            if (foundUser) {
                bcrypt.compare(pass, foundUser.password, function (err, result) {
                    if (!err) {
                        if (result === true) {
                            res.render("secrets");
                        }
                        else {
                            console.log("Invalid password");
                        }
                    }
                })
            }
            else {
                console.log("Invalid Email Id");
            }
        }
    })
})

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    bcrypt.hash(req.body.password, saltRound, function (err, hash) {
        if (!err) {
            const newu = new User({
                email: req.body.username,
                password: hash
            })
            newu.save(function (err) {
                if (err) {
                    console.log("Error occured while registering");
                }
                else {
                    res.render("secrets");
                }
            })
        }
    })

})

app.listen(3000, function () {
    console.log("Server started on port 3000");
})