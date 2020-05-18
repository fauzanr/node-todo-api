const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server', err);
  }

  console.log('Connected to MongoDB server');
  let db = client.db('TodoApp');

  // db.collection('Users').deleteMany({name: 'Andrew'}).then((res) => {
  //   console.log(res);
  // },(err) => {
  //   console.log('Unable to delete User', err);
  // });

  // db.collection('Users').deleteOne({name: 'Andrew'}).then((res) => {
  //   console.log(res);
  // },(err) => {
  //   console.log('Unable to delete User', err);
  // });

  // db.collection('Users').findOneAndDelete({_id: new ObjectId('5ec2892fecc0e33f3c78384d')}).then((res) => {
  //   console.log(res);
  // },(err) => {
  //   console.log('Unable to delete User', err);
  // });

  client.close();
});
