import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PDFDocument } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const numArchivos = parseInt(formData.get('numArchivos') as string || '1');
    
    // Recoger todos los PDFs
    const pdfBuffers: Buffer[] = [];
    for (let i = 0; i < numArchivos; i++) {
      const pdfFile = formData.get(`pdf${i}`) as File;
      if (pdfFile) {
        const bytes = await pdfFile.arrayBuffer();
        pdfBuffers.push(Buffer.from(bytes));
      }
    }
    
    if (pdfBuffers.length === 0) {
      return NextResponse.json({ error: 'No se proporcionaron archivos PDF' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key de Gemini no configurada' }, { status: 500 });
    }

    console.log(`Procesando ${pdfBuffers.length} PDF(s)...`);

    // Extraer imágenes de todos los PDFs
    const imagenesExtraidas: string[] = [];
    for (const pdfBuffer of pdfBuffers) {
      try {
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const pages = pdfDoc.getPages();
        
        console.log(`PDF con ${pages.length} páginas`);
        
        // Acceder al catálogo interno del PDF para extraer imágenes
        const pdfBytes = await pdfDoc.save();
        const uint8Array = new Uint8Array(pdfBytes);
        
        // Buscar patrones de imágenes JPEG en el PDF
        const jpegStartMarker = [0xFF, 0xD8, 0xFF]; // Inicio JPEG
        const jpegEndMarker = [0xFF, 0xD9]; // Fin JPEG
        
        let i = 0;
        while (i < uint8Array.length - 3) {
          // Buscar inicio de JPEG
          if (uint8Array[i] === jpegStartMarker[0] && 
              uint8Array[i + 1] === jpegStartMarker[1] && 
              uint8Array[i + 2] === jpegStartMarker[2]) {
            
            // Encontrar el final del JPEG
            let endPos = i + 3;
            while (endPos < uint8Array.length - 1) {
              if (uint8Array[endPos] === jpegEndMarker[0] && 
                  uint8Array[endPos + 1] === jpegEndMarker[1]) {
                // Extraer la imagen completa
                const imageBytes = uint8Array.slice(i, endPos + 2);
                const base64 = Buffer.from(imageBytes).toString('base64');
                const dataUrl = `data:image/jpeg;base64,${base64}`;
                
                // Validar que no sea muy pequeña (evitar iconos/miniaturas)
                if (imageBytes.length > 5000) {
                  imagenesExtraidas.push(dataUrl);
                }
                
                i = endPos + 2;
                break;
              }
              endPos++;
            }
          }
          i++;
        }
        
      } catch (pdfError) {
        console.log('Error al procesar PDF para imágenes:', pdfError);
      }
    }
    
    console.log(`Imágenes extraídas: ${imagenesExtraidas.length}`);

    // Inicializar Gemini
    const apiKey1 = process.env.GEMINI_API_KEY;
    const apiKey2 = process.env.GEMINI_API_KEY_2;
    const genAI = new GoogleGenerativeAI(apiKey1 || apiKey2!);

    // Crear prompt simplificado que evita JSON inválido
    const prompt = `Analiza estos ${pdfBuffers.length} PDF(s) y genera un curso.

REGLAS CRÍTICAS - LEE ESTO PRIMERO:
1. NO RESUMAS NADA - Copia TODO el contenido del PDF LITERALMENTE
2. NO OMITAS INFORMACIÓN - Si el PDF tiene 5 páginas, usa las 5 páginas completas
3. Tu trabajo es SOLO organizar en secciones, NO resumir
4. Cada CONTENIDO_BLOQUE debe tener TODO el texto relacionado sin acortar

RESPONDE EN ESTE FORMATO EXACTO (usa ~~~ como separadores):

TITULO~~~[Título basado en el contenido del PDF]
DESCRIPCION~~~[Descripción breve del tema general]
INSTRUCTOR~~~Academia Santafé Team
CATEGORIA~~~[Categoría apropiada]
DURACION~~~2 horas
NIVEL~~~Principiante
BLOQUES_START
BLOQUE~~~leccion
TITULO_BLOQUE~~~[Título de esta sección]
DESCRIPCION_BLOQUE~~~[Descripción breve de qué trata]
CONTENIDO_BLOQUE~~~[AQUÍ VA TODO EL TEXTO DEL PDF PARA ESTA SECCIÓN - NO RESUMAS - COPIA TODO EL CONTENIDO COMPLETO. Usa etiquetas HTML simples como <p>, <b>, <ul>, <li> pero SIN comillas dobles. Si el PDF tiene tablas o listas, inclúyelas completas.]
DURACION_BLOQUE~~~[tiempo estimado en minutos]
BLOQUE_END
BLOQUE~~~evaluacion
TITULO_BLOQUE~~~Evaluación [nombre del módulo]
PUNTAJE_MINIMO~~~70
PREGUNTAS_START
PREGUNTA~~~[Pregunta basada en el contenido]
OPCIONES~~~Opción A|||Opción B|||Opción C|||Opción D
RESPUESTA_CORRECTA~~~[índice 0-3]
RETRO_POSITIVA~~~Correcto, porque [explicación de por qué es la respuesta correcta]
RETRO_NEGATIVA~~~Incorrecto. [Explicación de por qué está mal, SIN revelar cuál es la correcta. Guía al estudiante a reflexionar]
PREGUNTAS_END
BLOQUE_END
[... más bloques siguiendo el patrón leccion-evaluacion ...]
BLOQUES_END

INSTRUCCIONES DE ORGANIZACIÓN:
1. Lee TODO el PDF completo primero
2. Divide el contenido en secciones lógicas (4-8 bloques)
3. Alterna: leccion → evaluacion → leccion → evaluacion
4. En cada CONTENIDO_BLOQUE, copia TODO el texto relevante SIN resumir
5. Las evaluaciones deben tener 3-5 preguntas sobre el contenido de la lección anterior
6. NO uses comillas dobles (") en ningún lugar
7. Usa los separadores ~~~ exactamente como se muestra
8. IMPORTANTE - Retroalimentación:
   - RETRO_POSITIVA: Explica POR QUÉ la respuesta es correcta
   - RETRO_NEGATIVA: Explica POR QUÉ está mal, pero NO reveles cuál es la correcta. Guía al estudiante a reflexionar

RECUERDA: Tu función NO es resumir, es ORGANIZAR el contenido completo en bloques educativos.`;

    // Enviar todos los PDFs a Gemini
    const parts: any[] = [];
    pdfBuffers.forEach((buffer, idx) => {
      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: buffer.toString('base64')
        }
      });
    });
    parts.push(prompt);

    console.log('Enviando a Gemini...');
    
    // Intentar con la API key 1, si falla usar la API key 2
    let result;
    try {
      const model1 = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: {
          maxOutputTokens: 16384,
          temperature: 0.3,
        }
      });
      result = await model1.generateContent(parts);
      console.log('✅ Éxito con Gemini API Key 1');
    } catch (error: any) {
      if ((error.message?.includes('429') || error.message?.includes('quota')) && apiKey2) {
        console.log('⚠️ API Key 1 agotada, cambiando a API Key 2...');
        const genAI2 = new GoogleGenerativeAI(apiKey2);
        const model2 = genAI2.getGenerativeModel({ 
          model: 'gemini-2.5-flash',
          generationConfig: {
            maxOutputTokens: 16384,
            temperature: 0.3,
          }
        });
        result = await model2.generateContent(parts);
        console.log('✅ Éxito con Gemini API Key 2');
      } else {
        throw error;
      }
    }
    
    const response = result.response;
    const text = response.text();
    
    console.log('Respuesta recibida, parseando...');
    
    // Parsear el formato personalizado (mucho más robusto que JSON)
    const cursoGenerado = parsearRespuestaIA(text);
    
    // Distribuir imágenes entre las lecciones
    if (imagenesExtraidas.length > 0) {
      console.log(`Distribuyendo ${imagenesExtraidas.length} imágenes entre las lecciones`);
      const lecciones = cursoGenerado.bloques.filter((b: any) => b.tipo === 'leccion');
      console.log(`Lecciones encontradas: ${lecciones.length}`);
      
      if (lecciones.length > 0) {
        const imagenesPorLeccion = Math.ceil(imagenesExtraidas.length / lecciones.length);
        let imgIndex = 0;
        
        cursoGenerado.bloques = cursoGenerado.bloques.map((bloque: any) => {
          if (bloque.tipo === 'leccion' && imgIndex < imagenesExtraidas.length) {
            // Tomar las imágenes asignadas a esta lección
            const imagenesLeccion = imagenesExtraidas.slice(imgIndex, imgIndex + imagenesPorLeccion);
            imgIndex += imagenesPorLeccion;
            
            console.log(`Agregando ${imagenesLeccion.length} imágenes a la lección: ${bloque.titulo}`);
            
            // Insertar imágenes en el contenido
            let contenidoConImagenes = bloque.contenido || '';
            imagenesLeccion.forEach((img: string, idx: number) => {
              contenidoConImagenes += `\n<p style="text-align:center;margin:1.5rem 0"><img src="${img}" style="max-width:100%;height:auto;border-radius:0.5rem;box-shadow:0 4px 6px rgba(0,0,0,0.1)" alt="Imagen ${idx + 1}" /></p>\n`;
            });
            
            console.log(`Contenido original: ${(bloque.contenido || '').length} chars, Con imágenes: ${contenidoConImagenes.length} chars`);
            
            return { ...bloque, contenido: contenidoConImagenes };
          }
          return bloque;
        });
      }
    }
    
    console.log(`Curso generado exitosamente: ${cursoGenerado.titulo}`);
    console.log(`Bloques generados: ${cursoGenerado.bloques.length}`);

    return NextResponse.json({
      success: true,
      curso: cursoGenerado,
      imagenes: imagenesExtraidas,
      mensaje: `Curso generado con ${cursoGenerado.bloques.length} bloques desde ${pdfBuffers.length} PDF(s). ${imagenesExtraidas.length} imágenes extraídas.`
    });

  } catch (error: any) {
    console.error('Error en generar-curso-pdf:', error);
    return NextResponse.json(
      { 
        error: 'Error al procesar PDF', 
        details: error.message,
        stack: error.stack?.split('\n').slice(0, 3)
      },
      { status: 500 }
    );
  }
}

