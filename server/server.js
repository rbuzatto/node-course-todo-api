var express     = require('express');
var bodyParser  = require('body-parser');

var{mongoose}   = require('./db/mongoose');
var {Todo}      = require('./models/todo');
var {User}      = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (error) => {
        res.status(400).send(error);
    });
});

app.post('/users', (req, res) => {
    var user = new User({
        email: req.body.email
    });

    user.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err.errors.email.message);
    });
});



app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};