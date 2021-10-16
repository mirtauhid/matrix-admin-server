const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/user');

userRouter.post('/', async (request, response, next) => {
  const { body } = request;
  const saltRounds = 10;
  if (body.password.length >= 8) {
    const passwordHash = await bcrypt.hash(body.password, saltRounds);
    const user = new User({
      username: body.username,
      email: body.email,
      passwordHash,
    });
    try {
      const savedUser = await user.save();
      if (savedUser) {
        response.json(savedUser);
      } else {
        response.status(404).end();
      }
    } catch (exception) {
      next(exception);
    }
  } else {
    response.status(400).send('Password length should be minimum 8');
  }
});

userRouter.get('/', async (request, response) => {
  const users = await User.find({});

  response.json(users);
});

module.exports = userRouter;
