const userRouter = require('express').Router();
const {
  getUsers, getUserById, updateUserInfo, changeAvatar,
} = require('../controllers/users');

userRouter.get('/users', getUsers);

userRouter.get('/users/:id', getUserById);

userRouter.patch('/users/me', updateUserInfo);

userRouter.patch('/users/me/avatar', changeAvatar);

module.exports = userRouter;
