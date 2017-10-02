const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const mongoURL = 'mongodb://databaseeditor:letsedit@ds139904.mlab.com:39904/memorygamedb';
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://databaseeditor:letsedit@ds139904.mlab.com:39904/memorygamedb');
//Db.prototype.authenticate method will no longer be available in the next major release 3.x as MongoDB 3.6 will only allow auth against users in the admin db and will no longer allow multiple credentials on a socket. Please authenticate using MongoClient.connect with auth credentials.
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.post("/stats/:data", function (req, res) {
  MongoClient.connect(mongoURL, function (err, db) {
    const statsdb = db.collection("statistics");
    statsdb.insertOne(JSON.parse(req.params.data));
  })
});
app.get("/stats", function (req, res) {
  MongoClient.connect(mongoURL, function (err, db) {
    const statsdb = db.collection("statistics");
    statsdb.find().toArray(function (err, docs) {
      return res.json(docs);
    })
  })
});
app.listen(process.env.PORT || 5000);
MongoClient.connect(mongoURL, function(err, db) {
  if (err){
    console.log("ERROR");
    console.log(err);
  }
  db.close();
});
