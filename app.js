'use strict';

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');

// Connect to database
mongoose.connect(config.database);
let db = mongoose.connection;
// Check connection
db.once('open', function(){
  console.log('Connected to mongoDB');
});
// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

// Initialise app
const app = express();
// Bring in models
let Article = require('./models/article');

// Load view engines
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set public folder
app.use(express.static(__dirname + '/public'));

///////////////      Middleware       ////////////////

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}))

// Express messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
})

// Express validator Middleware
app.use(expressValidator({
errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root    = namespace.shift()
    , formParam = root;

  while(namespace.length) {
    formParam += '[' + namespace.shift() + ']';
  }
  return {
    param : formParam,
    msg   : msg,
    value : value
  };
}
}));

// Passport config
require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());


//
app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});



// Home route
app.get('/', function(req, res) {
  // Get all articles, function takes error if there is one and the response which is thr articles
  Article.find({}, function(err, articles){
    res.render('index', {
      title:'Articles',
      // pass in articles object created above for now
      articles: articles
    });
  });
});

// Route Files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

// Start server
app.listen(8000, function(){
  console.log('Server started on port 8000....');
});
