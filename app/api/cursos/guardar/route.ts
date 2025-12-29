import { NextRequest, NextResponse } from 'next/server';
export async function POST(request: NextRequest) {
  try {
    const curso = await request.json();
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub token no configurado' },
        { status: 500 }
      );
    }
    const owner = 'Cristian0327';
    const repo = 'academia-santafe';
    const path = `public/data/cursos/${curso.id}.json`;
    const content = Buffer.from(JSON.stringify(curso, null, 2)).toString('base64');
    let sha = '';
    try {
      const checkResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          headers: {
            'Authorization': `Bearer ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );
      if (checkResponse.ok) {
        const data = await checkResponse.json();
        sha = data.sha;
      }
    } catch (e) {
    }
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `${sha ? 'Actualizar' : 'Crear'} curso: ${curso.titulo}`,
          content: content,
          ...(sha && { sha }), // Solo incluir sha si existe (actualización)
        }),
      }
    );
    if (!response.ok) {
      const error = await response.text();
      console.error('Error de GitHub:', error);
      return NextResponse.json(
        { error: 'Error al guardar en GitHub', details: error },
        { status: response.status }
      );
    }
    const result = await response.json();
    await actualizarListaCursos(githubToken, owner, repo, curso);
    return NextResponse.json({ 
      success: true, 
      message: 'Curso guardado en GitHub exitosamente',
      commit: result.commit 
    });
  } catch (error: any) {
    console.error('Error al guardar curso:', error);
    return NextResponse.json(
      { error: 'Error al guardar curso', details: error.message },
      { status: 500 }
    );
  }
}
async function actualizarListaCursos(
  token: string, 
  owner: string, 
  repo: string, 
  nuevoCurso: any
) {
  try {
    const path = 'public/data/cursos-list.json';
    const getResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );
    let cursos = [];
    let sha = '';
    if (getResponse.ok) {
      const data = await getResponse.json();
      sha = data.sha;
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      cursos = JSON.parse(content);
    }
    const index = cursos.findIndex((c: any) => c.id === nuevoCurso.id);
    const cursoResumen = {
      id: nuevoCurso.id,
      titulo: nuevoCurso.titulo,
      descripcion: nuevoCurso.descripcion,
      categoria: nuevoCurso.categoria,
      nivel: nuevoCurso.nivel,
      duracion: nuevoCurso.duracion,
      instructor: nuevoCurso.instructor,
      imagen: nuevoCurso.imagen,
      createdAt: nuevoCurso.createdAt || new Date().toISOString(),
    };
    if (index >= 0) {
      cursos[index] = cursoResumen;
    } else {
      cursos.push(cursoResumen);
    }
    const content = Buffer.from(JSON.stringify(cursos, null, 2)).toString('base64');
    await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Actualizar lista de cursos',
          content: content,
          sha: sha,
        }),
      }
    );
  } catch (error) {
    console.error('Error al actualizar lista de cursos:', error);
  }
}
