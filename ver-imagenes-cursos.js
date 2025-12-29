const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jhpnqoxeldbkcbsyfcjf.supabase.co';
const supabaseKey = 'sb_publishable_F1kMH3wYOW5ySpq-HftukQ_FLEsmnEm';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verImagenes() {
  console.log('🔍 Verificando imágenes de cursos...\n');
  
  const { data: cursos, error } = await supabase
    .from('cursos')
    .select('id, titulo, imagen_portada')
    .order('id');
  
  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }
  
  if (cursos && cursos.length > 0) {
    console.log(`📊 Total de cursos: ${cursos.length}\n`);
    
    cursos.forEach(curso => {
      const tieneImagen = curso.imagen_portada && curso.imagen_portada.length > 0;
      const iconoEstado = tieneImagen ? '✅' : '❌';
      const longitudImagen = tieneImagen ? `(${curso.imagen_portada.substring(0, 50)}...)` : '(vacío)';
      
      console.log(`${iconoEstado} ID ${curso.id}: ${curso.titulo}`);
      console.log(`   Imagen: ${longitudImagen}\n`);
    });
    
    const conImagen = cursos.filter(c => c.imagen_portada && c.imagen_portada.length > 0).length;
    const sinImagen = cursos.length - conImagen;
    
    console.log(`\n📈 Resumen:`);
    console.log(`   ✅ Con imagen: ${conImagen}`);
    console.log(`   ❌ Sin imagen: ${sinImagen}`);
  } else {
    console.log('⚠️  No hay cursos en la base de datos');
  }
}

verImagenes().catch(console.error);
