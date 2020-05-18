const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server', err);
  }

  console.log('Connected to MongoDB server');
  let db = client.db('TodoApp');

  // db.collection('Todos').findOneAndUpdate({
  //     _id: new ObjectId('5ec294d8ecc0e33f3c78384f'),
  //   }, {
  //     $set: {
  //       completed: true
  //     }
  //   }, {
  //     returnOriginal: false
  //   }
  // ).then(res => {
  //   console.log(res);
  // });

  db.collection('Users').findOneAndUpdate({
      _id: new ObjectId('5ec2892fecc0e33f3c78384c'),
    }, {
      $inc: {
        age: 1
      },
      $set: {
        name: 'Jan'
      }
    }, {
      returnOriginal: false
    }
  ).then(res => {
    console.log(res);
  });

  client.close();
});
