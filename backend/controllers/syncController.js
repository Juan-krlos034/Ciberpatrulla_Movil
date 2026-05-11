// controllers/syncController.js
const Incidente = require('../models/incidenteModel');

// Sincronizar múltiples incidentes (para modo offline)
const sincronizarOffline = async (req, res) => {
    try {
        const { incidentes, funcionario_id } = req.body;
        
        if (!incidentes || !Array.isArray(incidentes)) {
            return res.status(400).json({ success: false, message: 'Datos inválidos' });
        }
        
        const resultados = [];
        
        for (const inc of incidentes) {
            try {
                const existe = await Incidente.findOne({ incidente_id: inc.incidente_id });
                if (existe) {
                    await Incidente.findOneAndUpdate({ incidente_id: inc.incidente_id }, inc);
                    resultados.push({ id: inc.incidente_id, status: 'actualizado' });
                } else {
                    await Incidente.create(inc);
                    resultados.push({ id: inc.incidente_id, status: 'creado' });
                }
            } catch (error) {
                resultados.push({ id: inc.incidente_id, status: 'error', error: error.message });
            }
        }
        
        res.json({
            success: true,
            message: `Sincronizados ${resultados.length} incidentes`,
            resultados
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Obtener incidentes actualizados desde una fecha
const getActualizados = async (req, res) => {
    try {
        const { desde } = req.query;
        
        let filtro = {};
        if (desde) {
            filtro.updatedAt = { $gte: new Date(desde) };
        }
        
        const incidentes = await Incidente.find(filtro);
        res.json({ success: true, data: incidentes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { sincronizarOffline, getActualizados };