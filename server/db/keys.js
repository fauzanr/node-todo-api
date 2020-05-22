if(process.env.NODE_ENV === 'heroku') {
  module.exports = 'mongodb+srv://fauzanr:Vwxa22Y01zafO9vz@cluster0-bq0g9.mongodb.net/test?retryWrites=true&w=majority';
} else {
  module.exports = 'mongodb://localhost:27017/TodoApp';
}