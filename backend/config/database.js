// backend/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ [MongoDB] Conectado exitosamente a MongoDB Compass');
        console.log(`📁 [MongoDB] Base de datos: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('❌ [MongoDB] Error de conexión:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;