import express from 'express';
import { getUsers, getProfile, register, login, deleteUser, editUser, changePassword } from '../controller/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();


// Öffentlich zugängliche Routen
router.post('/register', register);
router.post('/login', login);

// Geschützte Routen (nur für authentifizierte Benutzer)
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, editUser);
router.delete('/profile', authMiddleware, deleteUser);
router.put('/change-password', authMiddleware, changePassword);
router.get('/users', authMiddleware, getUsers);

export default router;