const express = require('express');
const router = express.Router();
const { getEstadisticas, getTopFuncionarios, getMontosPorDelito } = require('../controllers/reporteController');

router.get('/estadisticas', getEstadisticas);
router.get('/top-funcionarios', getTopFuncionarios);
router.get('/montos-por-delito', getMontosPorDelito);

module.exports = router;