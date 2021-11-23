var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
require("dotenv").config();
const { getDatabase, ref, onValue } = require("firebase-admin/database");
var admin = require("../db.js");
var firebase = admin.db_firestore;

//get login page
router.get("/login", function(req, res, next) {
    res.render("login");
});

//get home page

router.get("/home", authToken, function(req, res, next) {
    res.render("main", { content: "templates/home.html" });
});

//get account sign page

router.get("/accountSign", authToken, function(req, res, next) {
    res.render("main", { content: "templates/accountSign.html" });
});

//get create page

router.get("/create", authToken, function(req, res, next) {
    res.render("main", { content: "templates/addTraffic.html" });
});

//get list traffic sign page

router.get("/list", authToken, function(req, res, next) {
    res.render("main", { content: "templates/list.html" });
});

//get report pages

router.get("/report", authToken, function(req, res, next) {
    res.render("main", { content: "templates/report.html" });
});

//get detail page ==> not use in there

router.get("/upload", authToken, function(req, res, next) {
    res.render("main", { content: "templates/upload.html" });
});

// page undefind

router.get("/undefined", authToken, (req, res) => {
    res.json({ message: "undefind" });
});

//post login action

router.post("/login", async function(req, res, next) {
    //auth
    admin = [];
    await firebase
        .collection("admin")
        .get("1")
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                admin.push(doc.data());
            });
        })
        .catch((err) => {
            console.log(err);
        });
    const name = req.body.email;
    const password = req.body.password;
    if (name === admin[0]["name"] && password === admin[0]["password"]) {
        const accessToken = await jwt.sign(
            admin[0],
            process.env.ACCESS_TOKEN_SECRET
        );

        res.json({ accessToken });
    } else {
        res.json({ message: "Wrong Email or Password" });
    }
});

//function authenticate

function authToken(req, res, next) {
    try {
        var token = req.cookies.token;
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.redirect("/login");
            req.user = user;
            next();
        });
    } catch {
        res.sendStatus(404);
    }
}

module.exports = router;