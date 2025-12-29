const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://jhpnqoxeldbkcbsyfcjf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpocG5xb3hlbGRia2Nic3lmY2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNTgyNjcsImV4cCI6MjA1MDkzNDI2N30.cN5nuhbzuyoTnfhD2z_iXE3z7rwIjJO06_l-BobbUXE';
const supabase = createClient(supabaseUrl, supabaseKey);
async function testConnection() {
  console.log('🔍 Probando conexión a Supabase...\n');
  try {
    console.log('📝 Test 1: Crear estudiante de prueba...');
    const { data: estudiante, error: errorEstudiante } = await supabase
      .from('estudiantes')
      .insert({ documento: '123456789', nombre: 'Estudiante de Prueba' })
      .select()
      .single();
    if (errorEstudiante) {
      console.error('❌ Error creando estudiante:', errorEstudiante.message);
    } else {
      console.log('✅ Estudiante creado:', estudiante);
    }
    console.log('\n📖 Test 2: Leer estudiantes...');
    const { data: estudiantes, error: errorLeer } = await supabase
      .from('estudiantes')
      .select('*');
    if (errorLeer) {
      console.error('❌ Error leyendo estudiantes:', errorLeer.message);
    } else {
      console.log('✅ Estudiantes encontrados:', estudiantes.length);
      console.log(estudiantes);
    }
    console.log('\n📚 Test 3: Crear curso de prueba...');
    const { data: curso, error: errorCurso } = await supabase
      .from('cursos')
      .insert({
        titulo: 'Curso de Prueba',
        descripcion: 'Este es un curso de prueba',
        instructor: 'Instructor Test',
        categoria: 'General'
      })
      .select()
      .single();
    if (errorCurso) {
      console.error('❌ Error creando curso:', errorCurso.message);
    } else {
      console.log('✅ Curso creado:', curso);
    }
    if (curso && estudiante) {
      console.log('\n📊 Test 4: Guardar progreso...');
      const { data: progreso, error: errorProgreso } = await supabase
        .from('progreso')
        .insert({
          documento: '123456789',
          curso_id: curso.id,
          porcentaje: 50,
          completado: false,
          fecha_inscripcion: new Date().toISOString()
        })
        .select()
        .single();
      if (errorProgreso) {
        console.error('❌ Error guardando progreso:', errorProgreso.message);
      } else {
        console.log('✅ Progreso guardado:', progreso);
      }
    }
    console.log('\n✅ ¡Todos los tests pasaron correctamente!');
    console.log('🎉 Supabase está conectado y funcionando.');
  } catch (error) {
    console.error('\n❌ Error general:', error.message);
  }
}
testConnection();
