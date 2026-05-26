const mongoose = require('mongoose');

const funcionarioSchema = new mongoose.Schema({
    funcionario_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    identificacion: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    rango: {
        type: String,
        required: true,
        enum: ['Patrullero', 'Intendente', 'Subintendente', 'Oficial']
    },
    unidad: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    telefono: {
        type: String,
        default: ''
    },
    // Foto de perfil
    foto_url: {
        type: String,
        default: ''
    },
    rol: {
        type: String,
        enum: ['usuario', 'admin'],
        default: 'usuario'
    },
    activo: {
        type: Boolean,
        default: true
    },
    ultimo_acceso: {
        type: Date,
        default: null
    },
    fecha_registro: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Índices
funcionarioSchema.index({ funcionario_id: 1 });
funcionarioSchema.index({ email: 1 });

module.exports = mongoose.model('Funcionario', funcionarioSchema);