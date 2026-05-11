// backend/routes/tipoDelitoRoutes.js
const express = require('express');
const router = express.Router();
const {
    getTiposDelito,
    getTipoDelitoById,
    createTipoDelito,
    updateTipoDelito,
    deleteTipoDelito
} = require('../controllers/tipoDelitoController');
const { verificarToken, verificarAdmin } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Rutas públicas (para todos los usuarios autenticados)
router.get('/', getTiposDelito);
router.get('/:id', getTipoDelitoById);

// Rutas solo para administradores
router.post('/', verificarAdmin, createTipoDelito);
router.put('/:id', verificarAdmin, updateTipoDelito);
router.delete('/:id', verificarAdmin, deleteTipoDelito);

module.exports = router;