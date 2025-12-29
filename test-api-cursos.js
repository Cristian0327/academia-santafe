const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jhpnqoxeldbkcbsyfcjf.supabase.co';
const supabaseKey = 'sb_publishable_F1kMH3wYOW5ySpq-HftukQ_FLEsmnEm';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAPI() {
  console.log('🔍 Testeando consulta de cursos...\n');
  
  const { data, error } = await supabase
    .from('cursos')
    .select('id, titulo, descripcion, instructor, categoria, duracion, duracion_estimada, nivel, imagen_portada, video_url, precio, activo, created_at, clave_inscripcion')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log(`✅ Cursos encontrados: ${data.length}\n`);
  
  data.forEach(curso => {
    console.log(`ID ${curso.id}: ${curso.titulo}`);
    console.log(`   - Categoría: ${curso.categoria}`);
    console.log(`   - Instructor: ${curso.instructor}`);
    console.log(`   - Activo: ${curso.activo}`);
    console.log(`   - Imagen portada: ${curso.imagen_portada ? 'SÍ (' + curso.imagen_portada.substring(0, 50) + '...)' : 'NO'}`);
    console.log('');
  });
  
  console.log('\n📦 Objeto completo del primer curso:');
  console.log(JSON.stringify(data[0], null, 2));
}

testAPI().catch(console.error);
