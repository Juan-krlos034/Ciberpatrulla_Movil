// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // Buscar token en diferentes lugares
    const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('🔍 [Middleware] Headers recibidos:', {
        'x-auth-token': req.header('x-auth-token') ? 'SÍ' : 'NO',
        'Authorization': req.header('Authorization') ? 'SÍ' : 'NO'
    });
    
    if (!token) {
        console.log('❌ [Middleware] No se encontró token');
        return res.status(401).json({ 
            success: false, 
            message: 'Acceso denegado. Token no proporcionado' 
        });
    }
    
    try {
        const secret = process.env.JWT_SECRET || 'secret_temporal';
        console.log('🔍 [Middleware] Verificando token...');
        
        const decoded = jwt.verify(token, secret);
        console.log('✅ [Middleware] Token válido para:', decoded.email);
        
        req.funcionario = decoded;
        next();
    } catch (error) {
        console.error('❌ [Middleware] Error:', error.message);
        res.status(401).json({ 
            success: false, 
            message: 'Token inválido o expirado' 
        });
    }
};

const verificarAdmin = (req, res, next) => {
    if (req.funcionario.rol !== 'admin') {
        return res.status(403).json({ 
            success: false, 
            message: 'Acceso denegado. Se requieren privilegios de administrador' 
        });
    }
    next();
};

module.exports = { verificarToken, verificarAdmin };