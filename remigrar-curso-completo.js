const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const supabaseUrl = 'https://jhpnqoxeldbkcbsyfcjf.supabase.co';
const supabaseKey = 'sb_publishable_F1kMH3wYOW5ySpq-HftukQ_FLEsmnEm';
const supabase = createClient(supabaseUrl, supabaseKey);
async function remigrarCurso() {
  console.log('🔄 Remigrando curso completo...\n');
  try {
    const cursosPath = path.join(__dirname, 'public', 'data', 'cursos-list.json');
    const cursosJSON = fs.readFileSync(cursosPath, 'utf8');
    const cursos = JSON.parse(cursosJSON);
    const curso = cursos[0];
    console.log(`📚 Curso: ${curso.titulo}\n`);
    console.log('🗑️  Eliminando versión anterior...');
    await supabase.from('cursos').delete().eq('id', 2);
    console.log('✅ Eliminado\n');
    console.log('💾 Guardando curso completo...\n');
    const cursoData = {
      titulo: curso.titulo,
      descripcion: curso.descripcion,
      instructor: curso.instructor,
      categoria: curso.categoria,
      duracion_estimada: parseInt(curso.duracion) || parseInt(curso.duracionEstimada) || 60,
      nivel: curso.nivel || 'Principiante',
      video_url: curso.videoUrl || curso.video_url || null,
      imagen_portada: curso.imagen || curso.imagen_portada || null,
      bloques: curso.bloques || null,
      evaluaciones: curso.evaluaciones || null,
      contenido: curso.contenido || null,
      prerequisitos: curso.prerequisitos || curso.prerequisitos || null,
      certificado_template: curso.certificadoTemplate || curso.certificado_template || null,
      email_reporte: curso.emailReporte || curso.email_reporte || null,
      clave_inscripcion: curso.claveInscripcion || curso.clave_inscripcion || null,
      precio: parseFloat(curso.precio) || 0,
      activo: true
    };
    console.log('📋 Datos a guardar:');
    Object.keys(cursoData).forEach(key => {
      const value = cursoData[key];
      if (value && typeof value === 'object') {
        console.log(`   ${key}: [Objeto con ${Object.keys(value).length} propiedades]`);
      } else {
        console.log(`   ${key}: ${value || 'null'}`);
      }
    });
    console.log('');
    const { data, error } = await supabase
      .from('cursos')
      .insert(cursoData)
      .select()
      .single();
    if (error) {
      console.error('❌ Error:', error.message);
      console.error('Detalles:', error);
    } else {
      console.log('✅ ¡Curso migrado completamente!\n');
      console.log(`   ID: ${data.id}`);
      console.log(`   Título: ${data.titulo}`);
      console.log(`   Categoría: ${data.categoria}`);
      console.log(`   Video: ${data.video_url ? '✅' : '❌'}`);
      console.log(`   Imagen: ${data.imagen_portada ? '✅' : '❌'}`);
      console.log(`   Bloques: ${data.bloques ? '✅' : '❌'}`);
      console.log(`   Evaluaciones: ${data.evaluaciones ? '✅' : '❌'}`);
    }
    console.log('\n🎉 ¡Listo! Recarga http://localhost:3000/cursos para verlo');
  } catch (error) {
    console.error('\n❌ Error general:', error.message);
    console.error(error);
  }
}
remigrarCurso();
