const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verificarToken } = require('../middleware/auth');
const Funcionario = require('../models/funcionarioModel');

// multer fotos de perfil
const perfilStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/perfiles/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const funcionarioId = req.funcionario?.id || 'user';
    const ext = path.extname(file.originalname);
    const filename = `perfil-${funcionarioId}-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const perfilUpload = multer({
  storage: perfilStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato no permitido. Solo imágenes'), false);
    }
  }
});

// Ruta subir foto de perfil
router.post('/upload-foto', verificarToken, perfilUpload.single('foto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No se envió ninguna foto' });
    }

    const fotoUrl = `http://localhost:3000/uploads/perfiles/${req.file.filename}`;
    
    // Actualizar el funcionario con la nueva foto
    const funcionario = await Funcionario.findOneAndUpdate(
      { funcionario_id: req.funcionario.id },
      { foto_url: fotoUrl },
      { new: true }
    );

    res.json({ 
      success: true, 
      url: fotoUrl,
      message: 'Foto de perfil actualizada'
    });
  } catch (error) {
    console.error('Error subiendo foto:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Ruta para obtener los datos del funcionario actualizado
router.get('/perfil', verificarToken, async (req, res) => {
  try {
    const funcionario = await Funcionario.findOne({ funcionario_id: req.funcionario.id });
    res.json({ success: true, data: funcionario });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


module.exports = router;