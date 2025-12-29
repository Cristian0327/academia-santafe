const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jhpnqoxeldbkcbsyfcjf.supabase.co';
const supabaseKey = 'sb_publishable_F1kMH3wYOW5ySpq-HftukQ_FLEsmnEm';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarYArreglar() {
  console.log('🔍 Verificando columnas de la tabla cursos...\n');
  
  const { data: cursos, error } = await supabase
    .from('cursos')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('❌ Error al consultar:', error.message);
    return;
  }
  
  if (cursos && cursos.length > 0) {
    const columnas = Object.keys(cursos[0]);
    console.log('📋 Columnas actuales:');
    columnas.sort().forEach(col => console.log(`   - ${col}`));
    
    console.log('\n');
    
    if (!columnas.includes('duracion')) {
      console.log('⚠️  La columna "duracion" NO existe');
      console.log('📝 Debes ejecutar este SQL en el Editor de SQL de Supabase:');
      console.log('');
      console.log('   ALTER TABLE cursos ADD COLUMN duracion TEXT;');
      console.log('');
    } else {
      console.log('✅ La columna "duracion" ya existe');
    }
    
    const columnasRequeridas = [
      'duracion',
      'duracion_estimada', 
      'clave_inscripcion',
      'video_url',
      'imagen_portada',
      'certificado_template'
    ];
    
    console.log('\n📊 Estado de columnas requeridas:');
    columnasRequeridas.forEach(col => {
      const existe = columnas.includes(col);
      console.log(`   ${existe ? '✅' : '❌'} ${col}`);
    });
  } else {
    console.log('⚠️  No hay cursos en la tabla para verificar');
  }
  
  console.log('\n🔎 Verificando curso ID 3...');
  const { data: curso3, error: error3 } = await supabase
    .from('cursos')
    .select('*')
    .eq('id', 3)
    .single();
  
  if (error3) {
    console.error('❌ Error:', error3.message);
  } else if (curso3) {
    console.log('✅ Curso 3 encontrado:', curso3.titulo);
    console.log('   - Duración estimada:', curso3.duracion_estimada);
    console.log('   - Duración (texto):', curso3.duracion || '(no existe el campo)');
    console.log('   - Clave inscripción:', curso3.clave_inscripcion || '(vacío)');
    console.log('   - Video URL:', curso3.video_url ? 'Sí' : 'No');
    console.log('   - Imagen portada:', curso3.imagen_portada ? 'Sí' : 'No');
  }
}

verificarYArreglar().catch(console.error);
