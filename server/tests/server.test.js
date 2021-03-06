const expect        = require('expect');
const request       = require('supertest');
const {ObjectID}    = require('mongodb');

const {app}         = require('./../server');
const {Todo}        = require('./../models/todo');
const {User}        = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

// beforeEach((done) => {
//     Todo.remove({}).then(() => done());
// });

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send({text}) //esse obj é convertido em JSON por supertest
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e));
        });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send({})
        .expect(400)
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => done(e));
        });
    });


});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
        .get('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(1);
        })
        .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });
    
    it('should not return todo doc created by other user', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        let hexId =new ObjectID().toHexString();

        request(app)
        .get(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123abc')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch((e) => done(e));
            });
    });
    
    it('should not remove a todo from other user', (done) => {
        var hexId = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeTruthy();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();

        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete('/todos/123abc')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        //grab id first item - patch request, provide proper url com id inside
        //update text, set completed true
        // return 200, custom assertion - res.body has text prop = text sent *
        // * verify completed is true, completedAt is a number (.toBeA)
        var hexId       = todos[0]._id.toHexString();
        var text        = 'patch supertest';
        var completed   = true;
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({text, completed})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo.text).toBe(text);
                    expect(todo.completed).toBe(true);
                    expect(typeof todo.completedAt).toBe('number');
                    done();
                }).catch((e) => done(e));
            });

    });
    
    it('should not update a todo from other user', (done) => {
        var hexId       = todos[1]._id.toHexString();
        var text        = 'patch supertest';
        var completed   = true;
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({text, completed})
            .expect(404)
            .end(done);

    });

    it('should clear completedAt when todo is not completed', (done) => {
    //     //grab id of second todo item
    //     //update text, set completed to false
    //     // 200, text is changed to ... , completed false, completedAt is null (.toBeFalsy)
        var hexId       = todos[1]._id.toHexString();
        var text        = 'patch supertest';
        var completed   = false;

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({text, completed})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo.text).toBe(text); //esses testes eu fiz por conta mas o prof não
                    expect(todo.completed).toBe(false);
                    expect(todo.completedAt).toBeFalsy();
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /users/me', () => {
    it('should return user if athenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        // make a call to the users/me route & 401
        // expect body empty object
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({});
        })
        .end(done);

    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'example@example.com';
        var password = 'users123';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe(email);
        })
        .end((err) => {
            if (err) {
                return done(err);
            }

            User.findOne({email}).then((user) => {
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(password);
                done();
            }).catch((e) => done(e));
        });
    });

    it('should return validation errors if request invalid', (done) => {
        //send invalid email and invalid password, exp 400
        let invalidEmail = 'email';
        let invalidPassword = '0';
        request(app)
        .post('/users')
        .send({invalidEmail, invalidPassword})
        .expect(400)
        .end(done);

    });

    it('should not create user if email in use', (done) => {
        //use one email in users const, exp 400
        let emailDuplicated = users[0].email;
        let password = 'passrd123';
        request(app)
        .post('/users')
        .send({emailDuplicated, password})
        .expect(400)
        .end(done);

    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password
        })
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            User.findById(users[1]._id).then((user) => {
                expect(user.toObject().tokens[1]).toMatchObject({
                    access: 'auth',
                    token: res.headers['x-auth']
                });
                done();
            }).catch((e) => done(e));
        });
    });

    it('should return invalid login', (done) => {
        // pass invalid password - 400, x-auth toBeFalsy -- user.tokens[0].lenght = 0
        const invalidPassword = '123123123132';
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: invalidPassword
        })
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeFalsy();
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(1);
                done();
            }).catch((e) => done(e));
        });

    });
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        // delete /users/me/toke; set x-auth =token; exp 200 , end find user, token length = 0
        let token = users[0].tokens[0].token;
        request(app)
        .delete('/users/me/token')
        .set('x-auth', token)
        .expect(200)
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            User.findById(users[0]._id).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e) => done(e));
        });
    });
});
