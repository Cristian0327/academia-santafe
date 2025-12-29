const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jhpnqoxeldbkcbsyfcjf.supabase.co';
const supabaseKey = 'sb_publishable_F1kMH3wYOW5ySpq-HftukQ_FLEsmnEm';

const supabase = createClient(supabaseUrl, supabaseKey);

// Imagen de placeholder simple (100x100 azul)
const imagenPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iIzE5MzRhOCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q3Vyc28gZGUgUHJ1ZWJhPC90ZXh0Pjwvc3ZnPg==';

async function agregarImagenes() {
  console.log('🖼️  Agregando imágenes a cursos sin imagen...\n');
  
  // Obtener cursos sin imagen
  const { data: cursosSinImagen, error } = await supabase
    .from('cursos')
    .select('id, titulo')
    .or('imagen_portada.is.null,imagen_portada.eq.');
  
  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }
  
  if (!cursosSinImagen || cursosSinImagen.length === 0) {
    console.log('✅ Todos los cursos ya tienen imagen');
    return;
  }
  
  console.log(`📝 Encontrados ${cursosSinImagen.length} cursos sin imagen\n`);
  
  for (const curso of cursosSinImagen) {
    console.log(`Actualizando curso ${curso.id}: ${curso.titulo}...`);
    
    const { error: updateError } = await supabase
      .from('cursos')
      .update({ imagen_portada: imagenPlaceholder })
      .eq('id', curso.id);
    
    if (updateError) {
      console.log(`   ❌ Error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Imagen agregada\n`);
    }
  }
  
  console.log('\n✅ Proceso completado');
}

agregarImagenes().catch(console.error);
