const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;

mongoose.connect('mongodb://localhost:27017/warbler', {
    keepAlive: true,
	useUnifiedTopology: true,
	useNewUrlParser: true
})
.then(console.log('connected'))
.catch(err => console.log('failed to connect'));

module.exports.User = require('./user');
module.exports.Message = require('./message');