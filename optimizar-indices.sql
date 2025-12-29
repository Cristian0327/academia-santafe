CREATE INDEX IF NOT EXISTS idx_cursos_activo ON cursos(activo);
CREATE INDEX IF NOT EXISTS idx_cursos_created_at ON cursos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_estudiantes_documento ON estudiantes(documento);
CREATE INDEX IF NOT EXISTS idx_progreso_curso_id ON progreso(curso_id);
CREATE INDEX IF NOT EXISTS idx_progreso_documento ON progreso(documento);
CREATE INDEX IF NOT EXISTS idx_evaluaciones_curso_id ON evaluaciones(curso_id);
