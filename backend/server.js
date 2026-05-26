const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ SERVIR ARCHIVOS ESTÁTICOS ============

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Carpeta uploads creada en:', uploadDir);
}

// Conexión a MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/Ciberpatrulla_DB';
mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB conectado exitosamente'))
    .catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Rutas
const funcionarioRoutes = require('./routes/funcionarioRoutes');
const incidenteRoutes = require('./routes/incidenteRoutes');
const authRoutes = require('./routes/authRoutes');
const tipoDelitoRoutes = require('./routes/tipoDelitoRoutes');
const evidenciasRoutes = require('./routes/evidencias');

app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/incidentes', incidenteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tipos_delito', tipoDelitoRoutes);
app.use('/api/upload', evidenciasRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Servidor CIBERPATRULLA corriendo',
        timestamp: new Date().toISOString()
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor CIBERPATRULLA corriendo en http://localhost:${PORT}`);
    console.log(`📋 Documentación disponible en http://localhost:${PORT}/api/health`);
    console.log(`📁 Archivos estáticos servidos desde: /uploads`);
});