const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const userFilePath = path.join(__dirname, '..', 'data', 'user.json');

router.post('/', (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: "Missing identifier or password." });
  }

  let users = [];
  try {
    const data = fs.readFileSync(userFilePath, 'utf8');
    users = JSON.parse(data);
  } catch (err) {
    console.error('Error reading user file:', err);
    return res.status(500).json({ message: "Server error reading user data." });
  }

  const user = users.find(u => u.email === identifier || u.username === identifier);

  if (!user) {
    return res.status(400).json({ message: "User not found with provided username/email." });
  }

  if (user.password !== password) {
    return res.status(400).json({ message: "Incorrect password." });
  }

  return res.json({ message: "Login successfully. Welcome!", username: user.username });

});

module.exports = router;