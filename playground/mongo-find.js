const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server', err);
  }

  console.log('Connected to MongoDB server');
  let db = client.db('TodoApp');

  db.collection('Users').find({
    name: 'Andrew'
  }).toArray().then((res) => {
    console.log(res);
  },(err) => {
    console.log('Unable to fetch Todos', err);
  });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log('Todos count: ', count);
  // },(err) => {
  //   console.log('Unable to fetch Todos', err);
  // });

  // db.collection('Todos').find().toArray().then((res) => {
  //   console.log(res);
  // },(err) => {
  //   console.log('Unable to fetch Todos', err);
  // });

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false,
  // }, (err, res) => {
  //   if (err) {
  //     return console.log('Unable to insert Todo', err);
  //   }

  //   console.log(JSON.stringify(res.ops, undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Andrew',
  //   age: 25,
  //   location: 'Philadelphia'
  // }, (err, res) => {
  //   if (err) {
  //     return console.log('Unable to insert Todo', err);
  //   }

  //   console.log(res.ops[0]._id.getTimestamp());
  // });

  client.close();
});
