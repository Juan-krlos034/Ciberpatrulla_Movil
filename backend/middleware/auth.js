const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Acceso denegado. Token no proporcionado' 
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_temporal');
        req.funcionario = decoded;
        next();
    } catch (error) {
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