const isClient = typeof window !== 'undefined';
const isProduction = isClient && window.location.hostname !== 'localhost';

// Siempre usar rutas relativas (sin base URL)
const config = {
  apiUrl: '',
  endpoints: {
    cursos: '/api/cursos',
    curso: (id: string) => `/api/cursos/${id}`,
    inscripciones: '/api/inscripciones',
    inscripcion: (documento: string, cursoId: string) => `/api/inscripciones/${documento}/${cursoId}`,
    inscripcionesCurso: (cursoId: string) => `/api/inscripciones/curso/${cursoId}`,
    health: '/api/health'
  },
  requestConfig: {
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 30000
  }
};

export default config;
