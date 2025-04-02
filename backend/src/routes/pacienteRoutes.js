import express from 'express'
import PacienteController from '../controllers/pacienteController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import roleMiddleWare from '../middlewares/roleMiddleware.js'

const router = express.Router()
const pacienteController = new PacienteController()

const pacienteRoutes = [
    {
        method: 'get',
        path: '/',
        middleware: [authMiddleware, roleMiddleWare('admin', 'secretaria')],
        handler: 'getAll'
    },
    {
        method: 'post',
        path: '/create',
        middleware: [authMiddleware, roleMiddleWare('admin', 'secretaria')],
        handler: 'create'
    },
    {
        method: 'put',
        path: '/update/:id',
        middleware: [authMiddleware, roleMiddleWare('admin', 'secretaria')],
        handler: 'update'
    },
    {
        method: 'delete',
        path: '/delete/:id',
        middleware: [authMiddleware, roleMiddleWare('admin', 'secretaria')],
        handler: 'delete'
    },
]

pacienteRoutes.forEach(route => {
    router[route.method](
        route.path, ...route.middleware, pacienteController[route.handler].bind(pacienteController))
})

export default router