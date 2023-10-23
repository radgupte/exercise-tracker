require('dotenv').config();
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
const shortid = require('shortid');

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

// Creating a schema for User
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  _id: {
    type: String,
    required: true,
  },
});
User = mongoose.model('User', userSchema);

// Function to create a new user
const createUser = async (uname) => {
  const id = shortid.generate(uname);

  try {
    let existingUser = await User.findOne({ username: uname });

    if (existingUser) {
      return { error: 'User already exists' };
    } else {
      const new_user = new User({
        username: uname,
        _id: id,
      });
      await new_user.save();
      return {
        username: uname,
        _id: id,
      };
    }
  } catch (err) {
    return { error: 'Bad Request' };
  }
};

// Function to return all users
const getAllUsers = async () => {
  try {
    const all_users = await User.find();
    return all_users;
  } catch (err) {
    return { error: 'Bad Request' };
  }
};

exports.UserModel = User;
exports.createUser = createUser;
exports.getAllUsers = getAllUsers;
