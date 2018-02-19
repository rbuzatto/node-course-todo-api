const {ObjectID}  = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'rafael@rafa.com',
    password: 'useOne1',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, 
    {
    _id: userTwoId,
    email: 'fake@rafa.com',
    password: 'userTwo2'
}];

const todos = [{
    _id: new ObjectID(),
    text: 'first todo'
}, {
    _id: new ObjectID(),
    text: 'second todo',
    completed: true,
    completedAt: 345
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};