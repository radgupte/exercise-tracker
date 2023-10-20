require('dotenv').config();
let express = require('express');
let app = express();
let mongoose = require('mongoose');

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'Connection error: '));
connection.once('open', () => {
  console.log('Successfully established connection with MongoDB database');
});
