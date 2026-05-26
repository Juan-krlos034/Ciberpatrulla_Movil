// backend/exportar-datos.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Ciberpatrulla_DB';

const Funcionario = require('./models/funcionarioModel');
const Incidente = require('./models/incidenteModel');
const TipoDelito = require('./models/tipoDelitoModel');

const exportarDatos = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    const backupDir = path.join(__dirname, '../database_backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Exportar funcionarios
    const funcionarios = await Funcionario.find({});
    fs.writeFileSync(
      path.join(backupDir, 'funcionarios.json'),
      JSON.stringify(funcionarios, null, 2)
    );
    console.log(`✅ Exportados ${funcionarios.length} funcionarios`);

    // Exportar tipos de delito
    const tiposDelito = await TipoDelito.find({});
    fs.writeFileSync(
      path.join(backupDir, 'tipos_delito.json'),
      JSON.stringify(tiposDelito, null, 2)
    );
    console.log(`✅ Exportados ${tiposDelito.length} tipos de delito`);

    // Exportar incidentes
    const incidentes = await Incidente.find({});
    fs.writeFileSync(
      path.join(backupDir, 'incidentes.json'),
      JSON.stringify(incidentes, null, 2)
    );
    console.log(`✅ Exportados ${incidentes.length} incidentes`);

    console.log('\n🎉 EXPORTACIÓN COMPLETADA');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

exportarDatos();