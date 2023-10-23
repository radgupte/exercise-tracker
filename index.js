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
const getAllUsers = require('./myApp.js').getAllUsers;
app.post('/api/users', async (req, res) => {
  const username = req.body.username;
  let new_user = createUser(username);

  new_user.then(function (new_user) {
    res.send(new_user);
  });
});

// Route to get all users
app.get('/api/users', async (req, res) => {
  const all_users = getAllUsers();
  all_users.then(function (all_users) {
    // console.log(allUsers);
    res.send(all_users);
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
