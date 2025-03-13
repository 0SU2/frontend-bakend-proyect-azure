import express from 'express';
import UserController from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleWare from '../middlewares/roleMiddleware.js';

const router = express.Router();
const userController = new UserController();

const userRouters = [
  {
    method: 'get',
    path: '/',
    middleware: [ authMiddleware ],
    handler: 'getAll'
  },
  {
    method: 'post',
    path: '/create',
    // middleware: [ authMiddleware, roleMiddleWare('admin', 'soporte')],
    handler: 'create'
  },
  {
    method: 'put',
    path: '/update/:id',
    // middleware: [ authMiddleware, roleMiddleWare('admin', 'soporte')],
    handler: 'update'
  },
  {
    method: 'delete',
    path: '/delete/:id',
    middleware: [ authMiddleware, roleMiddleWare('admin', 'soporte')],
    handler: 'delete'
  },
  {
    method: 'post',
    path: '/login',
    // middleware: [ authMiddleware, roleMiddleWare('admin', 'soporte')],
    handler: 'login'
  },
  {
    method: 'post',
    path: '/logout',
    middleware: [ authMiddleware],
    handler: 'logout'
  },
  {
    method: 'post',
    path: '/unlock:id',
    // middleware: [ authMiddleware, roleMiddleWare('admin', 'soport')],
    handler: 'unlockUser'
  },
  {
    method: 'get',
    path: '/user',
    middleware: [ authMiddleware ],
    handler: 'getUserByUsername'
  },
]

userRouters.forEach((route) => {
  router[route.method](
    route.path,
    ...(route.middleware || []),
    userController[route.handler].bind(userController)
  )
})

export default router
