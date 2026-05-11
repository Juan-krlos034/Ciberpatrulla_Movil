// backend/routes/incidenteRoutes.js
const express = require('express');
const router = express.Router();
const {
    getIncidentes,
    getIncidenteById,
    createIncidente,
    updateIncidente,
    deleteIncidente,
    getIncidentesByFuncionario,
    getIncidentesByTipoDelito,
    getEstadisticas
} = require('../controllers/incidenteController');
const { verificarToken } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Rutas principales
router.get('/', getIncidentes);
router.get('/estadisticas', getEstadisticas);
router.get('/:id', getIncidenteById);
router.post('/', createIncidente);
router.put('/:id', updateIncidente);
router.delete('/:id', deleteIncidente);

// Rutas específicas (después de las genéricas)
router.get('/funcionario/:funcionario_id', getIncidentesByFuncionario);
router.get('/tipo/:tipo_id', getIncidentesByTipoDelito);

module.exports = router;