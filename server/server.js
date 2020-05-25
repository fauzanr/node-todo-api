const express = require('express');
const {ObjectId} = require('mongodb');
const _ = require('lodash');

const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const PORT = process.env.PORT || 3000;

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
  let user = new User({
    email: req.body.email
  });

  user.save().then(user => {
    res.status(201).send({user});
  }).catch(e => res.status(400).send(e));
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

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
module.exports.app = app;