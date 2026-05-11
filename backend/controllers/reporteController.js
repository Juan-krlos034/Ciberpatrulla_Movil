// controllers/reporteController.js
const Incidente = require('../models/incidenteModel');

// Estadísticas generales
const getEstadisticas = async (req, res) => {
    try {
        const total = await Incidente.countDocuments();
        const abiertos = await Incidente.countDocuments({ estado: 'Abierto' });
        const investigacion = await Incidente.countDocuments({ estado: 'En investigación' });
        const cerrados = await Incidente.countDocuments({ estado: 'Cerrado' });
        
        // Monto total perdido
        const montoTotal = await Incidente.aggregate([
            { $group: { _id: null, total: { $sum: "$afectacion_economica.monto_perdido" } } }
        ]);
        
        // Top 5 tipos de delito
        const topDelitos = await Incidente.aggregate([
            { $group: { _id: "$tipo_delito", cantidad: { $sum: 1 } } },
            { $sort: { cantidad: -1 } },
            { $limit: 5 }
        ]);
        
        // Incidentes por mes (últimos 6 meses)
        const porMes = await Incidente.aggregate([
            { $group: { 
                _id: { $substr: ["$fecha_incidente", 0, 7] },
                cantidad: { $sum: 1 },
                monto: { $sum: "$afectacion_economica.monto_perdido" }
            }},
            { $sort: { _id: -1 } },
            { $limit: 6 }
        ]);
        
        res.json({
            success: true,
            data: {
                total,
                abiertos,
                investigacion,
                cerrados,
                montoTotal: montoTotal[0]?.total || 0,
                topDelitos,
                porMes
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Reporte de funcionarios con más casos
const getTopFuncionarios = async (req, res) => {
    try {
        const top = await Incidente.aggregate([
            { $group: { _id: "$funcionario_id", casos: { $sum: 1 } } },
            { $sort: { casos: -1 } },
            { $limit: 5 }
        ]);
        res.json({ success: true, data: top });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Reporte de montos por tipo de delito
const getMontosPorDelito = async (req, res) => {
    try {
        const reporte = await Incidente.aggregate([
            { $group: { 
                _id: "$tipo_delito", 
                totalCasos: { $sum: 1 },
                totalPerdido: { $sum: "$afectacion_economica.monto_perdido" },
                promedioPerdido: { $avg: "$afectacion_economica.monto_perdido" }
            }},
            { $sort: { totalPerdido: -1 } }
        ]);
        res.json({ success: true, data: reporte });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getEstadisticas, getTopFuncionarios, getMontosPorDelito };