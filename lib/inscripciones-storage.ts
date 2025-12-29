export interface InscripcionData {
  nombre: string;
  documento: string;
  cargo?: string;
  empresa?: string;
  cursoId: string;
  progreso: number;
  completado: boolean;
  activo: boolean;
  fechaInscripcion: string;
  fechaCompletado?: string;
  calificacion?: number;
}
export const obtenerTodasInscripciones = (): InscripcionData[] => {
  if (typeof window === 'undefined') return [];
  const inscripciones: InscripcionData[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('inscripcion_')) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const inscripcion = JSON.parse(data) as InscripcionData;
          inscripciones.push(inscripcion);
        }
      } catch (error) {
        console.error(`Error al parsear inscripción ${key}:`, error);
      }
    }
  }
  return inscripciones;
};
export const obtenerInscripcionesPorDocumento = (documento: string): InscripcionData[] => {
  if (typeof window === 'undefined') return [];
  const inscripciones: InscripcionData[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(`inscripcion_${documento}_`)) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const inscripcion = JSON.parse(data) as InscripcionData;
          inscripciones.push(inscripcion);
        }
      } catch (error) {
        console.error(`Error al parsear inscripción ${key}:`, error);
      }
    }
  }
  return inscripciones;
};
export const obtenerInscripcionesPorEmail = (email: string): InscripcionData[] => {
  return obtenerInscripcionesPorDocumento(email);
};
export const obtenerInscripcionesPorCurso = (cursoId: string): InscripcionData[] => {
  if (typeof window === 'undefined') return [];
  const inscripciones: InscripcionData[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.endsWith(`_${cursoId}`)) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const inscripcion = JSON.parse(data) as InscripcionData;
          inscripciones.push(inscripcion);
        }
      } catch (error) {
        console.error(`Error al parsear inscripción ${key}:`, error);
      }
    }
  }
  return inscripciones;
};
export const actualizarProgreso = (
  documento: string,
  cursoId: string,
  progreso: number,
  completado: boolean = false
): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const inscripcionKey = `inscripcion_${documento}_${cursoId}`;
    const data = localStorage.getItem(inscripcionKey);
    if (!data) return false;
    const inscripcion = JSON.parse(data) as InscripcionData;
    inscripcion.progreso = progreso;
    inscripcion.completado = completado;
    if (completado && !inscripcion.fechaCompletado) {
      inscripcion.fechaCompletado = new Date().toISOString();
    }
    localStorage.setItem(inscripcionKey, JSON.stringify(inscripcion));
    return true;
  } catch (error) {
    console.error('Error al actualizar progreso:', error);
    return false;
  }
};
export const guardarCalificacion = (
  documento: string,
  cursoId: string,
  calificacion: number
): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const inscripcionKey = `inscripcion_${documento}_${cursoId}`;
    const data = localStorage.getItem(inscripcionKey);
    if (!data) return false;
    const inscripcion = JSON.parse(data) as InscripcionData;
    inscripcion.calificacion = calificacion;
    localStorage.setItem(inscripcionKey, JSON.stringify(inscripcion));
    return true;
  } catch (error) {
    console.error('Error al guardar calificación:', error);
    return false;
  }
};
export const obtenerEstadisticasUsuario = (documento: string) => {
  const inscripciones = obtenerInscripcionesPorDocumento(documento);
  const cursosCompletados = inscripciones.filter(i => i.completado).length;
  const cursosEnProgreso = inscripciones.filter(i => !i.completado && i.activo).length;
  const progresoPromedio = inscripciones.length > 0
    ? Math.round(inscripciones.reduce((sum, i) => sum + i.progreso, 0) / inscripciones.length)
    : 0;
  return {
    totalCursos: inscripciones.length,
    cursosCompletados,
    cursosEnProgreso,
    progresoPromedio
  };
};
