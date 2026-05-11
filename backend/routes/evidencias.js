// backend/routes/evidencias.js - Usar multer para subir archivos
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload/:incidente_id', upload.array('fotos', 5), async (req, res) => {
    const { incidente_id } = req.params;
    const archivos = req.files.map(f => f.filename);
    
    await Incidente.findOneAndUpdate(
        { incidente_id },
        { $push: { evidencias: { $each: archivos } } }
    );
    
    res.json({ success: true, archivos });
});