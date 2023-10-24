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

// Creating a schema for Exercise
const exerciseSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
  },
});
Exercise = mongoose.model('Exercise', exerciseSchema);

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

// Function to add exercise for a user
const addExercise = async (id, description, duration, date) => {
  try {
    let user = await User.findOne({ _id: id });
    if (!user) {
      return { error: 'User does not exist' };
    } else {
      console.log(date);
      const user_id = user._id;

      const new_exercise = new Exercise({
        user_id,
        description,
        duration,
        date,
      });

      console.log(new_exercise);
      await new_exercise.save();

      return {
        username: user.username,
        description: new_exercise.description,
        duration: new_exercise.duration,
        date: new_exercise.date,
        _id: new_exercise._id,
      };
    }
  } catch (err) {
    return { error: 'Bad Request' };
  }
};

exports.UserModel = User;
exports.createUser = createUser;
exports.getAllUsers = getAllUsers;
exports.addExercise = addExercise;
