const userRouter = require('express').Router();
const {
  getUsers, getCurrentUser, getUserById, updateUserInfo, changeAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);

userRouter.get('/me', getCurrentUser);

userRouter.patch('/me', updateUserInfo);

userRouter.get('/:id', getUserById);

userRouter.patch('/me/avatar', changeAvatar);

module.exports = userRouter;
