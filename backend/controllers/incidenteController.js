// backend/controllers/incidenteController.js
const Incidente = require('../models/incidenteModel');

// ============ OBTENER TODOS LOS INCIDENTES ============
const getIncidentes = async (req, res) => {
  try {
    const { limite = 50, pagina = 1, estado, tipo_delito } = req.query;
    
    let filtro = {};
    if (estado) filtro.estado = estado;
    if (tipo_delito) filtro.tipo_delito_id = tipo_delito;
    
    const incidentes = await Incidente.find(filtro)
      .skip((pagina - 1) * limite)
      .limit(parseInt(limite))
      .sort({ fecha_incidente: -1 });
      
    const total = await Incidente.countDocuments(filtro);
    
    res.json({
      success: true,
      data: incidentes,
      paginacion: {
        total,
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        total_paginas: Math.ceil(total / limite)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ OBTENER INCIDENTE POR ID (CORREGIDO) ============
const getIncidenteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🔍 Buscando incidente con ID: ${id}`);
    
    // 🔥 IMPORTANTE: Buscar por incidente_id, NO por _id
    const incidente = await Incidente.findOne({ incidente_id: id });
    
    if (!incidente) {
      return res.status(404).json({ 
        success: false, 
        message: `Incidente con ID ${id} no encontrado` 
      });
    }
    
    res.json({ success: true, data: incidente });
  } catch (error) {
    console.error('Error en getIncidenteById:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ CREAR INCIDENTE ============
const createIncidente = async (req, res) => {
  try {
    const { incidente_id, funcionario_id, tipo_delito_id, fecha_incidente, descripcion } = req.body;
    
    // Validar campos requeridos
    if (!incidente_id || !funcionario_id || !tipo_delito_id || !fecha_incidente || !descripcion) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan campos requeridos' 
      });
    }
    
    // Verificar si ya existe
    const existe = await Incidente.findOne({ incidente_id });
    if (existe) {
      return res.status(400).json({ success: false, message: 'El incidente_id ya existe' });
    }
    
    const nuevoIncidente = new Incidente(req.body);
    await nuevoIncidente.save();
    
    res.status(201).json({ success: true, data: nuevoIncidente });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ ACTUALIZAR INCIDENTE (CORREGIDO) ============
const updateIncidente = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, descripcion, afectacion_economica, sincronizado } = req.body;
    
    console.log(`📝 Actualizando incidente ${id} con estado: ${estado}`);
    
    // 🔥 IMPORTANTE: Buscar y actualizar por incidente_id
    const incidente = await Incidente.findOneAndUpdate(
      { incidente_id: id },
      { 
        estado, 
        descripcion, 
        afectacion_economica,
        sincronizado: sincronizado !== undefined ? sincronizado : true,
        fecha_ultima_modificacion: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!incidente) {
      return res.status(404).json({ 
        success: false, 
        message: `Incidente con ID ${id} no encontrado` 
      });
    }
    
    res.json({ success: true, data: incidente });
  } catch (error) {
    console.error('Error en updateIncidente:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ ELIMINAR INCIDENTE ============
const deleteIncidente = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🗑️ Eliminando incidente con ID: ${id}`);
    
    const incidente = await Incidente.findOneAndDelete({ incidente_id: id });
    
    if (!incidente) {
      return res.status(404).json({ 
        success: false, 
        message: `Incidente con ID ${id} no encontrado` 
      });
    }
    
    res.json({ success: true, message: 'Incidente eliminado correctamente' });
  } catch (error) {
    console.error('Error en deleteIncidente:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ INCIDENTES POR FUNCIONARIO ============
const getIncidentesByFuncionario = async (req, res) => {
  try {
    const { funcionario_id } = req.params;
    const incidentes = await Incidente.find({ funcionario_id })
      .sort({ fecha_incidente: -1 });
      
    res.json({ success: true, total: incidentes.length, data: incidentes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ INCIDENTES POR TIPO DE DELITO ============
const getIncidentesByTipoDelito = async (req, res) => {
  try {
    const { tipo_id } = req.params;
    const incidentes = await Incidente.find({ tipo_delito_id: tipo_id })
      .sort({ fecha_incidente: -1 });
      
    res.json({ success: true, total: incidentes.length, data: incidentes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============ ESTADÍSTICAS ============
const getEstadisticas = async (req, res) => {
  try {
    const total = await Incidente.countDocuments();
    const porEstado = await Incidente.aggregate([
      { $group: { _id: "$estado", count: { $sum: 1 } } }
    ]);
    
    const porTipo = await Incidente.aggregate([
      { $group: { _id: "$tipo_delito_id", count: { $sum: 1 } } }
    ]);
    
    const montoTotal = await Incidente.aggregate([
      { $group: { _id: null, total: { $sum: "$afectacion_economica.monto_perdido" } } }
    ]);
    
    res.json({
      success: true,
      data: {
        total_incidentes: total,
        por_estado: porEstado,
        por_tipo_delito: porTipo,
        monto_total_perdido: montoTotal[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getIncidentes,
  getIncidenteById,
  createIncidente,
  updateIncidente,
  deleteIncidente,
  getIncidentesByFuncionario,
  getIncidentesByTipoDelito,
  getEstadisticas
};