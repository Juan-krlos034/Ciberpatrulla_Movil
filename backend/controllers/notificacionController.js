// controllers/notificacionController.js
const Incidente = require('../models/incidenteModel');

// Verificar incidentes con montos altos
const alertasMontosAltos = async (req, res) => {
    try {
        const { umbral = 1000000 } = req.query;
        
        const alertas = await Incidente.find({
            'afectacion_economica.monto_perdido': { $gte: parseInt(umbral) },
            estado: { $ne: 'Cerrado' }
        }).sort({ 'afectacion_economica.monto_perdido': -1 });
        
        res.json({
            success: true,
            count: alertas.length,
            data: alertas
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Resumen diario
const resumenDiario = async (req, res) => {
    try {
        const hoy = new Date().toISOString().split('T')[0];
        
        const nuevos = await Incidente.countDocuments({ fecha_incidente: hoy });
        const montoHoy = await Incidente.aggregate([
            { $match: { fecha_incidente: hoy } },
            { $group: { _id: null, total: { $sum: "$afectacion_economica.monto_perdido" } } }
        ]);
        
        res.json({
            success: true,
            data: {
                fecha: hoy,
                nuevos_incidentes: nuevos,
                monto_total_dia: montoHoy[0]?.total || 0,
                incidentes_activos: await Incidente.countDocuments({ estado: { $ne: 'Cerrado' } })
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { alertasMontosAltos, resumenDiario };