const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jhpnqoxeldbkcbsyfcjf.supabase.co';
const supabaseKey = 'sb_publishable_F1kMH3wYOW5ySpq-HftukQ_FLEsmnEm';

const supabase = createClient(supabaseUrl, supabaseKey);

async function agregarColumna() {
  console.log('🔧 Intentando agregar columna duracion...\n');
  
  // Usando la función rpc para ejecutar SQL
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: 'ALTER TABLE cursos ADD COLUMN IF NOT EXISTS duracion TEXT;'
  });
  
  if (error) {
    console.log('⚠️  No se puede ejecutar SQL directamente desde la API (esperado)');
    console.log('Error:', error.message);
    console.log('\n📝 EJECUTA ESTE SQL EN SUPABASE SQL EDITOR:');
    console.log('   https://supabase.com/dashboard/project/jhpnqoxeldbkcbsyfcjf/sql');
    console.log('\n   ALTER TABLE cursos ADD COLUMN IF NOT EXISTS duracion TEXT;\n');
  } else {
    console.log('✅ Columna agregada exitosamente!');
  }
}

agregarColumna().catch(console.error);
