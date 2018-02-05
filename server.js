// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var sassMiddleware = require('node-sass-middleware');//added recently
//var sass = require('node-sass');
//var routes = require('./routes/index');

var app      = express();
var port     = process.env.PORT || 8080;

//app.use(logger('dev'));//added later


var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var path = require('path');

var configDB = require('./config/database.js');


app.use(morgan('dev')); // log every request to the console

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.set('view engine', 'ejs'); // set up ejs for templating
app.set('views', path.join(__dirname, 'views'));


//added recently for sass
//

/*
app.use(
  sassMiddleware({
    src: __dirname + '/sass',
    dest: __dirname + '/views/css',
    prefix:  '/stylesheets',
    debug: true,
  })
);
*/

/*
app.use(
     sass.middleware({
         src: __dirname + '/sass', 
         dest: __dirname + '/views/css',
         prefix:  '/stylesheets',
         debug: true,         
     })
  ); 
*/




/*
app.use(sassMiddleware({
  src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname,'views/css'),
  debug: true
}),
express.static(path.join(__dirname, 'views')));
*/


//app.use(express.static(path.join(__dirname, 'views')));

//app.use(express.static('views'))
//app.use('/static', express.static(path.join(__dirname, 'views')))
//app.use("/views", express.static(__dirname + 'views'));

//const srcPath = path.join(__dirname, 'scss');
//const destPath = path.join(__dirname, 'views')

/*
app.use(sassMiddleware({
    src: srcPath,
    dest: destPath,
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/prefix'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));
*/

/*
app.use('/polls',sassMiddleware({
  src: srcPath,
  dest: destPath,
  debug: true,
  outputStyle: 'compressed'
}),
express.static(path.join(__dirname, 'views')));

*/

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));

//app.use('/polls', express.static(path.join(__dirname, 'public')));


//express.static(path.join(__dirname, 'views'));
//app.set('views', path.join(__dirname, 'views'));
//app.use("/polls", express.static(path.join(__dirname, 'public')));//or uncomment this

app.use('/polls', express.static(path.join(__dirname, 'public')));



//app.use("/polls",express.static("views"));//uncomment this


//express.static(path.join(__dirname, 'views'));

//polls because css file was being searched from http://127.0.0.1:8080/polls/
//css/styles.css though actual physical location is views/css/styles.css

// set up our express application

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));



/*
app.use (
   sassMiddleware({
     src: __dirname + '/sass',
     dest: __dirname + 'views/css',
     debug: true,
   })
 );
*/

// required for passport
app.use(session({
    secret: 'ilovescotchscotchyscotchscotch', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
