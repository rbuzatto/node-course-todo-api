const {ObjectID}    = require('mongodb');

const {mongoose}    = require('./../server/db/mongoose');
const {Todo}        = require('./../server/models/todo');
const {User}        = require('./../server/models/user');

// 3 metodos de delete by mongoose
// Todo.remove({})

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove({_id: 'fsdfasf87saf8sd'}).then

Todo.findByIdAndRemove('5a7c8e906cd8560014bacf8d').then((todo) => {
    console.log(JSON.stringify(todo, undefined, 2));
});