function parsearRespuestaIA(text: string): any {
  const curso: any = {
    titulo: '',
    descripcion: '',
    instructor: 'Coordinador SST',
    categoria: 'General',
    duracion: '2 horas',
    nivel: 'Principiante',
    bloques: []
  };

  // Extraer campos básicos
  const extraer = (campo: string) => {
    const regex = new RegExp(`${campo}~~~([^~\\n]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  curso.titulo = extraer('TITULO') || 'Curso Generado por IA';
  curso.descripcion = extraer('DESCRIPCION') || 'Curso generado automáticamente desde PDF';
  curso.instructor = extraer('INSTRUCTOR') || 'Coordinador SST';
  curso.categoria = extraer('CATEGORIA') || 'General';
  curso.duracion = extraer('DURACION') || '2 horas';
  curso.nivel = extraer('NIVEL') || 'Principiante';

  // Extraer bloques - buscar BLOQUE~~~ en TODO el texto, sin necesitar marcadores START/END
  // Dividir por BLOQUE_END para separar cada bloque
  const bloquesSplit = text.split(/BLOQUE_END/g).filter(b => b.includes('BLOQUE~~~'));
  
  console.log(`Encontrados ${bloquesSplit.length} bloques en el texto`);

  bloquesSplit.forEach((bloqueTexto, idx) => {
    const tipoMatch = bloqueTexto.match(/BLOQUE~~~(\w+)/);
    if (!tipoMatch) return;

    const tipo = tipoMatch[1].toLowerCase();
    const tituloBloque = bloqueTexto.match(/TITULO_BLOQUE~~~([^~\n]+)/)?.[1]?.trim() || 'Sin título';

    if (tipo === 'leccion') {
      const descripcion = bloqueTexto.match(/DESCRIPCION_BLOQUE~~~([^~\n]+)/)?.[1]?.trim() || '';
      
      // Extraer contenido: todo entre CONTENIDO_BLOQUE~~~ y DURACION_BLOQUE
      const contenidoMatch = bloqueTexto.match(/CONTENIDO_BLOQUE~~~([\s\S]*?)DURACION_BLOQUE/);
      const contenido = contenidoMatch ? contenidoMatch[1].trim() : 'Contenido no disponible';
      
      const duracionMatch = bloqueTexto.match(/DURACION_BLOQUE~~~([^~\n]+)/)?.[1]?.trim() || '15 min';
      // Extraer solo el número de la duración
      const duracionNum = duracionMatch.match(/\d+/)?.[0] || '15';
      
      curso.bloques.push({
        titulo: tituloBloque,
        tipo: 'leccion',
        descripcion,
        contenido,
        duracion: duracionNum
      });
      
      console.log(`Bloque ${idx + 1}: Lección "${tituloBloque}" - ${contenido.length} caracteres`);
    } else if (tipo === 'evaluacion') {
      const preguntas: any[] = [];
      
      // Extraer sección de preguntas
      const preguntasSeccion = bloqueTexto.match(/PREGUNTAS_START([\s\S]*)PREGUNTAS_END/);
      if (preguntasSeccion) {
        const preguntasTexto = preguntasSeccion[1];
        
        // Split por PREGUNTA~~~ para obtener cada pregunta
        const preguntasSplit = preguntasTexto.split(/(?=PREGUNTA~~~)/).filter(p => p.includes('PREGUNTA~~~'));
        
        preguntasSplit.forEach(pregTexto => {
          const pregunta = pregTexto.match(/PREGUNTA~~~([^~\n]+)/)?.[1]?.trim();
          const opciones = pregTexto.match(/OPCIONES~~~([^~\n]+)/)?.[1]?.split('|||').map(o => o.trim());
          const respuesta = pregTexto.match(/RESPUESTA_CORRECTA~~~(\d+)/)?.[1];
          const retroPos = pregTexto.match(/RETRO_POSITIVA~~~([^~\n]+)/)?.[1]?.trim() || 'Correcto';
          const retroNeg = pregTexto.match(/RETRO_NEGATIVA~~~([^~\n]+)/)?.[1]?.trim() || 'Incorrecto';
          
          if (pregunta && opciones && respuesta !== undefined) {
            preguntas.push({
              tipo: 'multiple',
              pregunta,
              opciones,
              respuestaCorrecta: parseInt(respuesta),
              retroalimentacionPositiva: retroPos,
              retroalimentacionNegativa: retroNeg
            });
          }
        });
      }

      curso.bloques.push({
        titulo: tituloBloque,
        tipo: 'evaluacion',
        puntajeMinimo: parseInt(bloqueTexto.match(/PUNTAJE_MINIMO~~~(\d+)/)?.[1] || '70'),
        preguntas
      });
      
      console.log(`Bloque ${idx + 1}: Evaluación "${tituloBloque}" - ${preguntas.length} preguntas`);
    }
  });

  return curso;
}
