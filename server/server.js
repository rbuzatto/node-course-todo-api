require('./config/config');

const _           = require('lodash');
const express     = require('express');
const bodyParser  = require('body-parser');
const {ObjectID}  = require('mongodb');

var {mongoose}      = require('./db/mongoose');
var {Todo}          = require('./models/todo');
var {User}          = require('./models/user');
var {authenticate}  = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

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

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.status(200).send({todo});

    }).catch((e) => res.status(400).send());
});

/* este route usa http patch method - update */

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    //new: true é o eq. do mongoose do mongodb returnOriginal: false
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

// -- POST /users -usar pick lodash email password

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    })
    .then((token) => {
        res.header('x-auth', token).send(user);
    })
    .catch((err) => {
        res.status(400).send(err);
    });

});

// POST /users/login 

app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    var passwordValid;

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => res.status(400).send());

});


app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
       res.status(400).send(); 
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};

/* -- TOKEN SYSTEM ---
- gonna be sent back from our signup and login request
- client gonna use the token to authenticate others request like patching, deleting, posting

*/