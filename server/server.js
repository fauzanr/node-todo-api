const express = require('express');
const bodyParser = require('body-parser');

const {ObjectId} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const PORT = process.env.PORT || 3000;

let app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then(doc => {
    res.send(doc);
  }, e => {
    res.status(400).send(e);
  });
});

app.post('/users', (req, res) => {
  let user = new User({
    email: req.body.email
  });

  user.save().then(doc => {
    res.send(doc);
  }, e => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then(todos => {
    res.send({todos});
  }, e => {
    res.status(404).send(e);
  })
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

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
module.exports.app = app;