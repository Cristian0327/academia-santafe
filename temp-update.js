const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jhpnqoxeldbkcbsyfcjf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpocG5xb3hlbGRia2Nic3lmY2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyMDA1MzksImV4cCI6MjA0OTc3NjUzOX0.RBM1hkbZB78hSKqhBwl2Vl5_fwBSP8dqB7mC_8EXLjI'
);

const bloques = [
  {
    id: 'video-1',
    tipo: 'video',
    orden: 0,
    titulo: 'Inducción Corporativa y SG-SST',
    contenido: '',
    duracion: 24,
    videoUrl: 'https://youtu.be/AIitMyJ3CkI'
  },
  {
    id: 'eval-1',
    tipo: 'evaluacion',
    orden: 1,
    titulo: 'Evaluación Final - SG-SST',
    contenido: '',
    duracion: 30,
    preguntas: [
      {
        id: '1',
        pregunta: 'Ladrillera Santafé fomenta la cultura de autocuidado de sus colaboradores - visitantes y contratistas estableciendo las siguientes Políticas:',
        tipo: 'multiple',
        opciones: [
          'Política de Seguridad y Salud en el trabajo',
          'Política de No consumo de Alcohol - Tabaco y sustancias Psicoactivas',
          'Política de Seguridad Vial',
          'Todas las anteriores'
        ],
        respuestaCorrecta: 3,
        retroalimentacionPositiva: '¡Excelente! Marco integral de políticas correctamente identificado.',
        retroalimentacionNegativa: 'El autocuidado se fortalece con múltiples políticas complementarias. Revisa el marco completo de políticas corporativas en el video.'
      },
      {
        id: '2',
        pregunta: 'Ladrillera Santafé refuerza el autocuidado del personal directo, contratistas y visitantes solicitando el cumplimiento de las Reglas que Salvan Vidas, estas son:',
        tipo: 'multiple',
        opciones: ['8 Reglas', '9 Reglas', '10 Reglas', '12 Reglas'],
        respuestaCorrecta: 2,
        retroalimentacionPositiva: '¡Correcto! Son 10 Reglas que Salvan Vidas.',
        retroalimentacionNegativa: 'Las Reglas que Salvan Vidas son un conjunto estandarizado. Verifica el número exacto mencionado en el video.'
      },
      {
        id: '3',
        pregunta: 'La Regla que salva vidas N° 3 menciona: Conserva tu espacio de trabajo Seguro-Ordenado y Limpio. NO acatar esta regla es un incumplimiento a:',
        tipo: 'multiple',
        opciones: [
          'P-SST-157 MANUAL DE CONTRATISTAS',
          'Programa SOL',
          'Ninguna de las anteriores',
          'A Y B son correctas'
        ],
        respuestaCorrecta: 0,
        retroalimentacionPositiva: '¡Bien! Documento regulatorio identificado correctamente.',
        retroalimentacionNegativa: 'Esta regla vincula con un documento normativo específico. Revisa el segmento sobre la Regla N° 3.'
      },
      {
        id: '4',
        pregunta: 'Uno de los objetivos del sistema de gestión de Seguridad y Salud en el Trabajo es: Generar una cultura organizacional enfocada al autocuidado, encaminado a la prevención de accidentes y enfermedades laborales, contribuyendo a mantener espacios seguros, saludables, productivos y de calidad en nuestras operaciones.',
        tipo: 'multiple',
        opciones: ['Verdadero', 'Falso'],
        respuestaCorrecta: 0,
        retroalimentacionPositiva: '¡Excelente! Enfoque preventivo del SG-SST comprendido.',
        retroalimentacionNegativa: 'El SG-SST tiene objetivos claramente definidos. Revisa los objetivos expuestos en la inducción.'
      },
      {
        id: '5',
        pregunta: 'Como contratista debo portar adecuadamente mi uniforme y hacer uso adecuado de todos los elementos de protección personal propios de la actividad a realizar dentro de las instalaciones de LSF.',
        tipo: 'multiple',
        opciones: ['Verdadero', 'Falso'],
        respuestaCorrecta: 0,
        retroalimentacionPositiva: '¡Correcto! EPP y uniforme son obligatorios.',
        retroalimentacionNegativa: 'Los EPP son fundamentales para seguridad. Revisa las obligaciones sobre EPP y uniforme.'
      },
      {
        id: '6',
        pregunta: 'Para todas las intervenciones que como contratista realice dentro de Ladrillera Santafé debo contar con:',
        tipo: 'multiple',
        opciones: [
          'Permisos de trabajo diligenciados y firmados (a la mano)',
          'Haber realizado Inducción - Reinducción con LSF',
          'Contar con las certificaciones pertinentes a la tarea a realizar',
          'Todas las anteriores'
        ],
        respuestaCorrecta: 3,
        retroalimentacionPositiva: '¡Perfecto! Requisitos previos completos identificados.',
        retroalimentacionNegativa: 'Las intervenciones requieren múltiples requisitos simultáneos. Revisa la sección de requisitos previos.'
      },
      {
        id: '7',
        pregunta: 'Como contratista debo conocer, cumplir y acatar las normas, procedimientos y recomendaciones en materia de Seguridad y Salud en el trabajo de Ladrillera Santafé.',
        tipo: 'multiple',
        opciones: ['Verdadero', 'Falso'],
        respuestaCorrecta: 0,
        retroalimentacionPositiva: '¡Bien! Cumplimiento normativo es responsabilidad de todos.',
        retroalimentacionNegativa: 'El cumplimiento normativo es clave. Revisa las responsabilidades del contratista en el SG-SST.'
      },
      {
        id: '8',
        pregunta: 'Es responsabilidad del contratista con el SG – SST de LSF reportar e informar de manera oportuna cualquier incidente y/o accidente ocurrido en las instalaciones de Ladrillera Santafé.',
        tipo: 'multiple',
        opciones: ['Verdadero', 'Falso'],
        respuestaCorrecta: 0,
        retroalimentacionPositiva: '¡Correcto! Reporte oportuno para mejora continua.',
        retroalimentacionNegativa: 'Reportes oportunos previenen futuros incidentes. Revisa los protocolos de reporte.'
      },
      {
        id: '9',
        pregunta: 'NO es un Elemento de Protección Personal',
        tipo: 'multiple',
        opciones: ['Casco', 'Audífonos', 'Respirador', 'Protección Auditiva'],
        respuestaCorrecta: 1,
        retroalimentacionPositiva: '¡Excelente! Diferenciación correcta entre EPP y objetos personales.',
        retroalimentacionNegativa: 'Los EPP están certificados específicamente para protección. Revisa la clasificación de EPP.'
      },
      {
        id: '10',
        pregunta: 'En caso de alguna emergencia en las instalaciones de Ladrillera Santafé debo:',
        tipo: 'multiple',
        opciones: [
          'Acatar las indicaciones del personal autorizado. (SST - Brigadistas - entre otros)',
          'Esperar el direccionamiento de mi empleador',
          'Correr y salvaguardar mi vida',
          'Evacuar primero que todos.'
        ],
        respuestaCorrecta: 0,
        retroalimentacionPositiva: '¡Perfecto! Seguir instrucciones de personal autorizado es fundamental.',
        retroalimentacionNegativa: 'Hay un protocolo establecido con personal capacitado. Revisa los procedimientos de evacuación.'
      }
    ]
  }
];

(async () => {
  const { error } = await supabase
    .from('cursos')
    .update({ bloques: JSON.stringify(bloques) })
    .eq('titulo', 'Inducción Corporativa y SG-SST - Ladrillera Santafé');

  console.log(error ? '❌ ' + error.message : '✅ Retroalimentaciones actualizadas con diseño instruccional apropiado');
})();
