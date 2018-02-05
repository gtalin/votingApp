var mongoose = require('mongoose');

var pollsSchema = mongoose.Schema({
    userid       : String,
    title        : String,
    options      : Array,
    votes        : Array
});

module.exports = mongoose.model('Polls', pollsSchema);
