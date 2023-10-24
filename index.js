const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());
// app.use(express.static('public'))
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.use(express.json());

// Route to create a new user
const createUser = require('./myApp.js').createUser;
app.post('/api/users', async (req, res) => {
  const username = req.body.username;
  let new_user = createUser(username);

  new_user.then(function (new_user) {
    res.send(new_user);
  });
});

// Route to get all users
const getAllUsers = require('./myApp.js').getAllUsers;
app.get('/api/users', async (req, res) => {
  const all_users = getAllUsers();
  all_users.then(function (all_users) {
    res.send(all_users);
  });
});

// Route to add exercise
const addExercise = require('./myApp.js').addExercise;
app.post('/api/users/:_id/exercises', async (req, res) => {
  const id = req.params._id;
  const description = req.body.description;
  const duration = Number(req.body.duration);
  var date = req.body.date;
  let new_date;

  if (typeof date === 'undefined' || date === '') {
    let now = new Date();
    let dd = String(now.getDate()).padStart(2, '0');
    let mm = String(now.getMonth() + 1).padStart(2, '0');
    let yyyy = now.getFullYear();
    dateString = yyyy + '-' + mm + '-' + dd;

    new_date = new Date(dateString);
  } else {
    new_date = new Date(req.body.date);
  }
  date = new_date
    .toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
    .replace(/,/g, '');

  const exercise_record = addExercise(id, description, duration, date);
  exercise_record.then(function (exercise_record) {
    res.send(exercise_record);
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
