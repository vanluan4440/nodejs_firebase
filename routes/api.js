const { log } = require("debug");
var express = require("express");
const { firestore } = require("firebase-admin");
var router = express.Router();
require("dotenv").config();
var jwt = require("jsonwebtoken");
var admin = require("../db.js");
var db = admin.db_database;
var storage = admin.db_storage;

// get all traffic signs

router.get("/getTrafficSingns", authToken, async function(req, res, next) {
    var starCountRef = await db.ref("TrafficSign");
    starCountRef.once("value", (snapshot) => {
        const data = snapshot.val();
        res.send(data);
    });
});

//get all users

router.get("/Users", authToken, async function(req, res, next) {
    var starCountRef = await db.ref("Users");
    starCountRef.once("value", (snapshot) => {
        const data = snapshot.val();
        res.send(data);
    });
});

// create traffic sign

router.post("/create/trafficSign", authToken, function(req, res, next) {
    console.log(req.body);

    db.ref(`TrafficSign/${req.body.id}`)
        .set({
            content: req.body.content,
            name: req.body.name,
            namegrouptype: req.body.group,
            penalty: req.body.penalty,
            image: req.body.url,
        })
        .then(function() {
            return res.send({ message: "success" });
        })
        .catch(function(error) {
            return res.send({ message: "error" });
        });
});

//delete user

router.delete("/deleteUser/:userID", authToken, async function(req, res) {
    var userID = req.params.userID;
    var adaRef = await db.ref(`Users/${userID}`);
    adaRef
        .remove()
        .then(function() {
            return res.send({ message: "success" });
        })
        .catch(function(error) {
            return res.send({ message: "error" });
        });
});

//get data of Item edit

router.get("/edit/:id", authToken, async(req, res) => {
    const id = req.params.id;
    var starCountRef = await db.ref("TrafficSign");
    starCountRef.once("value", (snapshot) => {
        const data = snapshot.val();

        for (const el in data) {
            if (id == el) {
                return res.send({ data: data[id], message: "success" });
            }
        }
    });
});

//delete Item

router.delete("/deleteItem/:id", authToken, async function(req, res, next) {
    const id = req.params.id;
    var userID = req.params.userID;
    var adaRef = await db.ref(`TrafficSign/${id}`);
    adaRef
        .remove()
        .then(function() {
            return res.send({ message: "success" });
        })
        .catch(function(error) {
            return res.send({ message: "error" });
        });
});

//action edit Item

router.post("/editItem", authToken, (req, res) => {
    var ref = db.ref("TrafficSign");
    var upref = ref.child(`${req.body.id}`);
    upref
        .update({
            content: req.body.content,
            name: req.body.name,
            penalty: req.body.penalty,
        })
        .then(() => {
            return res.send({ message: "success" });
        })
        .catch(() => {
            return res.send({ message: "error" });
        });
});

//sort group by

router.get("/sort", authToken, async(req, res) => {
    var ref = await db.ref("TrafficSign");
    ref.once("value", (snapshot) => {
        res.send({ data: snapshot.val() });
    });
});

// function authenticate

function authToken(req, res, next) {
    try {
        var token = req.cookies.token;
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.json({ err: "unauthenticate" });
            req.user = user;
            next();
        });
    } catch {
        res.sendStatus(404);
    }
}

module.exports = router;