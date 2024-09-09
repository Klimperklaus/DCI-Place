const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


// GET alle Benutzer

router.get('/', userController.getUsers);

// GET Profil

router.get('/profile', userController.getProfile);

// POST Registrieren

router.post('/register', userController.register);

// POST Login

router.post('/login', userController.login);

// DELETE Benutzer

router.delete('/:id', userController.deleteUser);

// PUT Benutzer bearbeiten

router.put('/:id', userController.editUser);

// PUT Password ändern

router.put('/changePassword/:id', userController.changePassword);

module.exports = router;