const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const supabaseUrl = 'https://jhpnqoxeldbkcbsyfcjf.supabase.co';
const supabaseKey = 'sb_publishable_F1kMH3wYOW5ySpq-HftukQ_FLEsmnEm';
const supabase = createClient(supabaseUrl, supabaseKey);
async function ejecutarSQL() {
  console.log('🔧 Agregando campos a la tabla cursos...\n');
  try {
    const campos = [
      'bloques JSONB',
      'evaluaciones JSONB',
      'contenido TEXT',
      'prerequisitos TEXT',
      'certificado_template TEXT',
      'email_reporte TEXT',
      'clave_inscripcion TEXT',
      'precio DECIMAL DEFAULT 0',
      'activo BOOLEAN DEFAULT TRUE'
    ];
    for (const campo of campos) {
      const nombreCampo = campo.split(' ')[0];
      console.log(`⏳ Agregando campo: ${nombreCampo}...`);
      const { error } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE cursos ADD COLUMN IF NOT EXISTS ${campo}`
      });
      if (error) {
        console.log(`⚠️  ${nombreCampo}: ${error.message}`);
      } else {
        console.log(`✅ ${nombreCampo} agregado`);
      }
    }
    console.log('\n✅ Campos agregados (o ya existían)\n');
    console.log('🔄 Ahora remigrando curso completo...\n');
    const cursosPath = path.join(__dirname, 'public', 'data', 'cursos-list.json');
    const cursosJSON = fs.readFileSync(cursosPath, 'utf8');
    const cursos = JSON.parse(cursosJSON);
    const curso = cursos[0];
    console.log(`📚 Curso: ${curso.titulo}\n`);
    console.log('🗑️  Eliminando versión incompleta...');
    await supabase.from('cursos').delete().eq('id', 2);
    console.log('💾 Guardando curso completo...\n');
    const { data, error } = await supabase
      .from('cursos')
      .insert({
        titulo: curso.titulo,
        descripcion: curso.descripcion,
        instructor: curso.instructor,
        categoria: curso.categoria,
        duracion_estimada: parseInt(curso.duracion) || 60,
        nivel: curso.nivel || 'Principiante',
        video_url: curso.videoUrl || null,
        imagen_portada: curso.imagen || null,
        bloques: curso.bloques ? JSON.stringify(curso.bloques) : null,
        evaluaciones: curso.evaluaciones ? JSON.stringify(curso.evaluaciones) : null,
        contenido: curso.contenido || null,
        prerequisitos: curso.prerequisitos || null,
        certificado_template: curso.certificadoTemplate || null,
        email_reporte: curso.emailReporte || null,
        clave_inscripcion: curso.claveInscripcion || null,
        precio: parseFloat(curso.precio) || 0,
        activo: true
      })
      .select()
      .single();
    if (error) {
      console.error('❌ Error:', error.message);
    } else {
      console.log('✅ Curso migrado completamente!');
      console.log('\n📋 Información guardada:');
      console.log(`   ID: ${data.id}`);
      console.log(`   Título: ${data.titulo}`);
      console.log(`   Categoría: ${data.categoria}`);
      console.log(`   Instructor: ${data.instructor}`);
      console.log(`   Video URL: ${data.video_url || 'No especificado'}`);
      console.log(`   Imagen: ${data.imagen_portada || 'No especificada'}`);
      console.log(`   Bloques: ${curso.bloques ? 'Sí' : 'No'}`);
      console.log(`   Evaluaciones: ${curso.evaluaciones ? 'Sí' : 'No'}`);
    }
    console.log('\n🎉 ¡Proceso completado!');
  } catch (error) {
    console.error('\n❌ Error general:', error.message);
  }
}
ejecutarSQL();
