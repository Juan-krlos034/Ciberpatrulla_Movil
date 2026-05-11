// controllers/evidenciaController.js
const Incidente = require('../models/incidenteModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar almacenamiento de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, unique + path.extname(file.originalname));
    }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Subir evidencia a un incidente
const subirEvidencia = async (req, res) => {
    try {
        const { incidente_id } = req.params;
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No se recibió ningún archivo' });
        }
        
        const incidente = await Incidente.findOne({ incidente_id });
        if (!incidente) {
            return res.status(404).json({ success: false, message: 'Incidente no encontrado' });
        }
        
        const url = `/uploads/${req.file.filename}`;
        incidente.evidencias.push(url);
        await incidente.save();
        
        res.json({
            success: true,
            message: 'Evidencia subida exitosamente',
            url
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Obtener todas las evidencias de un incidente
const getEvidencias = async (req, res) => {
    try {
        const incidente = await Incidente.findOne({ incidente_id: req.params.incidente_id });
        if (!incidente) {
            return res.status(404).json({ success: false, message: 'Incidente no encontrado' });
        }
        
        res.json({
            success: true,
            data: incidente.evidencias
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { subirEvidencia, getEvidencias, upload };