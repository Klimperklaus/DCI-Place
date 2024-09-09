import express from 'express';
import { getUsers, getProfile, register, login, deleteUser, editUser, changePassword } from '../controller/userController.js';

const router = express.Router();



// GET alle Benutzer
router.get('/', getUsers);

// GET Profil

router.get('/profile', getProfile);

// POST Registrieren

router.post('/register', register);

// POST Login

router.post('/login', login);

// DELETE Benutzer

router.delete('/:id', deleteUser);

// PUT Benutzer bearbeiten

router.put('/:id', editUser);

// PUT Password ändern

router.put('/changePassword/:id', changePassword);

export default router;