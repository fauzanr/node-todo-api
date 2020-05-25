const mongoose = require('mongoose');

const MONGO_URI = require('./keys');

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

module.exports = {mongoose};