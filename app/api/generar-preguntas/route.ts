import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { contenidoCurso, tiposPreguntas } = await request.json();
    
    // Sistema de cascada con 5 API keys de Gemini
    const apiKeys = [
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY_4,
      process.env.GEMINI_API_KEY_5
    ].filter(Boolean);

    if (apiKeys.length === 0) {
      return NextResponse.json(
        { error: 'No hay API keys de Gemini configuradas' },
        { status: 500 }
      );
    }
    
    const totalPreguntas = 
      (tiposPreguntas.opcion2 || 0) +
      (tiposPreguntas.opcion3 || 0) +
      (tiposPreguntas.opcion4 || 0) +
      (tiposPreguntas.opcion5 || 0);

    if (totalPreguntas === 0) {
      return NextResponse.json(
        { error: 'Debes especificar al menos una pregunta' },
        { status: 400 }
      );
    }

    const prompt = `Eres un experto en educación y evaluación. Genera preguntas de opción múltiple basadas en el siguiente contenido del curso:

CONTENIDO DEL CURSO:
${contenidoCurso}

INSTRUCCIONES:
Genera exactamente ${totalPreguntas} preguntas distribuidas así:
${tiposPreguntas.opcion2 > 0 ? `- ${tiposPreguntas.opcion2} pregunta(s) con 2 opciones` : ''}
${tiposPreguntas.opcion3 > 0 ? `- ${tiposPreguntas.opcion3} pregunta(s) con 3 opciones` : ''}
${tiposPreguntas.opcion4 > 0 ? `- ${tiposPreguntas.opcion4} pregunta(s) con 4 opciones` : ''}
${tiposPreguntas.opcion5 > 0 ? `- ${tiposPreguntas.opcion5} pregunta(s) con 5 opciones` : ''}

FORMATO DE RESPUESTA (JSON):
Responde ÚNICAMENTE con un array JSON válido sin texto adicional. Cada pregunta debe tener esta estructura exacta:
{
  "id": "numero único",
  "tipo": "multiple",
  "pregunta": "texto de la pregunta",
  "opciones": ["opción 1", "opción 2", ...],
  "respuestaCorrecta": índice de la respuesta correcta (0-based),
  "retroalimentacion": "explicación breve de por qué es correcta"
}

REQUISITOS IMPORTANTES:
1. Las preguntas deben ser claras y estar directamente relacionadas con el contenido
2. Las opciones incorrectas deben ser plausibles pero claramente incorrectas
3. La retroalimentación debe explicar por qué la respuesta es correcta
4. Responde SOLO con el array JSON, sin markdown, sin explicaciones adicionales
5. Asegúrate de que el JSON sea válido y parseable`;

    // Intentar con cada API key hasta que una funcione
    let preguntas = null;
    let ultimoError = null;

    for (let i = 0; i < apiKeys.length; i++) {
      try {
        const genAI = new GoogleGenerativeAI(apiKeys[i] as string);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        
        const result = await model.generateContent(prompt);
        const response = result.response;
        let contenidoRespuesta = response.text();
        
        // Limpiar markdown si existe
        contenidoRespuesta = contenidoRespuesta.trim();
        if (contenidoRespuesta.startsWith('```json')) {
          contenidoRespuesta = contenidoRespuesta.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (contenidoRespuesta.startsWith('```')) {
          contenidoRespuesta = contenidoRespuesta.replace(/```\n?/g, '');
        }

        preguntas = JSON.parse(contenidoRespuesta);
        console.log(`✅ Preguntas generadas con API key ${i + 1}`);
        break; // Éxito, salir del loop
        
      } catch (error: any) {
        console.log(`❌ Error con API key ${i + 1}:`, error.message);
        ultimoError = error;
        
        // Si no es error de quota, no continuar intentando
        if (!error.message?.includes('quota') && !error.message?.includes('429')) {
          break;
        }
        // Continuar con la siguiente key si es error de quota
      }
    }

    if (!preguntas) {
      return NextResponse.json(
        { 
          error: 'No se pudieron generar las preguntas con ninguna API key', 
          details: ultimoError?.message || 'Todas las claves agotadas' 
        },
        { status: 500 }
      );
    }

    if (!Array.isArray(preguntas)) {
      return NextResponse.json(
        { error: 'La respuesta de Gemini no es un array válido' },
        { status: 500 }
      );
    }

    const preguntasConId = preguntas.map((pregunta, index) => ({
      ...pregunta,
      id: pregunta.id || `ia-${Date.now()}-${index}`
    }));

    return NextResponse.json({
      preguntas: preguntasConId,
      total: preguntasConId.length
    });

  } catch (error) {
    console.error('Error en generar-preguntas:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
