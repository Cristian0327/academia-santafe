import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get('videoId');
  if (!videoId) {
    return NextResponse.json(
      { error: 'videoId es requerido' },
      { status: 400 }
    );
  }
  try {
    const YoutubeTranscript = require('youtube-transcript');
    const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: 'es' // Priorizar español
    }).catch(() => {
      return YoutubeTranscript.fetchTranscript(videoId);
    });
    if (!transcript || transcript.length === 0) {
      return NextResponse.json(
        { 
          error: 'No hay subtítulos disponibles',
          message: 'Este video no tiene subtítulos habilitados.'
        },
        { status: 404 }
      );
    }
    const segments = transcript.map((item: any) => ({
      time: item.offset / 1000, // Convertir ms a segundos
      duration: item.duration / 1000,
      text: item.text
    }));
    return NextResponse.json({ segments });
  } catch (error: any) {
    console.error('Error en scraping de transcripción:', error);
    return NextResponse.json(
      { 
        error: 'Error al obtener transcripción',
        message: error.message || 'No se pudo obtener la transcripción del video.',
        hint: 'Este método puede fallar si YouTube cambia su estructura. Considera usar la API oficial de YouTube.'
      },
      { status: 500 }
    );
  }
}
