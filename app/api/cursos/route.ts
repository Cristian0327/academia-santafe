import { NextResponse } from 'next/server';
import { supabaseHelpers } from '@/lib/supabase';

export async function GET() {
  try {
    const cursos = await supabaseHelpers.obtenerCursos();
    return NextResponse.json(cursos);
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    return NextResponse.json({ error: 'Error al obtener cursos' }, { status: 500 });
  }
}
