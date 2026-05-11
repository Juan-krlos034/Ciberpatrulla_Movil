// backend/controllers/tipoDelitoController.js
const TipoDelito = require('../models/tipoDelitoModel');

// Obtener todos los tipos de delito
const getTiposDelito = async (req, res) => {
    try {
        const tiposDelito = await TipoDelito.find({ activo: true });
        
        res.json({
            success: true,
            data: tiposDelito
        });
    } catch (error) {
        console.error('Error en getTiposDelito:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Obtener tipo de delito por ID
const getTipoDelitoById = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoDelito = await TipoDelito.findOne({ 
            $or: [
                { tipo_delito_id: id },
                { _id: id }
            ]
        });
        
        if (!tipoDelito) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de delito no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: tipoDelito
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Crear nuevo tipo de delito (solo admin)
const createTipoDelito = async (req, res) => {
    try {
        const { tipo_delito_id, nombre, descripcion, categoria } = req.body;
        
        // Validar campos requeridos
        if (!tipo_delito_id || !nombre) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos: tipo_delito_id, nombre'
            });
        }
        
        // Verificar si ya existe
        const existe = await TipoDelito.findOne({ 
            $or: [{ tipo_delito_id }, { nombre }] 
        });
        
        if (existe) {
            return res.status(400).json({
                success: false,
                message: 'El tipo de delito ya existe'
            });
        }
        
        const nuevoTipo = new TipoDelito(req.body);
        await nuevoTipo.save();
        
        res.status(201).json({
            success: true,
            data: nuevoTipo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Actualizar tipo de delito (solo admin)
const updateTipoDelito = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, categoria, activo } = req.body;
        
        const tipoDelito = await TipoDelito.findOneAndUpdate(
            { tipo_delito_id: id },
            { nombre, descripcion, categoria, activo },
            { new: true, runValidators: true }
        );
        
        if (!tipoDelito) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de delito no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: tipoDelito
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Eliminar tipo de delito (solo admin)
const deleteTipoDelito = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoDelito = await TipoDelito.findOneAndDelete({ tipo_delito_id: id });
        
        if (!tipoDelito) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de delito no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Tipo de delito eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getTiposDelito,
    getTipoDelitoById,
    createTipoDelito,
    updateTipoDelito,
    deleteTipoDelito
};