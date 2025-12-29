import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json({ limit: '50mb' }));
const cursosDir = path.join(__dirname, '../public/data/cursos');
const inscripcionesDir = path.join(__dirname, '../public/data/inscripciones');
if (!fs.existsSync(cursosDir)) {
  fs.mkdirSync(cursosDir, { recursive: true });
}
if (!fs.existsSync(inscripcionesDir)) {
  fs.mkdirSync(inscripcionesDir, { recursive: true });
}
app.get('/api/cursos', (req, res) => {
  try {
    const archivos = fs.readdirSync(cursosDir).filter(f => f.endsWith('.json'));
    const cursos = archivos.map(archivo => {
      const contenido = fs.readFileSync(path.join(cursosDir, archivo), 'utf-8');
      return JSON.parse(contenido);
    });
    res.json(cursos);
  } catch (error) {
    console.error('Error al listar cursos:', error);
    res.status(500).json({ error: 'Error al listar cursos' });
  }
});
app.get('/api/cursos/:id', (req, res) => {
  try {
    const archivo = path.join(cursosDir, `${req.params.id}.json`);
    if (fs.existsSync(archivo)) {
      const curso = JSON.parse(fs.readFileSync(archivo, 'utf-8'));
      res.json(curso);
    } else {
      res.status(404).json({ error: 'Curso no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener curso:', error);
    res.status(500).json({ error: 'Error al obtener curso' });
  }
});
app.post('/api/cursos', (req, res) => {
  try {
    const curso = req.body;
    if (!curso.titulo) {
      return res.status(400).json({ error: 'El título es obligatorio' });
    }
    if (!curso.id) {
      curso.id = Date.now().toString();
      curso.createdAt = new Date().toISOString();
    }
    curso.fechacreacion = curso.fechacreacion || curso.createdAt || new Date().toISOString();
    curso.actualizado = new Date().toISOString();
    const archivo = path.join(cursosDir, `${curso.id}.json`);
    fs.writeFileSync(archivo, JSON.stringify(curso, null, 2));
    const archivos = fs.readdirSync(cursosDir).filter(f => f.endsWith('.json') && f !== 'cursos-list.json');
    const cursos = archivos.map(archivo => {
      const contenido = fs.readFileSync(path.join(cursosDir, archivo), 'utf-8');
      return JSON.parse(contenido);
    });
    const listaPath = path.join(cursosDir, '../cursos-list.json');
    fs.writeFileSync(listaPath, JSON.stringify(cursos, null, 2));
    res.json({ 
      success: true, 
      mensaje: 'Curso guardado exitosamente',
      curso 
    });
  } catch (error) {
    console.error('Error al guardar curso:', error);
    res.status(500).json({ error: 'Error al guardar curso' });
  }
});
app.delete('/api/cursos/:id', (req, res) => {
  try {
    const archivo = path.join(cursosDir, `${req.params.id}.json`);
    if (fs.existsSync(archivo)) {
      fs.unlinkSync(archivo);
      const archivos = fs.readdirSync(cursosDir).filter(f => f.endsWith('.json') && f !== 'cursos-list.json');
      const cursos = archivos.map(archivo => {
        const contenido = fs.readFileSync(path.join(cursosDir, archivo), 'utf-8');
        return JSON.parse(contenido);
      });
      const listaPath = path.join(cursosDir, '../cursos-list.json');
      fs.writeFileSync(listaPath, JSON.stringify(cursos, null, 2));
      res.json({ success: true, mensaje: 'Curso eliminado' });
    } else {
      res.status(404).json({ error: 'Curso no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar curso:', error);
    res.status(500).json({ error: 'Error al eliminar curso' });
  }
});
app.post('/api/inscripciones', (req, res) => {
  try {
    const inscripcion = req.body;
    if (!inscripcion.documento || !inscripcion.cursoId) {
      return res.status(400).json({ error: 'Documento y cursoId son obligatorios' });
    }
    const nombreArchivo = `${inscripcion.documento}_${inscripcion.cursoId}.json`;
    const archivo = path.join(inscripcionesDir, nombreArchivo);
    let inscripcionExistente = {};
    if (fs.existsSync(archivo)) {
      inscripcionExistente = JSON.parse(fs.readFileSync(archivo, 'utf-8'));
    }
    const inscripcionFinal = {
      ...inscripcionExistente,
      ...inscripcion,
      fechaInscripcion: inscripcionExistente.fechaInscripcion || inscripcion.fechaInscripcion || new Date().toISOString(),
      actualizado: new Date().toISOString()
    };
    fs.writeFileSync(archivo, JSON.stringify(inscripcionFinal, null, 2));
    res.json({ 
      success: true, 
      mensaje: 'Inscripción guardada exitosamente',
      inscripcion: inscripcionFinal 
    });
  } catch (error) {
    console.error('Error al guardar inscripción:', error);
    res.status(500).json({ error: 'Error al guardar inscripción' });
  }
});
app.get('/api/inscripciones/:documento/:cursoId', (req, res) => {
  try {
    const nombreArchivo = `${req.params.documento}_${req.params.cursoId}.json`;
    const archivo = path.join(inscripcionesDir, nombreArchivo);
    if (fs.existsSync(archivo)) {
      const inscripcion = JSON.parse(fs.readFileSync(archivo, 'utf-8'));
      res.json(inscripcion);
    } else {
      res.status(404).json({ error: 'Inscripción no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener inscripción:', error);
    res.status(500).json({ error: 'Error al obtener inscripción' });
  }
});
app.get('/api/inscripciones/curso/:cursoId', (req, res) => {
  try {
    const archivos = fs.readdirSync(inscripcionesDir).filter(f => 
      f.endsWith(`_${req.params.cursoId}.json`)
    );
    const inscripciones = archivos.map(archivo => {
      const contenido = fs.readFileSync(path.join(inscripcionesDir, archivo), 'utf-8');
      return JSON.parse(contenido);
    });
    res.json(inscripciones);
  } catch (error) {
    console.error('Error al listar inscripciones del curso:', error);
    res.status(500).json({ error: 'Error al listar inscripciones' });
  }
});
app.get('/api/inscripciones', (req, res) => {
  try {
    const archivos = fs.readdirSync(inscripcionesDir).filter(f => f.endsWith('.json'));
    const inscripciones = archivos.map(archivo => {
      const contenido = fs.readFileSync(path.join(inscripcionesDir, archivo), 'utf-8');
      return JSON.parse(contenido);
    });
    res.json(inscripciones);
  } catch (error) {
    console.error('Error al listar todas las inscripciones:', error);
    res.status(500).json({ error: 'Error al listar inscripciones' });
  }
});
app.delete('/api/inscripciones/:documento/:cursoId', (req, res) => {
  try {
    const nombreArchivo = `${req.params.documento}_${req.params.cursoId}.json`;
    const archivo = path.join(inscripcionesDir, nombreArchivo);
    if (fs.existsSync(archivo)) {
      fs.unlinkSync(archivo);
      res.json({ success: true, mensaje: 'Inscripción eliminada' });
    } else {
      res.status(404).json({ error: 'Inscripción no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar inscripción:', error);
    res.status(500).json({ error: 'Error al eliminar inscripción' });
  }
});
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mensaje: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   API Academia Santafé                  ║
║   Servidor corriendo en puerto ${PORT}   ║
╚════════════════════════════════════════╝
  `);
});
