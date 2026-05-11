const mongoose = require('mongoose');

const victimaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    identificacion: { type: String, required: true },
    telefono: { type: String },
    correo: { type: String },
    direccion: { type: String }
});

const afectacionEconomicaSchema = new mongoose.Schema({
    monto_perdido: { type: Number, default: 0 },
    moneda: { type: String, default: 'COP' },
    entidad_afectada: { type: String }
});

const incidenteSchema = new mongoose.Schema({
    incidente_id: {
        type: String,
        required: true,
        unique: true
    },
    funcionario_id: {
        type: String,
        ref: 'Funcionario',
        required: true
    },
    tipo_delito_id: {
        type: String,
        ref: 'TipoDelito',
        required: true
    },
    fecha_incidente: {
        type: Date,
        required: true
    },
    hora_incidente: {
        type: String
    },
    descripcion: {
        type: String,
        required: true
    },
    victima: victimaSchema,
    afectacion_economica: afectacionEconomicaSchema,
    evidencias_url: [String],
    estado: {
        type: String,
        enum: ['Abierto', 'En investigación', 'Cerrado'],
        default: 'Abierto'
    },
    sincronizado: {
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

// Índices para búsquedas frecuentes
incidenteSchema.index({ funcionario_id: 1 });
incidenteSchema.index({ tipo_delito_id: 1 });
incidenteSchema.index({ fecha_incidente: 1 });
incidenteSchema.index({ estado: 1 });
incidenteSchema.index({ 'victima.identificacion': 1 });

module.exports = mongoose.model('Incidente', incidenteSchema);