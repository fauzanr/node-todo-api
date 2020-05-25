const request = require('supertest');
const expect = require('expect');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [
  {
    _id: new ObjectId(),
    text: 'something to do'
  },
  {
    _id: new ObjectId(),
    text: 'something to do too',
    completed: true,
    completedAt: new Date().getTime()
  },
];

beforeEach(done => {
  Todo.deleteMany({}).then(() => {
    Todo.insertMany(todos).then(todos => done());
  });
});

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