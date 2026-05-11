const mongoose = require('mongoose');

const funcionarioSchema = new mongoose.Schema({
    funcionario_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
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
        lowercase: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false  // No devolver por defecto
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
    fecha_registro: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Crear índice para búsquedas rápidas
funcionarioSchema.index({ funcionario_id: 1 });
funcionarioSchema.index({ email: 1 });

module.exports = mongoose.model('Funcionario', funcionarioSchema);