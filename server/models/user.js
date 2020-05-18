const {mongoose} = require('../db/mongoose');

let User = mongoose.model('User', {
  email: {
    type: String,
    minLength: 1,
    required: true
  }
});

module.exports = {User};