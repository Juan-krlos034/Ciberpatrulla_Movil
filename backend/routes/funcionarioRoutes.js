// backend/routes/funcionarioRoutes.js
const express = require('express');
const router = express.Router();
const {
    getFuncionarios,
    getFuncionarioById,
    createFuncionario,
    updateFuncionario,
    deleteFuncionario
} = require('../controllers/funcionarioController');

router.route('/')
    .get(getFuncionarios)
    .post(createFuncionario);

router.route('/:id')
    .get(getFuncionarioById)
    .put(updateFuncionario)
    .delete(deleteFuncionario);

module.exports = router;