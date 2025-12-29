-- ==========================================
-- INSTRUCCIONES PARA EJECUTAR EN SUPABASE
-- ==========================================
-- 
-- 1. Ve a Supabase Dashboard: https://supabase.com/dashboard/project/jhpnqoxeldbkcbsyfcjf
-- 2. Click en "SQL Editor" en el menú izquierdo
-- 3. Copia y pega el siguiente código
-- 4. Click en "Run" para ejecutar
--
-- ==========================================

-- Agregar columna duracion (texto) a la tabla cursos
ALTER TABLE cursos ADD COLUMN IF NOT EXISTS duracion TEXT;

-- Verificar que se creó correctamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cursos' 
ORDER BY column_name;

-- Mostrar todos los cursos con sus duraciones
SELECT id, titulo, duracion, duracion_estimada, clave_inscripcion
FROM cursos
ORDER BY id;
