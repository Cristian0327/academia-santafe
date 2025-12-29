import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jhpnqoxeldbkcbsyfcjf.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_F1kMH3wYOW5ySpq-HftukQ_FLEsmnEm';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export interface Estudiante {
  id?: number;
  documento: string;
  nombre: string;
  created_at?: string;
}
export interface Curso {
  id?: number;
  titulo: string;
  descripcion: string;
  instructor: string;
  categoria: string;
  duracion_estimada?: number;
  nivel?: string;
  video_url?: string;
  imagen_portada?: string;
  created_at?: string;
}
export interface Progreso {
  id?: number;
  documento: string;
  curso_id: number;
  porcentaje: number;
  ultima_leccion?: string;
  completado: boolean;
  fecha_inscripcion: string;
  fecha_completado?: string;
  created_at?: string;
  updated_at?: string;
}
export interface Evaluacion {
  id?: number;
  documento: string;
  curso_id: number;
  calificacion: number;
  aprobado: boolean;
  respuestas?: any;
  fecha: string;
  created_at?: string;
}
export const supabaseHelpers = {
  async obtenerEstudiante(documento: string) {
    const { data, error } = await supabase
      .from('estudiantes')
      .select('*')
      .eq('documento', documento)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no encontrado
    return data;
  },
  async crearEstudiante(estudiante: Estudiante) {
    const { data, error } = await supabase
      .from('estudiantes')
      .insert(estudiante)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async obtenerProgreso(documento: string, cursoId: number) {
    const { data, error } = await supabase
      .from('progreso')
      .select('*')
      .eq('documento', documento)
      .eq('curso_id', cursoId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },
  async guardarProgreso(progreso: Progreso) {
    const { data, error } = await supabase
      .from('progreso')
      .upsert(progreso, { onConflict: 'documento,curso_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async obtenerTodoProgresoEstudiante(documento: string) {
    const { data, error } = await supabase
      .from('progreso')
      .select('*')
      .eq('documento', documento);
    if (error) throw error;
    return data || [];
  },
  async guardarEvaluacion(evaluacion: Evaluacion) {
    const { data, error } = await supabase
      .from('evaluaciones')
      .insert(evaluacion)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async obtenerEvaluacion(documento: string, cursoId: number) {
    const { data, error } = await supabase
      .from('evaluaciones')
      .select('*')
      .eq('documento', documento)
      .eq('curso_id', cursoId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },
  async obtenerCursos() {
    const { data, error } = await supabase
      .from('cursos')
      .select('id, titulo, descripcion, instructor, categoria, duracion, duracion_estimada, nivel, imagen_portada, video_url, precio, activo, created_at, clave_inscripcion')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async obtenerCurso(id: number) {
    const { data, error } = await supabase
      .from('cursos')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }
};
