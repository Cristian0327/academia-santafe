const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://jhpnqoxeldbkcbsyfcjf.supabase.co',
  'sb_publishable_F1kMH3wYOW5ySpq-HftukQ_FLEsmnEm'
);
async function agregarCursosPrueba() {
  console.log('📚 Agregando cursos de prueba...\n');
  const cursosPrueba = [
    {
      titulo: 'Seguridad Industrial Básica',
      descripcion: 'Aprende los fundamentos de seguridad industrial y prevención de riesgos laborales en entornos de manufactura.',
      categoria: 'Seguridad',
      nivel: 'Básico',
      duracion_estimada: 180,
      instructor: 'Ing. Carlos Méndez',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      imagen_portada: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
      activo: true,
      contenido: 'Curso completo de seguridad industrial con enfoque práctico',
      bloques: [
        {
          id: 1,
          titulo: 'Introducción a la Seguridad',
          duracion: '40 min',
          completado: false
        },
        {
          id: 2,
          titulo: 'Equipos de Protección Personal',
          duracion: '50 min',
          completado: false
        },
        {
          id: 3,
          titulo: 'Prevención de Accidentes',
          duracion: '45 min',
          completado: false
        }
      ]
    },
    {
      titulo: 'Mantenimiento Preventivo de Maquinaria',
      descripcion: 'Domina las técnicas de mantenimiento preventivo para prolongar la vida útil de equipos industriales.',
      categoria: 'Mantenimiento',
      nivel: 'Intermedio',
      duracion_estimada: 240,
      instructor: 'Tec. María Rodríguez',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      imagen_portada: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800',
      activo: true,
      contenido: 'Guía práctica de mantenimiento preventivo industrial',
      bloques: [
        {
          id: 1,
          titulo: 'Fundamentos del Mantenimiento',
          duracion: '60 min',
          completado: false
        },
        {
          id: 2,
          titulo: 'Lubricación y Limpieza',
          duracion: '55 min',
          completado: false
        },
        {
          id: 3,
          titulo: 'Diagnóstico de Fallas',
          duracion: '70 min',
          completado: false
        }
      ]
    },
    {
      titulo: 'Liderazgo y Trabajo en Equipo',
      descripcion: 'Desarrolla habilidades de liderazgo efectivo y trabajo colaborativo en ambientes industriales.',
      categoria: 'Desarrollo Personal',
      nivel: 'Intermedio',
      duracion_estimada: 150,
      instructor: 'Lic. Andrea Gómez',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      imagen_portada: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      activo: true,
      contenido: 'Curso de liderazgo orientado a supervisores y coordinadores',
      bloques: [
        {
          id: 1,
          titulo: 'Estilos de Liderazgo',
          duracion: '35 min',
          completado: false
        },
        {
          id: 2,
          titulo: 'Comunicación Efectiva',
          duracion: '40 min',
          completado: false
        },
        {
          id: 3,
          titulo: 'Resolución de Conflictos',
          duracion: '45 min',
          completado: false
        }
      ]
    }
  ];
  for (const curso of cursosPrueba) {
    const { data, error } = await supabase
      .from('cursos')
      .insert([curso])
      .select();
    if (error) {
      console.log(`❌ Error al crear "${curso.titulo}":`, error.message);
    } else {
      console.log(`✅ Curso creado: ${data[0].titulo} (ID: ${data[0].id})`);
    }
  }
  console.log('\n📊 Consultando total de cursos...');
  const { data: todosLosCursos, error: errorConsulta } = await supabase
    .from('cursos')
    .select('id, titulo');
  if (!errorConsulta) {
    console.log(`\nTotal de cursos en la base de datos: ${todosLosCursos.length}`);
    todosLosCursos.forEach((c, i) => {
      console.log(`${i + 1}. ${c.titulo} (ID: ${c.id})`);
    });
  }
  process.exit(0);
}
agregarCursosPrueba();
