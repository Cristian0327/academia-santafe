# Academia Santafé

Plataforma educativa para gestión de cursos, inscripciones y certificados.

## 🌐 Acceso a la Plataforma

- **Sitio Web**: https://academia-santafe.vercel.app
- **Admin de Cursos**: https://academia-santafe.vercel.app/AdminCursos

### 🔑 URLs Importantes:
```
Home: https://academia-santafe.vercel.app
Lista de Cursos: https://academia-santafe.vercel.app/cursos
Agregar/Editar Cursos: https://academia-santafe.vercel.app/AdminCursos
Panel Admin: https://academia-santafe.vercel.app/admin
Reportes: https://academia-santafe.vercel.app/admin/reportes
```

## 🚀 Tecnologías

- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Supabase** - Base de datos y autenticación
- **NextAuth.js** - Autenticación
- **jsPDF** - Generación de certificados

## 📋 Características

- ✅ Gestión de cursos con lecciones y evaluaciones
- ✅ Sistema de inscripciones
- ✅ Generación automática de certificados
- ✅ Panel de administración
- ✅ Transcripción de videos de YouTube
- ✅ Evaluaciones interactivas
- ✅ Generación de cursos desde PDFs

## 🔧 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Cristian0327/academia-santafe.git

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env.local con las siguientes variables:
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=tu-secret-aqui
# NEXT_PUBLIC_SUPABASE_URL=tu-supabase-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-supabase-key
# GEMINI_API_KEY=tu-gemini-api-key
# GEMINI_API_KEY_2=tu-gemini-api-key-2
# OPENAI_API_KEY=tu-openai-api-key

# Ejecutar en desarrollo
npm run dev
```

## 🌐 Deploy en Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Cristian0327/academia-santafe)

1. Haz clic en el botón "Deploy with Vercel"
2. Conecta tu cuenta de GitHub
3. Configura las variables de entorno
4. ¡Listo!

### Variables de entorno requeridas en Vercel:

- `NEXTAUTH_URL` - URL de tu aplicación (e.g., https://tu-app.vercel.app)
- `NEXTAUTH_SECRET` - Secret para NextAuth (genera uno con `openssl rand -base64 32`)
- `NEXT_PUBLIC_SUPABASE_URL` - URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key de Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key de Supabase
- `GEMINI_API_KEY` - API key de Google Gemini
- `GEMINI_API_KEY_2` - API key secundaria de Gemini (opcional)
- `OPENAI_API_KEY` - API key de OpenAI (opcional)

## 📦 Estructura del Proyecto

```
academia-santafe/
├── app/                    # Páginas y rutas de Next.js
│   ├── api/               # API routes
│   ├── admin/             # Panel de administración
│   ├── curso/             # Vista de cursos
│   └── cursos/            # Listado de cursos
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y configuraciones
├── public/                # Archivos estáticos
│   └── data/             # Datos de cursos
└── types/                 # Tipos de TypeScript
```

## 🔐 Configuración de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta el archivo SQL `habilitar-permisos-supabase.sql`
3. Configura las variables de entorno

## 📝 Licencia

Este proyecto es privado y de uso exclusivo de Academia Santafé.

## 👨‍💻 Autor

Cristian - [GitHub](https://github.com/Cristian0327)
