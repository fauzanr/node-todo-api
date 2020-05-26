const jwt = require('jsonwebtoken');

let data = {
  id: 10
};

let token = jwt.sign(data, 'somesecretkey');
let decoded = jwt.sign(token, 'somesecretkey');
