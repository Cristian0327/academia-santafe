const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://jhpnqoxeldbkcbsyfcjf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpocG5xb3hlbGRia2Nic3lmY2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNTgyNjcsImV4cCI6MjA1MDkzNDI2N30.cN5nuhbzuyoTnfhD2z_iXE3z7rwIjJO06_l-BobbUXE'
);
async function verEstudiantes() {
  console.log('🔍 Consultando estudiantes...\n');
  const { data, error } = await supabase
    .from('estudiantes')
    .select('*');
  if (error) {
    console.log('❌ Error:', error);
  } else {
    console.log(`📊 Estudiantes en la base de datos: ${data.length}\n`);
    if (data.length > 0) {
      data.forEach((est, i) => {
        console.log(`${i + 1}. ${est.nombre} (${est.documento})`);
        console.log(`   Email: ${est.email}`);
        console.log(`   Fecha: ${est.created_at}\n`);
      });
    }
  }
  process.exit(0);
}
verEstudiantes();
