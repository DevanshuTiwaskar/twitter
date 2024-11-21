const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('./config/db.config')

app.get('/', (req, res) => {
  res.send('Hello World');
});






app.listen(3000, () => {
  console.log('Server is running on port 3000');
});