// config/auth.js
require('dotenv').config();
// expose our config directly to our application using module.exports
module.exports = {
    'twitterAuth' : {
        'consumerKey'        : process.env.CONSUMER_KEY,
        'consumerSecret'     : process.env.CONSUMER_SECRET,
        'callbackURL'        : process.env.CALLBACK_URL
    }
};
