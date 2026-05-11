// controllers/exportController.js
const Incidente = require('../models/incidenteModel');
const ExcelJS = require('exceljs');

// Exportar a Excel
const exportarExcel = async (req, res) => {
    try {
        const incidentes = await Incidente.find();
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Incidentes CIBERPATRULLA');
        
        // Definir columnas
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 15 },
            { header: 'Tipo de Delito', key: 'tipo', width: 25 },
            { header: 'Víctima', key: 'victima', width: 30 },
            { header: 'Monto Perdido', key: 'monto', width: 15 },
            { header: 'Fecha', key: 'fecha', width: 15 },
            { header: 'Estado', key: 'estado', width: 20 }
        ];
        
        // Agregar datos
        incidentes.forEach(inc => {
            worksheet.addRow({
                id: inc.incidente_id,
                tipo: inc.tipo_delito,
                victima: inc.victima?.nombre || 'N/A',
                monto: inc.afectacion_economica?.monto_perdido || 0,
                fecha: inc.fecha_incidente,
                estado: inc.estado
            });
        });
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=incidentes.xlsx');
        
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { exportarExcel };