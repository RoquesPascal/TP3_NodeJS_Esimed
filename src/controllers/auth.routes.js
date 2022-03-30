const express = require('express');
const router = express.Router();
const userRepository = require('../models/user-repository');
const { passwordsAreEqual } = require('../security/crypto');
const { generateAuthToken } = require('../security/auth');
const {body, validationResult} = require("express-validator");

router.post('/login', body('firstName').isString(), body('password').isLength({min : 1}), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, password } = req.body;

  const user = userRepository.getUserByFirstName(firstName);
  if (!user || !passwordsAreEqual(password, user.password)) {
    res.status(401).send('Unauthorized');

    return;
  }

  const token = generateAuthToken(user.id, user.firstName, user.roles);

  res.json({ token });
});

exports.initializeRoutes = () => router;
