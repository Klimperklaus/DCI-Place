import { Router } from 'express';
import { getUsers, getProfile, register, login, deleteUser, editUser, changePassword } from '../controller/userController.js';



// GET alle Benutzer
Router.get('/', getUsers);

// GET Profil

Router.get('/profile', getProfile);

// POST Registrieren

Router.post('/register', register);

// POST Login

Router.post('/login', login);

// DELETE Benutzer

Router.delete('/:id', deleteUser);

// PUT Benutzer bearbeiten

Router.put('/:id', editUser);

// PUT Password ändern

Router.put('/changePassword/:id', changePassword);

export default Router;