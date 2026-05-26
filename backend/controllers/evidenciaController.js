// backend/controllers/evidenciaController.js
const path = require('path');
const fs = require('fs');

// Asegurar que la carpeta uploads existe
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const uploadEvidencia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No se envió ningún archivo' });
    }

    const file = req.file;
    const fileUrl = `/uploads/${file.filename}`;
    
    console.log('✅ Archivo subido:', file.filename);
    
    res.json({
      success: true,
      url: fileUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size
    });
  } catch (error) {
    console.error('❌ Error en uploadEvidencia:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadEvidencia };