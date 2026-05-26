// backend/importar-datos.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Conectar a MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Ciberpatrulla_DB';

// Modelos
const Funcionario = require('./models/funcionarioModel');
const Incidente = require('./models/incidenteModel');
const TipoDelito = require('./models/tipoDelitoModel');

// Función para leer archivos JSON
const leerJSON = (archivo) => {
  const ruta = path.join(__dirname, '../database_backup', archivo);
  try {
    const data = fs.readFileSync(ruta, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error leyendo ${archivo}:`, error.message);
    return [];
  }
};

// Función para encriptar contraseñas si es necesario
const encriptarContraseñas = (funcionarios) => {
  return funcionarios.map(f => {
    if (f.password && !f.password.startsWith('$2a$')) {
      f.password = bcrypt.hashSync(f.password, 10);
    }
    return f;
  });
};

// Función principal de importación
async function importarDatos() {
  try {
    console.log('📡 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar colecciones existentes (opcional)
    console.log('🗑️ Limpiando colecciones existentes...');
    await Funcionario.deleteMany({});
    await TipoDelito.deleteMany({});
    await Incidente.deleteMany({});
    console.log('✅ Colecciones limpiadas');

    // Importar Tipos de Delito
    console.log('📥 Importando tipos de delito...');
    const tiposDelito = leerJSON('tipos_delito.json');
    if (tiposDelito.length > 0) {
      await TipoDelito.insertMany(tiposDelito);
      console.log(`✅ Importados ${tiposDelito.length} tipos de delito`);
    }

    // Importar Funcionarios
    console.log('📥 Importando funcionarios...');
    let funcionarios = leerJSON('funcionarios.json');
    if (funcionarios.length > 0) {
      funcionarios = encriptarContraseñas(funcionarios);
      await Funcionario.insertMany(funcionarios);
      console.log(`✅ Importados ${funcionarios.length} funcionarios`);
    }

    // Importar Incidentes
    console.log('📥 Importando incidentes...');
    const incidentes = leerJSON('incidentes.json');
    if (incidentes.length > 0) {
      await Incidente.insertMany(incidentes);
      console.log(`✅ Importados ${incidentes.length} incidentes`);
    }

    console.log('\n🎉 IMPORTACIÓN COMPLETADA EXITOSAMENTE');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en importación:', error);
    process.exit(1);
  }
}

importarDatos();