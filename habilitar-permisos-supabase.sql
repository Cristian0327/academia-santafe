-- EJECUTAR EN SUPABASE SQL EDITOR
-- https://supabase.com/dashboard/project/jhpnqoxeldbkcbsyfcjf/editor

-- 1. Habilitar políticas para la tabla cursos (permitir todo)
DROP POLICY IF EXISTS "Permitir SELECT a todos" ON cursos;
DROP POLICY IF EXISTS "Permitir INSERT a todos" ON cursos;
DROP POLICY IF EXISTS "Permitir UPDATE a todos" ON cursos;
DROP POLICY IF EXISTS "Permitir DELETE a todos" ON cursos;

CREATE POLICY "Permitir SELECT a todos" ON cursos FOR SELECT USING (true);
CREATE POLICY "Permitir INSERT a todos" ON cursos FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir UPDATE a todos" ON cursos FOR UPDATE USING (true);
CREATE POLICY "Permitir DELETE a todos" ON cursos FOR DELETE USING (true);

-- 2. Habilitar políticas para la tabla estudiantes
DROP POLICY IF EXISTS "Permitir SELECT a todos" ON estudiantes;
DROP POLICY IF EXISTS "Permitir INSERT a todos" ON estudiantes;
DROP POLICY IF EXISTS "Permitir UPDATE a todos" ON estudiantes;
DROP POLICY IF EXISTS "Permitir DELETE a todos" ON estudiantes;

CREATE POLICY "Permitir SELECT a todos" ON estudiantes FOR SELECT USING (true);
CREATE POLICY "Permitir INSERT a todos" ON estudiantes FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir UPDATE a todos" ON estudiantes FOR UPDATE USING (true);
CREATE POLICY "Permitir DELETE a todos" ON estudiantes FOR DELETE USING (true);

-- 3. Habilitar políticas para la tabla progreso
DROP POLICY IF EXISTS "Permitir SELECT a todos" ON progreso;
DROP POLICY IF EXISTS "Permitir INSERT a todos" ON progreso;
DROP POLICY IF EXISTS "Permitir UPDATE a todos" ON progreso;
DROP POLICY IF EXISTS "Permitir DELETE a todos" ON progreso;

CREATE POLICY "Permitir SELECT a todos" ON progreso FOR SELECT USING (true);
CREATE POLICY "Permitir INSERT a todos" ON progreso FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir UPDATE a todos" ON progreso FOR UPDATE USING (true);
CREATE POLICY "Permitir DELETE a todos" ON progreso FOR DELETE USING (true);

-- 4. Habilitar políticas para la tabla evaluaciones
DROP POLICY IF EXISTS "Permitir SELECT a todos" ON evaluaciones;
DROP POLICY IF EXISTS "Permitir INSERT a todos" ON evaluaciones;
DROP POLICY IF EXISTS "Permitir UPDATE a todos" ON evaluaciones;
DROP POLICY IF EXISTS "Permitir DELETE a todos" ON evaluaciones;

CREATE POLICY "Permitir SELECT a todos" ON evaluaciones FOR SELECT USING (true);
CREATE POLICY "Permitir INSERT a todos" ON evaluaciones FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir UPDATE a todos" ON evaluaciones FOR UPDATE USING (true);
CREATE POLICY "Permitir DELETE a todos" ON evaluaciones FOR DELETE USING (true);

-- Verificar que RLS esté habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('cursos', 'estudiantes', 'progreso', 'evaluaciones');
