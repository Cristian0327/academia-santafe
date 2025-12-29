import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
export async function POST(request: Request) {
  try {
    const { tipo, titulo, mensaje, cursoId } = await request.json();
    const usersFile = path.join(process.cwd(), 'data', 'users.json');
    if (!fs.existsSync(usersFile)) {
      return NextResponse.json({ success: false, message: 'No hay usuarios registrados' });
    }
    const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    const userIds = Object.keys(usersData);
    const notifDir = path.join(process.cwd(), 'data', 'notificaciones');
    if (!fs.existsSync(notifDir)) {
      fs.mkdirSync(notifDir, { recursive: true });
    }
    const notificacion = {
      id: Date.now().toString(),
      tipo,
      titulo,
      mensaje,
      cursoId,
      leida: false,
      fecha: new Date().toISOString()
    };
    let notificacionesEnviadas = 0;
    userIds.forEach(userId => {
      const userNotifFile = path.join(notifDir, `${userId}.json`);
      let notificaciones = [];
      if (fs.existsSync(userNotifFile)) {
        try {
          notificaciones = JSON.parse(fs.readFileSync(userNotifFile, 'utf8'));
        } catch (error) {
          console.error('Error leyendo notificaciones de usuario:', error);
        }
      }
      notificaciones.unshift({
        ...notificacion,
        id: `${notificacion.id}_${userId}` // ID único por usuario
      });
      fs.writeFileSync(userNotifFile, JSON.stringify(notificaciones, null, 2), 'utf8');
      notificacionesEnviadas++;
    });
    console.log(`📢 Notificación enviada a ${notificacionesEnviadas} usuarios:`, titulo);
    return NextResponse.json({ 
      success: true, 
      message: `Notificación enviada a ${notificacionesEnviadas} usuarios`,
      count: notificacionesEnviadas
    });
  } catch (error) {
    console.error('Error enviando notificaciones:', error);
    return NextResponse.json({ success: false, message: 'Error al enviar notificaciones' }, { status: 500 });
  }
}
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ notificaciones: [] });
    }
    const notifFile = path.join(process.cwd(), 'data', 'notificaciones', `${userId}.json`);
    if (!fs.existsSync(notifFile)) {
      return NextResponse.json({ notificaciones: [] });
    }
    const notificaciones = JSON.parse(fs.readFileSync(notifFile, 'utf8'));
    return NextResponse.json({ notificaciones });
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    return NextResponse.json({ notificaciones: [] });
  }
}
