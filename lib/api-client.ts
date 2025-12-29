import { supabase, supabaseHelpers } from './supabase';
class ApiClient {
  async listarCursos(): Promise<any[]> {
    try {
      const cursos = await supabaseHelpers.obtenerCursos();
      return cursos;
    } catch (error) {
      console.error('Error al listar cursos:', error);
      return [];
    }
  }
  async obtenerCurso(id: string): Promise<any> {
    try {
      const curso = await supabaseHelpers.obtenerCurso(parseInt(id));
      return curso;
    } catch (error) {
      console.error('Error al obtener curso:', error);
      return null;
    }
  }
  async guardarCurso(curso: any): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('cursos')
        .upsert({
          ...(curso.id && { id: parseInt(curso.id) }),
          titulo: curso.titulo,
          descripcion: curso.descripcion,
          instructor: curso.instructor,
          categoria: curso.categoria,
          duracion: curso.duracion,
          duracion_estimada: parseInt(curso.duracionEstimada) || 60,
          nivel: curso.nivel || 'Principiante',
          video_url: curso.videoUrl || curso.video_url,
          imagen_portada: curso.imagen || curso.imagen_portada,
          contenido: curso.contenido,
          bloques: curso.bloques,
          evaluaciones: curso.evaluaciones,
          prerequisitos: curso.prerequisitos,
          certificado_template: curso.certificadoTemplate !== undefined ? curso.certificadoTemplate : (curso.certificado_template || null),
          clave_inscripcion: curso.claveInscripcion !== undefined ? curso.claveInscripcion : (curso.clave_inscripcion || null),
          precio: parseFloat(curso.precio) || 0,
          activo: curso.activo !== undefined ? curso.activo : true
        })
        .select()
        .single();
      if (error) throw error;
      return { success: true, mensaje: 'Curso guardado', curso: data };
    } catch (error) {
      console.error('Error al guardar curso:', error);
      throw error;
    }
  }
  async eliminarCurso(id: string): Promise<void> {
    try {
      const cursoId = typeof id === 'string' ? parseInt(id) : id;
      const { error } = await supabase
        .from('cursos')
        .delete()
        .eq('id', cursoId);
      if (error) {
        console.error('Error de Supabase al eliminar:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      throw error;
    }
  }
  async guardarProgreso(progreso: any): Promise<any> {
    try {
      return await supabaseHelpers.guardarProgreso(progreso);
    } catch (error) {
      console.error('Error al guardar progreso:', error);
      throw error;
    }
  }
  async obtenerProgreso(documento: string, cursoId: string): Promise<any> {
    try {
      return await supabaseHelpers.obtenerProgreso(documento, parseInt(cursoId));
    } catch (error) {
      console.error('Error al obtener progreso:', error);
      return null;
    }
  }
  async guardarEvaluacion(evaluacion: any): Promise<any> {
    try {
      return await supabaseHelpers.guardarEvaluacion(evaluacion);
    } catch (error) {
      console.error('Error al guardar evaluación:', error);
      throw error;
    }
  }
  async obtenerEvaluacion(documento: string, cursoId: string): Promise<any> {
    try {
      return await supabaseHelpers.obtenerEvaluacion(documento, parseInt(cursoId));
    } catch (error) {
      console.error('Error al obtener evaluación:', error);
      return null;
    }
  }
  async obtenerEstudiante(documento: string): Promise<any> {
    try {
      return await supabaseHelpers.obtenerEstudiante(documento);
    } catch (error) {
      console.error('Error al obtener estudiante:', error);
      return null;
    }
  }
  async crearEstudiante(estudiante: any): Promise<any> {
    try {
      return await supabaseHelpers.crearEstudiante(estudiante);
    } catch (error) {
      console.error('Error al crear estudiante:', error);
      throw error;
    }
  }
  async listarTodasInscripciones(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('progreso')
        .select(`
          *,
          cursos (
            id,
            titulo,
            categoria,
            instructor
          )
        `);
      if (error) throw error;
      const inscripciones = (data || []).map((p: any) => ({
        documento: p.documento,
        cursoId: p.curso_id.toString(),
        cursoTitulo: p.cursos?.titulo || 'Sin título',
        categoria: p.cursos?.categoria || '',
        progreso: p.porcentaje,
        completado: p.completado,
        fechaInscripcion: p.fecha_inscripcion,
        fechaCompletado: p.fecha_completado,
        ultimaLeccion: p.ultima_leccion
      }));
      return inscripciones;
    } catch (error) {
      console.error('Error al listar inscripciones:', error);
      return [];
    }
  }
  async obtenerInscripcionesPorCurso(cursoId: string): Promise<any[]> {
    try {
      const todasInscripciones = await this.listarTodasInscripciones();
      return todasInscripciones.filter((i: any) => i.cursoId === cursoId);
    } catch (error) {
      console.error('Error al obtener inscripciones por curso:', error);
      return [];
    }
  }
}
export default new ApiClient();
