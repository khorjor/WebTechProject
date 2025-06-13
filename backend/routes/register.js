const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const userFilePath = path.join(__dirname, '..', 'data', 'user.json');

router.post('/', (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  if (!username || !email || !password || !firstName || !lastName ) {
    return res.status(400).send("Missing required fields.");
  }

  fs.readFile(userFilePath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Error reading user file:', err);
      return res.status(500).send("Server error");
    }

    let users = [];
    try {
      if (data) users = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing user JSON:', parseErr);
      return res.status(500).send("Server error");
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.send("Email already registered.");
    }

    const newUser = {
      firstName,
      lastName,
      username,
      email,
      password,
    };

    users.push(newUser);

    fs.writeFile(userFilePath, JSON.stringify(users, null, 2), err => {
      if (err) {
        console.error('Error writing user file:', err);
        return res.status(500).send("Server error");
      }

      res.send("Register successfully.");
    });
  });
});

module.exports = router;