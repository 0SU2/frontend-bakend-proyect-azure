import express from 'express';
import userRoutes from './userRoutes.js';
import pacienteRouter from './pacienteRoutes.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'API V1'});
});

router.use('/users', userRoutes);
router.use('/pacientes', pacienteRouter)

export default router;