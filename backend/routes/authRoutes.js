const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para registrar nuevo funcionario
router.post('/register', register);

module.exports = router;