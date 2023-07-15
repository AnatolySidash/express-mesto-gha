const userRouter = require('express').Router();
const { getUsers, getUserById, createUser, updateUserInfo, changeAvatar } = require('../controllers/users');

userRouter.get('/users', getUsers);

userRouter.get('/users/:id', getUserById);

userRouter.post('/users', createUser);

userRouter.patch('/users/me', updateUserInfo);

userRouter.patch('/users/me/avatar', changeAvatar);

module.exports = userRouter;
