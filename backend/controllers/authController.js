// backend/controllers/authController.js
const Funcionario = require('../models/funcionarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar nuevo funcionario
const register = async (req, res) => {
    try {
        const { funcionario_id, identificacion, nombre, rango, unidad, email, password, telefono } = req.body;
        
        console.log('📝 [Auth] Intento de registro para:', email);
        console.log('📝 Datos recibidos:', { funcionario_id, identificacion, nombre, rango, unidad, email, telefono });
        
        // Validar campos requeridos
        if (!funcionario_id || !identificacion || !nombre || !rango || !unidad || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Faltan campos requeridos: funcionario_id, identificacion, nombre, rango, unidad, email, password' 
            });
        }
        
        // Verificar si ya existe
        const existe = await Funcionario.findOne({ 
            $or: [{ funcionario_id }, { email }, { identificacion }] 
        });
        
        if (existe) {
            let mensaje = '';
            if (existe.funcionario_id === funcionario_id) mensaje = 'El ID de funcionario ya existe';
            else if (existe.email === email) mensaje = 'El correo electrónico ya está registrado';
            else if (existe.identificacion === identificacion) mensaje = 'La identificación ya está registrada';
            
            return res.status(400).json({ 
                success: false, 
                message: mensaje || 'El funcionario ya existe' 
            });
        }
        
        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        const nuevoFuncionario = new Funcionario({
            funcionario_id,
            identificacion,
            nombre,
            rango,
            unidad,
            email,
            telefono: telefono || '',
            password: passwordHash,
            activo: true,
            fecha_registro: new Date()
        });
        
        await nuevoFuncionario.save();
        
        console.log('✅ [Auth] Usuario registrado exitosamente:', email);
        
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
        console.error('❌ [Auth] Error en registro:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

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
        
        console.log('🔑 [Auth] Intento de login para:', email);
        
        // Buscar funcionario (incluyendo password)
        const funcionario = await Funcionario.findOne({ email }).select('+password');
        
        if (!funcionario) {
            console.log('❌ [Auth] Usuario no encontrado:', email);
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciales inválidas' 
            });
        }
        
        // Verificar contraseña
        const passwordValida = await bcrypt.compare(password, funcionario.password);
        
        if (!passwordValida) {
            console.log('❌ [Auth] Contraseña incorrecta para:', email);
            return res.status(401).json({ 
                success: false, 
                message: 'Credenciales inválidas' 
            });
        }
        
        // Actualizar último acceso
        await Funcionario.updateOne(
            { email },
            { ultimo_acceso: new Date() }
        );
        
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
        
        console.log('✅ [Auth] Login exitoso para:', email);
        
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
                    rol: funcionario.rol,
                    foto_url: funcionario.foto_url || ''
                }
            }
        });
    } catch (error) {
        console.error('❌ [Auth] Error en login:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { login, register };