-- Script para limpiar datos de prueba de la tabla estudiantes
-- Ejecutar en: https://supabase.com/dashboard/project/jhpnqoxeldbkcbsyfcjf/editor

-- Ver estudiantes actuales
SELECT * FROM estudiantes;

-- Eliminar todos los estudiantes de prueba
DELETE FROM estudiantes WHERE documento = '1234567890' OR nombre LIKE '%Prueba%' OR nombre LIKE '%Test%';

-- O eliminar TODOS los estudiantes si quieres empezar desde cero:
-- DELETE FROM estudiantes;

-- Verificar que quedaron 0 estudiantes
SELECT COUNT(*) as total_estudiantes FROM estudiantes;
