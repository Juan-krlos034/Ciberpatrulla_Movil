// backend/models/tipoDelitoModel.js
const mongoose = require('mongoose');

const tipoDelitoSchema = new mongoose.Schema({
    tipo_delito_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    descripcion: {
        type: String,
        default: ''
    },
    categoria: {
        type: String,
        enum: ['Estafa', 'Suplantación', 'Acoso', 'Otro'],
        default: 'Otro'
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Índice para búsquedas rápidas
tipoDelitoSchema.index({ tipo_delito_id: 1 });
tipoDelitoSchema.index({ nombre: 1 });

module.exports = mongoose.model('TipoDelito', tipoDelitoSchema);