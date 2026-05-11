const Funcionario = require('../models/funcionarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Iniciar sesión
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email y contraseña son requeridos' 
            });
        }
        
        // Buscar funcionario (incluyendo password)
        const funcionario = await Funcionario.findOne({ email }).select('+password');
        
        if (!funcionario) {
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciales inválidas' 
            });
        }
        
        // Verificar contraseña (usar bcrypt en producción)
        const passwordValida = await bcrypt.compare(password, funcionario.password);
        
        if (!passwordValida) {
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciales inválidas' 
            });
        }
        
        // Actualizar último acceso
        funcionario.ultimo_acceso = new Date();
        await funcionario.save();
        
        // Generar token JWT
        const token = jwt.sign(
            { 
                id: funcionario.funcionario_id, 
                email: funcionario.email, 
                rol: funcionario.rol 
            },
            process.env.JWT_SECRET || 'secret_temporal',
            { expiresIn: '8h' }
        );
        
        res.json({
            success: true,
            data: {
                token,
                funcionario: {
                    funcionario_id: funcionario.funcionario_id,
                    nombre: funcionario.nombre,
                    rango: funcionario.rango,
                    unidad: funcionario.unidad,
                    email: funcionario.email,
                    rol: funcionario.rol
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Registrar nuevo funcionario (solo admin)
const register = async (req, res) => {
    try {
        const { funcionario_id, nombre, rango, unidad, email, password, telefono } = req.body;
        
        // Verificar si ya existe
        const existe = await Funcionario.findOne({ $or: [{ funcionario_id }, { email }] });
        if (existe) {
            return res.status(400).json({ 
                success: false, 
                message: 'El funcionario_id o email ya existe' 
            });
        }
        
        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        const nuevoFuncionario = new Funcionario({
            funcionario_id,
            nombre,
            rango,
            unidad,
            email,
            telefono,
            password: passwordHash
        });
        
        await nuevoFuncionario.save();
        
        res.status(201).json({
            success: true,
            message: 'Funcionario registrado exitosamente',
            data: {
                funcionario_id: nuevoFuncionario.funcionario_id,
                nombre: nuevoFuncionario.nombre,
                email: nuevoFuncionario.email
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { login, register };