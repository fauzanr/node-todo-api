require('./config/config');

const _ = require('lodash');
const express = require('express');
const bcrypt = require('bcryptjs');
const {ObjectId} = require('mongodb');


const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const PORT = process.env.PORT;

let app = express();

app.use(express.json());

// GET
app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.get('/todos', (req, res) => {
  Todo.find().then(todos => {
    res.send({todos});
  }).catch(e => res.status(404).send(e));
});

app.get('/todos/:id', (req, res) => {
  let {id} = req.params;

  if(!ObjectId.isValid(id)) {
    return res.status(404).send('object not valid');
  }

  Todo.findById(id).then(todo => {
    if(!todo) {
      return res.status(404).send('todo not found');
    }

    res.send({todo});
  }).catch(e => res.status(400).send({text: 'error fetching', e}));
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST
app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then(doc => {
    res.status(201).send(doc);
  }).catch(e => res.status(400).send(e));
});

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then(token => {
    res.header('x-auth', token).status(201).send({user});
  }).catch(e => res.status(400).send(e));
});

app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then(user => {
    return user.generateAuthToken().then(token => {
      res.header('x-auth', token).send(user);
    })
  }).catch(e => res.status(400).send());
});

// PATCH
app.patch('/todos/:id', (req, res) => {
  let {id} = req.params;
  let body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectId.isValid(id)) {
    return res.send(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then(todo => {
    if(!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch(e => res.status(400).send());
});

// DELETE
app.delete('/todos/:id', (req, res) => {
  let {id} = req.params;

  if(!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndDelete(id).then(todo => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo})
  }).catch(e => res.status(400).send());
});

app.delete('/users/me/token',authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
module.exports.app = app;