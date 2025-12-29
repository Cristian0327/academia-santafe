const isClient = typeof window !== 'undefined';
const isProduction = isClient && window.location.hostname !== 'localhost';
const getApiUrl = () => {
  if (!isClient) {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  }
  if (isProduction) {
    return '';  // Sin base URL, usa rutas relativas
  }
  return 'http://localhost:3001';
};
const config = {
  apiUrl: getApiUrl(),
  endpoints: {
    cursos: isProduction && isClient ? '/data/cursos-list.json' : '/api/cursos',
    curso: (id: string) => isProduction && isClient ? `/data/cursos/${id}.json` : `/api/cursos/${id}`,
    inscripciones: '/api/inscripciones',
    inscripcion: (documento: string, cursoId: string) => `/api/inscripciones/${documento}/${cursoId}`,
    inscripcionesCurso: (cursoId: string) => `/api/inscripciones/curso/${cursoId}`,
    health: '/api/health'
  },
  requestConfig: {
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 30000 // 30 segundos
  }
};
export default config;
