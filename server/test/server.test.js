const request = require('supertest');
const expect = require('expect');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, users, populateUsers, populateTodos} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create new Todo', done => {
    let text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(201)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.find({text}).then(todos => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(res.body.text);
          done();
        }).catch(e => done(e));
      });
    });

  it('should not create Todo with invalid data', done => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        
        expect(res.body).toHaveProperty('errors');
        Todo.find().then(res => {
          expect(res.length).toBe(todos.length);
          done();
        }).catch(e => done(e));
      });
  });
});

describe('GET /todos', () => {
  it(`it should get ${todos.length} todos`, done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(todos.length);
      }, e => done(e))
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it(`should return a todo doc`, done => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[1].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', done => {
    let dummyId = new ObjectId().toHexString();
    request(app)
      .get(`/todos/${dummyId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-objectids', done => {
    request(app)
      .get(`/todos/213`)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', done => {
    let hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
  
        Todo.findById(hexId).then(todo => {
          expect(todo).toBeNull();
          done();
        }).catch(e => done(e));
    });
  });

  it('should return 404 if todo not found', done => {
    let hexId = new ObjectId().toHexString();
  
    request(app)
      .delete('/todos/'+hexId)
      .expect(404)
      .end(done);
    });

  it('should return 404 for non-objectid', done => {
    let hexId = '123312123';
  
    request(app)
      .delete('/todos/'+hexId)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update a todo', done => {
    let hexId = todos[0]._id.toHexString();
    let body = {
      text: 'test completed',
      completed: true
    };

    request(app)
      .patch(`/todos/${hexId}`)
      .send(body)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(body.text);
        expect(res.body.todo.completed).toBe(body.completed);
        expect(res.body.todo.completedAt).toBeTruthy();
      }).end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(res.body.todo._id).then(todo => {
          if (!todo) {
            return done('ID not found');
          }

          expect(todo.text).toBe(body.text);
          expect(todo.completed).toBe(body.completed);
          expect(todo.completedAt).toBeTruthy();
          done();
        }).catch(e => done(e));
      })
  });

  it('should clear completedAt when todo is not completed', done => {
    let hexId = todos[1]._id.toHexString();
    let body = {
      text: 'test not completed',
      completed: false
    };

    request(app)
      .patch(`/todos/${hexId}`)
      .send(body)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(body.text);
        expect(res.body.todo.completed).toBe(body.completed);
        expect(res.body.todo.completedAt).toBeNull();
      }).end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(res.body.todo._id).then(todo => {
          if (!todo) {
            return done('ID not found');
          }

          expect(todo.text).toBe(body.text);
          expect(todo.completed).toBe(body.completed);
          expect(todo.completedAt).toBeNull();
          done();
        }).catch(e => done(e));
      })
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      }).end(done);
  });

  it('should return 401 if not authenticated', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', 'somerandomtoken')
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', done => {
    let newUser = {
      email: 'jan@example.com',
      password: 'janPassword'
    };

    request(app)
      .post('/users')
      .send(newUser)
      .expect(201)
      .expect(res => {
        expect(res.header['x-auth']).toBeTruthy();
        expect(res.body.user.email).toContain(newUser.email);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        User.findOne({email: newUser.email}).then(user => {
          expect(user.email).toBe(newUser.email);
          expect(user.password).not.toBe(newUser.email);
          expect(user.tokens[0].token).toBeTruthy();
          done();
        }).catch(e => done(e));
      });
  });
  
  it('should return validation error if request invalid', done => {
    let newUser = {
      email: 'jample.com',
      password: 'jard'
    };

    request(app)
      .post('/users')
      .send(newUser)
      .expect(400)
      .end(done);
  });

  it('should not create user if email is in use', done => {
    let newUser = {
      email: users[0].email,
      password: 'janPassword'
    };

    request(app)
      .post('/users')
      .send(newUser)
      .expect(400)
      .end(done);
  });

});

describe('POST /users/login', () => {
  it('should login user and return auth token', done => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password,
      })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        User.findById(users[1]._id).then(user => {
          expect(user.tokens[0]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth'],
          });
          done();
        }).catch(e => done(e));
      });
  });

  it('should reject invalid login', done => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password+'a',
      })
      .expect(400)
      .expect(res => {
        expect(res.headers['x-auth']).toBeUndefined();
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        User.findById(users[1]._id).then(user => {
          expect(user.tokens.length).toEqual(0);
          done();
        }).catch(e => done(e));
      });
  });
})

describe('DELETE /users/me/token', () => {
  it('should remove auth token and logout', done => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        User.findById(users[1]._id).then(user => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch(e => done(e));
      });
  });

});