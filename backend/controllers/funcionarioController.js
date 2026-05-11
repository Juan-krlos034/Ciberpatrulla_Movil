// backend/controllers/funcionarioController.js
const Funcionario = require('../models/funcionarioModel');

const getFuncionarios = async (req, res) => {
    try {
        const funcionarios = await Funcionario.find();
        res.status(200).json({ success: true, count: funcionarios.length, data: funcionarios });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getFuncionarioById = async (req, res) => {
    try {
        const funcionario = await Funcionario.findOne({ funcionario_id: req.params.id });
        if (!funcionario) {
            return res.status(404).json({ success: false, message: 'Funcionario no encontrado' });
        }
        res.status(200).json({ success: true, data: funcionario });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createFuncionario = async (req, res) => {
    try {
        const existe = await Funcionario.findOne({ identificacion: req.body.identificacion });
        if (existe) {
            return res.status(400).json({ success: false, message: 'La identificación ya existe' });
        }
        const funcionario = await Funcionario.create(req.body);
        res.status(201).json({ success: true, message: 'Funcionario creado', data: funcionario });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ success: false, errors: errores });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateFuncionario = async (req, res) => {
    try {
        const funcionario = await Funcionario.findOneAndUpdate(
            { funcionario_id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!funcionario) {
            return res.status(404).json({ success: false, message: 'Funcionario no encontrado' });
        }
        res.status(200).json({ success: true, message: 'Funcionario actualizado', data: funcionario });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteFuncionario = async (req, res) => {
    try {
        const funcionario = await Funcionario.findOneAndDelete({ funcionario_id: req.params.id });
        if (!funcionario) {
            return res.status(404).json({ success: false, message: 'Funcionario no encontrado' });
        }
        res.status(200).json({ success: true, message: 'Funcionario eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getFuncionarios, getFuncionarioById, createFuncionario, updateFuncionario, deleteFuncionario };