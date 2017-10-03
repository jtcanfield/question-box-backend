const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');//Not in use
const passport = require('passport');//Not in use
const LocalStrategy = require('passport-local').Strategy;//Not in use
const expressValidator = require('express-validator');
const models = require("./models");
const QuestionModel = models.Question;
const UserModel = models.User;
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const mongoURL = 'mongodb://databaseeditor:letsedit@ds157971.mlab.com:57971/questionbox';
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://databaseeditor:letsedit@ds157971.mlab.com:57971/questionbox');
//Db.prototype.authenticate method will no longer be available in the next major release 3.x as MongoDB 3.6 will only allow auth against users in the admin db and will no longer allow multiple credentials on a socket. Please authenticate using MongoClient.connect with auth credentials.

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.text());
app.use(expressValidator());
app.use(function(req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/test", function (req, res, next) {console.log("GET FIRED"); console.log(req.body); res.json(req.body);});
app.post("/test", function (req, res, next) {console.log("POST FIRED"); console.log(req.body); res.json(req.body);});
app.del("/test", function (req, res, next) {console.log("DEL FIRED"); console.log(req.body); res.json(req.body);});
app.patch("/test", function (req, res, next) {console.log("PATCH FIRED"); console.log(req.body); res.json(req.body);});


passport.use(new LocalStrategy(
    function(username, password, done) {
        User.authenticate(username, password, function(err, user) {
          //HERE, USER is the entire user object
            if (err) {
                return done(err)
            }
            if (user) {
                return done(null, user)
            } else {
                return done(null, false, {
                    message: "There is no user with that username and password."
                })
            }
        })
    }
));
passport.serializeUser(function(userobj, done) {
  //HERE, USER is the entire user object
    done(null, userobj.id);//Returns the randomized ID, sends to deserializeUser
});
passport.deserializeUser(function(id, done) {
  //Gets the ID from the serializeUser
    User.findById(id, function(err, userobj) {
      //finds that user object by its ID
        done(err, userobj);//FIND OUT WHERE THIS RETURNS TO
    });
});
app.use(passport.initialize());
app.use(passport.session());



app.post('/register', function(req, res) {
    req.checkBody('username', 'Username must be alphanumeric').isAlphanumeric();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Type Password Again').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Invalid Email').isEmail();
    req.checkBody('password', 'Passwords do not match').equals(req.body.password2);
    req.getValidationResult()
        .then(function(result) {
            if (!result.isEmpty()) {
              console.log(result.mapped());
                // return res.render("signup", {
                //     username: req.body.username,
                //     errors: result.mapped()
                // });
                return res.json("NOOOOOPE");
            }
            const user = new UserModel({
                username: req.body.username,
                name: req.body.name,
                password: req.body.password2,
                email: req.body.email
            })
            const error = user.validateSync();
            if (error) {
                return res.render("signup", {
                    errors: normalizeMongooseErrors(error.errors)
                })
            }
            console.log(user);
            // user.save(function(err) {
            //     if (err) {
            //         return res.render("signup", {
            //             messages: {
            //                 error: ["That username is already taken."]
            //             }
            //         })
            //     }
            //     return res.redirect('/');
            // })
            res.json("got it");
        })
});



app.post("/question", function (req, res, next) {
  const question = new QuestionModel({
            title: req.body.title,
            language: req.body.language,
            question: req.body.question,
            tags: req.body.tags,
            user: "user unavaiable",
            solved: false,
          })
          console.log(question);
  res.json(question);
  // MongoClient.connect(mongoURL, function (err, db) {
  //   const questionlisting = db.collection("questions");
  //   questionlisting.insertOne(JSON.parse(req.params.data));
  // })
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
