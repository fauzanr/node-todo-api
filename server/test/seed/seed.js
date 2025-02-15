const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const users = [
  {
    _id: userOneId,
    email: 'userOne@example.com',
    password: 'userOnePassword',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  },
  {
    _id: userTwoId,
    email: 'userTwo@example.com',
    password: 'userTwoPassword',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  },
];

const todos = [
  {
    _id: new ObjectId(),
    text: 'something to do',
    _creator: userOneId
  },
  {
    _id: new ObjectId(),
    text: 'something to do too',
    completed: true,
    completedAt: new Date().getTime(),
    _creator: userTwoId
  },
];

let populateUsers = done => {
  User.deleteMany({}).then(() => {
    let doc = [];

    users.forEach(user => {
      let saved = new User(user).save();
      doc.push(saved);
    });

    Promise.all(doc).then(() => done());
  });
}

let populateTodos = done => {
  Todo.deleteMany({}).then(() => {
    Todo.insertMany(todos).then(() => done());
  });
}

module.exports = {
  users,
  todos,
  populateUsers,
  populateTodos,
}