const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://jhpnqoxeldbkcbsyfcjf.supabase.co',
  'sb_publishable_F1kMH3wYOW5ySpq-HftukQ_FLEsmnEm'
);
async function verificarDatos() {
  console.log('🔍 Verificando datos en Supabase...\n');
  try {
    const { data: cursos, error: errorCursos } = await supabase
      .from('cursos')
      .select('*');
    if (errorCursos) {
      console.log('❌ Error al consultar cursos:', errorCursos.message);
    } else {
      console.log(`📚 Cursos encontrados: ${cursos.length}`);
      cursos.forEach((c, i) => {
        console.log(`   ${i + 1}. ${c.titulo} (ID: ${c.id})`);
      });
    }
    console.log('');
    const { data: estudiantes, error: errorEstudiantes } = await supabase
      .from('estudiantes')
      .select('*');
    if (errorEstudiantes) {
      console.log('❌ Error al consultar estudiantes:', errorEstudiantes.message);
    } else {
      console.log(`👥 Estudiantes encontrados: ${estudiantes.length}`);
      estudiantes.forEach((e, i) => {
        console.log(`   ${i + 1}. ${e.nombre} (${e.documento})`);
      });
    }
    console.log('');
    const { data: evaluaciones, error: errorEvaluaciones } = await supabase
      .from('evaluaciones')
      .select('*');
    if (errorEvaluaciones) {
      console.log('❌ Error al consultar evaluaciones:', errorEvaluaciones.message);
    } else {
      console.log(`📝 Evaluaciones encontradas: ${evaluaciones.length}`);
    }
  } catch (error) {
    console.error('❌ Error general:', error);
  }
  process.exit(0);
}
verificarDatos();
