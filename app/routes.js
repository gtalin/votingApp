var Polls       = require('../app/models/polls');
module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // POLLS
    app.get('/polls', function(req,res) {
        Polls.find({}, function(err,polls) {
        if (err) console.log(err);
        else console.log(polls);
        res.render('polls.ejs', {polls:polls, user: req.user});
        });
    });

    // CREATE POLL
    app.get('/createPoll', isLoggedIn, function(req,res) {
        res.render('createPoll.ejs');
    });

    app.post('/createPoll', isLoggedIn, function(req, res) {
        var newpoll = new Polls;
        console.log(req.body);
        console.log(req.body.options.split("\r\n"));
        newpoll.userid = req.user._id;
        newpoll.title = req.body.question;
        newpoll.options = req.body.options.split("\r\n");
        var length = req.body.options.split("\r\n").length;
        newpoll.votes = Array.apply(null,Array(length)).map(function() {return 0});
        newpoll.save(function(err) {
	   if (err)
              throw err;
           console.log("Poll saved successfully");
        });

        res.redirect('/polls')
    });

    app.get('/mypolls', isLoggedIn, function(req,res) {
        console.log("user for mypolls", req.user._id);
        var userid = req.user._id;
        Polls.find({"userid" : userid}, function(err,polls) {
          console.log("polls", polls);
          res.render('mypolls.ejs', {polls:polls, user: req.user});
        });
    });

    // VIEW POLL RESULT & VOTE
    app.get('/polls/:id', function(req, res) {
        //res.render('pollResult.ejs', {data: "Specific poll queried and displayed"});
        var id = req.params.id;
        //console.log(req.params.id);
        Polls.findOne({_id : id}, function(err,pollData) {
        if (err) {console.log(err);res.redirect('/polls');}
        //else console.log(pollData);
        res.render('pollDetail.ejs', {pollData:pollData, user: req.user});//
        });
        //res.render('pollDetail.ejs', {data:"Well well"});
    });

    app.post('/polls/:id', function(req,res) {
        var id = req.params.id;
        console.log(id);
        //extract form data from the page and update DB
        console.log("vote acceptedo");
        //console.log(req.body);
        var toVote = req.body.options;
        console.log(toVote);
        Polls.findOne({_id : id}, function(err,data) {
          console.log(data);
          var ix = data.options.indexOf(toVote);
          data.votes[ix] +=1;
          console.log(data);
          data.markModified('votes');//else the database is not updating
          //even with data.save
          data.save(function(err) {
            if (err) {console.log(err);res.redirect('/polls');}
            //else console.log(pollData);
            res.render('pollDetail.ejs', {pollData:data, user: req.user});//
          });
        });
        //res.redirect("/polls");
    });

    // LOGOUT ============================
    app.get('/logout', function(req, res) {
        req.logout();
        //loggedIn = false;
        res.redirect('/');
    });

//

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================
/*
    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));
*/
    // twitter --------------------------------
        /*function checkUrl (req, res, next){
	  req.session.Redirect = req.query.q;
	  next();
	};*/

        // send to twitter to do the authentication
        //app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));
        app.get('/auth/twitter', passport.authenticate('twitter'));

        // handle the callback after twitter has authenticated the user
        app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/polls',
                failureRedirect : '/'
            }));

/*
    // google ---------------------------------

        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));
*/
// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================
/*
    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));
*/
    // twitter --------------------------------

        // send to twitter to do the authentication
        //app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));
        app.get('/connect/twitter', passport.authorize('twitter'));


        // handle the callback after twitter has authorized the user
        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

/*
    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });
*/
    // twitter --------------------------------
    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });
/*
    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

*/
};

//var loggedIn = false;
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
