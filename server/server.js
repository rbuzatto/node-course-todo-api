var express     = require('express');
var bodyParser  = require('body-parser');
var {ObjectID}  = require('mongodb');

var {mongoose}  = require('./db/mongoose');
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

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos}); //aqui ele envia obj, pq no futuro vc pode inserir outros itens
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET /todos/12345
// validate id -> ObjectID method - respond w/ 404 e send empty body
// querie data w/ findById
// success -> if todo - send it back / if no todo - send back 404
// error -> send back 400 - não enviamos de volta nada no momento pq o error pode enviar private info
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo}); //caso queira enviar outras infos junto do obj

    }).catch((e) => res.status(400).send());
});


app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};