const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const multer = require('multer');
// const upload = multer();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const mongoURL = 'mongodb://databaseeditor:letsedit@ds157971.mlab.com:57971/questionbox';
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://databaseeditor:letsedit@ds157971.mlab.com:57971/questionbox');
//Db.prototype.authenticate method will no longer be available in the next major release 3.x as MongoDB 3.6 will only allow auth against users in the admin db and will no longer allow multiple credentials on a socket. Please authenticate using MongoClient.connect with auth credentials.

// app.use(express.bodyParser());
app.use(bodyParser.json());

app.use(function(req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get("/test", function (req, res, next) {
  console.log("GET FIRED");
  console.log(req.body);
  res.json(req.body);
});
app.post("/test", function (req, res, next) {
  console.log("POST FIRED");
  console.log(req.body);
  res.json(req.body);
});
app.del("/test", function (req, res, next) {
  console.log("DEL FIRED");
  console.log(req.body);
  res.json(req.body);
});
app.patch("/test", function (req, res, next) {
  console.log("PATCH FIRED");
  console.log(req.body);
  res.json(req.body);
});


/*
        Prefix Verb   URI Pattern              Controller#Action
        questions GET    /questions(.:format)     questions#index
                  POST   /questions(.:format)     questions#create
         question GET    /questions/:id(.:format) questions#show
                  PATCH  /questions/:id(.:format) questions#update
                  DELETE /questions/:id(.:format) questions#destroy
          answers GET    /answers(.:format)       answers#index
                  POST   /answers(.:format)       answers#create
           answer GET    /answers/:id(.:format)   answers#show
                  PATCH  /answers/:id(.:format)   answers#update
                  DELETE /answers/:id(.:format)   answers#destroy
question_answers  GET    /questions/:question_id/answers(.:format)     answers#index
                  POST   /questions/:question_id/answers(.:format)     answers#create
  question_answer GET    /questions/:question_id/answers/:id(.:format) answers#show
                  PATCH  /questions/:question_id/answers/:id(.:format) answers#update
                  DELETE /questions/:question_id/answers/:id(.:format) answers#destroy
                 */
/*
app.get("/:dynamicsolo", function (req, res) {
 MongoClient.connect(mongoURL, function (err, db) {
   const statsdb = db.collection("statistics");
   statsdb.find().toArray(function (err, docs) {
     return res.json(docs);
   })
 })
});
app.post("/stats/:data", function (req, res) {
  MongoClient.connect(mongoURL, function (err, db) {
    const statsdb = db.collection("questions");
    statsdb.insertOne(JSON.parse(req.params.data));
  })
});
*/
app.listen(/*process.env.PORT || */5000);
  MongoClient.connect(mongoURL, function(err, db) {
    if (err){
      console.log("ERROR");
      console.log(err);
    }
  db.close();
});
