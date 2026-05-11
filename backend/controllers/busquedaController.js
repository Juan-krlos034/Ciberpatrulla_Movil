// controllers/busquedaController.js
const Incidente = require('../models/incidenteModel');

// Búsqueda avanzada con múltiples criterios
const busquedaAvanzada = async (req, res) => {
    try {
        const { tipo_delito, estado, fecha_desde, fecha_hasta, monto_min, monto_max, victima } = req.query;
        
        let filtro = {};
        
        if (tipo_delito) filtro.tipo_delito = tipo_delito;
        if (estado) filtro.estado = estado;
        if (victima) filtro['victima.nombre'] = { $regex: victima, $options: 'i' };
        
        if (fecha_desde || fecha_hasta) {
            filtro.fecha_incidente = {};
            if (fecha_desde) filtro.fecha_incidente.$gte = fecha_desde;
            if (fecha_hasta) filtro.fecha_incidente.$lte = fecha_hasta;
        }
        
        if (monto_min || monto_max) {
            filtro['afectacion_economica.monto_perdido'] = {};
            if (monto_min) filtro['afectacion_economica.monto_perdido'].$gte = parseInt(monto_min);
            if (monto_max) filtro['afectacion_economica.monto_perdido'].$lte = parseInt(monto_max);
        }
        
        const incidentes = await Incidente.find(filtro).sort({ fecha_incidente: -1 });
        
        res.json({
            success: true,
            count: incidentes.length,
            data: incidentes
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Sugerencias de búsqueda (autocompletado)
const sugerencias = async (req, res) => {
    try {
        const { q } = req.query;
        
        const tipos = await Incidente.distinct('tipo_delito', { tipo_delito: { $regex: q, $options: 'i' } });
        const victimas = await Incidente.distinct('victima.nombre', { 'victima.nombre': { $regex: q, $options: 'i' } });
        
        res.json({
            success: true,
            data: {
                tipos: tipos.slice(0, 5),
                victimas: victimas.slice(0, 5)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { busquedaAvanzada, sugerencias };