const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// let data = {
//   id: 10
// };

// let token = jwt.sign(data, 'somesecretkey');
// let decoded = jwt.sign(token, 'somesecretkey');

let password = 'password!@#';
let hashedPassword;

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    hashedPassword = hash;
    bcrypt.compare(password, hashedPassword, (err, res) => {
      console.log(res);
    });
  });
});
