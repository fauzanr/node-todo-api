const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');

const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/User');

const id = '4ec5814d59756621d821b17b';
const userId = '5ec2be43e04626420ce73505';

// Todo.find({
//   _id: id
// }).then(todos => {
//   console.log('todos', todos);
// });

// Todo.findOne({
//   _id: id
// }).then(todo => {
//   console.log('todo', todo);  
// }, e => console.log(e));

// Todo.findById(id).then(todo => {
//   if(!todo) {
//     return console.log('ID not found');
//   }

//   console.log('todo', todo);
// }).catch(e => console.log(e));

User.findById(userId).then(user => {
  if(!user) {
    return console.log('ID not found');
  }

  console.log('user', user);
}).catch(e => console.log(e));