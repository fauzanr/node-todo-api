const request = require('supertest');
const expect = require('expect');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [
  {
    text: 'somethind to do'
  },
  {
    text: 'something to do too'
  },
  {
    text: 'something to do also'
  }
]

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
      .expect(200)
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
        Todo.find().then(todos => {
          expect(todos.length).toBe(3);
          done();
        }).catch(e => done(e));
      });
  });
});

describe('POST /todos', () => {
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