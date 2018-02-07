var Polls       = require('../app/models/polls');
module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
      Polls.find({}, function(err, polls) {
        if (err) console.log(err);
        else console.log(polls);
        res.render("index.ejs", {polls:polls, user: req.user});
      })
        //res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // POLLS
    /*app.get('/polls', function(req,res) {
        Polls.find({}, function(err,polls) {
        if (err) console.log(err);
        else console.log(polls);
        res.render('polls.ejs', {polls:polls, user: req.user});
        });
    });*/

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

        res.redirect('/')
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
                successRedirect : '/',
                failureRedirect : '/'
            }));


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

    // twitter --------------------------------
    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });
};

//var loggedIn = false;
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
