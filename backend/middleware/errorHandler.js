// middleware/errorHandler.js
/**
 * Middleware para manejar errores 404 (ruta no encontrada)
 */
const notFound = (req, res, next) => {
    const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

/**
 * Middleware para manejar errores generales
 */
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Error de Mongoose: ID inválido (CastError)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `ID inválido: ${err.value}`;
    }

    // Error de Mongoose: Duplicado (código 11000)
    if (err.code === 11000) {
        statusCode = 400;
        message = `Valor duplicado: ${JSON.stringify(err.keyValue)}`;
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = { notFound, errorHandler };