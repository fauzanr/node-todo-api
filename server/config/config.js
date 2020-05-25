let env = process.env.NODE_ENV || 'development';

if(env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if(env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
} else if(env === 'heroku') {
  process.env.MONGODB_URI = 'mongodb+srv://fauzanr:Vwxa22Y01zafO9vz@cluster0-bq0g9.mongodb.net/test?retryWrites=true&w=majority';
}