//config database

var admin = require("firebase-admin");
var serviceAccount = require("./webservice-tsr-firebase-adminsdk-ym9px-a85c0ec5ce.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://webservice-tsr-default-rtdb.firebaseio.com",
});
//export modele
module.exports.db_firestore = admin.firestore();
module.exports.db_database = admin.database();
module.exports.db_storage = admin.storage();
module.exports.admin = admin;