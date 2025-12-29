const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const supabaseUrl = 'https://jhpnqoxeldbkcbsyfcjf.supabase.co';
const supabaseKey = 'sb_publishable_F1kMH3wYOW5ySpq-HftukQ_FLEsmnEm';
const supabase = createClient(supabaseUrl, supabaseKey);
async function migrarCursos() {
  console.log('🔄 Iniciando migración de cursos...\n');
  try {
    const cursosPath = path.join(__dirname, 'public', 'data', 'cursos-list.json');
    const cursosJSON = fs.readFileSync(cursosPath, 'utf8');
    const cursos = JSON.parse(cursosJSON);
    console.log(`📚 Encontrados ${cursos.length} curso(s) para migrar\n`);
    for (const curso of cursos) {
      console.log(`⏳ Migrando: ${curso.titulo}...`);
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
        })
        .select()
        .single();
      if (error) {
        console.error(`❌ Error migrando "${curso.titulo}":`, error.message);
      } else {
        console.log(`✅ Migrado exitosamente (ID: ${data.id})\n`);
      }
    }
    console.log('\n🎉 ¡Migración completada!');
    console.log('Puedes verificar en Supabase → Table Editor → cursos');
  } catch (error) {
    console.error('\n❌ Error general:', error.message);
  }
}
migrarCursos();
