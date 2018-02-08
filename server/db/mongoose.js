var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://dumbuser:test123@ds229648.mlab.com:29648/nodecourse_todoapp' || 'mongodb://localhost:27017/TodoApp');

module.exports ={mongoose};