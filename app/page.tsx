'use client';
import Link from 'next/link';
import { ArrowRight, BookOpen, Play, CheckCircle, GraduationCap, Clock, Users, ChevronUp, TrendingUp } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AnimatedLogo } from '@/components/AnimatedLogo';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import apiClient from '@/lib/api-client';
import { supabase } from '@/lib/supabase';
export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [cursos, setCursos] = useState<any[]>([]);
  const [stats, setStats] = useState({
    cursos: 0,
    estudiantes: 0,
    satisfaccion: 0
  });
  useEffect(() => {
    const cargarCursos = async () => {
      try {
        const cursosData = await apiClient.listarCursos();
        const cursosActivos = cursosData
          .filter((curso: any) => curso.activo === true)
          .sort((a: any, b: any) => {
            const fechaA = a.created_at || a.createdAt || '1970-01-01';
            const fechaB = b.created_at || b.createdAt || '1970-01-01';
            return new Date(fechaB).getTime() - new Date(fechaA).getTime();
          })
          .slice(0, 3);
        setCursos(cursosActivos);
      } catch (error) {
        console.error('Error al cargar cursos:', error);
        setCursos([]);
      }
    };
    const cargarEstadisticas = async () => {
      try {
        console.log('🔄 Cargando estadísticas...');
        const cursosData = await apiClient.listarCursos();
        console.log('📚 Cursos obtenidos:', cursosData);
        const cursosCount = cursosData.length;
        
        const { data: estudiantes, error: estudiantesError } = await supabase.from('estudiantes').select('documento');
        if (estudiantesError) console.error('Error estudiantes:', estudiantesError);
        const estudiantesCount = estudiantes?.length || 0;
        
        const { data: evaluaciones, error: evaluacionesError } = await supabase.from('evaluaciones').select('calificacion');
        if (evaluacionesError) console.error('Error evaluaciones:', evaluacionesError);
        
        let satisfaccionPromedio = 0;
        if (evaluaciones && evaluaciones.length > 0) {
          const suma = evaluaciones.reduce((acc: number, ev: any) => acc + (ev.calificacion || 0), 0);
          satisfaccionPromedio = Math.round((suma / evaluaciones.length / 100) * 100);
        }
        
        const nuevasStats = {
          cursos: cursosCount,
          estudiantes: estudiantesCount,
          satisfaccion: satisfaccionPromedio
        };
        
        console.log('📊 Estadísticas calculadas:', nuevasStats);
        setStats(nuevasStats);
      } catch (error) {
        console.error('❌ Error al cargar estadísticas:', error);
        setStats({ cursos: 0, estudiantes: 0, satisfaccion: 0 });
      }
    };
    cargarCursos();
    cargarEstadisticas();
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setTimeout(() => {
        setShowContent(true);
      }, 50);
    }, 1850);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (showSplash) return;
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);
    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(el => observer.observe(el));
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showSplash]);
  return (
    <>
      {}
      {showSplash && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white splash-screen">
          <div className="logo-container">
            <AnimatedLogo />
          </div>
        </div>
      )}
      <div className={`min-h-screen bg-gray-50 transition-opacity duration-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar />
      {}
      <section className="relative bg-primary-600 text-white py-24 overflow-hidden">
        {}
        <div className="absolute top-20 right-20 w-64 h-64 bg-secondary-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-800 rounded-full opacity-10 blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Impulsa tu desarrollo profesional
              </h1>
              <p className="text-xl text-primary-50">
                Capacitación continua para el personal de Ladrillera Santafé. Aprende, crece y certifícate desde cualquier lugar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/cursos" 
                  className="group bg-secondary-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-secondary-600 transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/cursos" 
                  className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 inline-flex items-center justify-center hover:scale-105 shadow-lg"
                >
                  Ver Cursos
                </Link>
              </div>
              <div className="pt-8 flex flex-col sm:flex-row gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="text-primary-50">Sin costo para colaboradores</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="text-primary-50">Certificación oficial</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block animate-slide-in">
              <div className="group relative bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="bg-secondary-500 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg icon-container">
                  <GraduationCap className="h-10 w-10 text-white icon-animate" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">Aprende a tu ritmo</h3>
                <p className="text-gray-600 text-lg">Accede desde cualquier dispositivo, en cualquier momento, 24/7</p>
                <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                    <span>Flexible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span>Profesional</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            <div className="text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center mb-2 gap-1 sm:gap-0">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600 sm:mr-2" />
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-600">
                  {stats.cursos > 0 ? `${stats.cursos}+` : '0+'}
                </div>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 font-semibold">Cursos</p>
            </div>
            <div className="text-center border-x border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-center mb-2 gap-1 sm:gap-0">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600 sm:mr-2" />
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-600">
                  {stats.estudiantes > 0 ? `${stats.estudiantes}+` : '0+'}
                </div>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 font-semibold">Estudiantes</p>
            </div>
            <div className="text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center mb-2 gap-1 sm:gap-0">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600 sm:mr-2" />
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-600">
                  {stats.satisfaccion}%
                </div>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 font-semibold">Satisfacción</p>
            </div>
          </div>
        </div>
      </section>
      {}
      <section className="py-20 bg-white animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Academia Santafé?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Plataforma diseñada para el crecimiento profesional de nuestros colaboradores
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="group bg-secondary-500 rounded-2xl p-6 sm:p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 scroll-reveal">
              <div className="bg-white/20 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-4 sm:mb-6 icon-container">
                <BookOpen className="h-7 w-7 sm:h-8 sm:w-8 icon-animate" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Contenido de Calidad</h3>
              <p className="text-white/90 text-sm sm:text-base">
                Cursos diseñados por expertos de la industria, actualizados constantemente con las mejores prácticas.
              </p>
            </div>
            <div className="group bg-primary-500 rounded-2xl p-6 sm:p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 scroll-reveal">
              <div className="bg-white/20 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-4 sm:mb-6 icon-container">
                <Clock className="h-7 w-7 sm:h-8 sm:w-8 icon-animate" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Horarios Flexibles</h3>
              <p className="text-white/90 text-sm sm:text-base">
                Aprende cuando quieras, desde donde quieras. Compatibiliza tu formación con tu trabajo diario.
              </p>
            </div>
            <div className="group bg-secondary-500 rounded-2xl p-6 sm:p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 scroll-reveal sm:col-span-2 lg:col-span-1">
              <div className="bg-white/20 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-4 sm:mb-6 icon-container">
                <GraduationCap className="h-7 w-7 sm:h-8 sm:w-8 icon-animate" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Certificaciones</h3>
              <p className="text-white/90 text-sm sm:text-base">
                Obtén certificados oficiales que validan tus nuevas habilidades y conocimientos adquiridos.
              </p>
            </div>
          </div>
        </div>
      </section>
      {}
      <section id="cursos" className="py-20 bg-gray-50 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comienza tu aprendizaje hoy
            </h2>
            <p className="text-xl text-gray-600">
              Explora nuestros cursos y comienza a desarrollar nuevas habilidades
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {cursos.length > 0 ? (
              cursos.map((curso, index) => (
                <Link
                  key={curso.id}
                  href={`/curso/${curso.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 scroll-reveal"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="h-48 sm:h-52 bg-primary-500 flex items-center justify-center relative">
                    {curso.imagen_portada ? (
                      <img 
                        src={curso.imagen_portada} 
                        alt={curso.titulo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen className="h-16 w-16 text-white opacity-80" />
                    )}
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="px-2.5 py-1 bg-secondary-100 text-secondary-700 rounded-full text-xs sm:text-sm font-semibold">
                        {curso.categoria || 'General'}
                      </span>
                      {curso.nivel && (
                        <span className="px-2.5 py-1 bg-primary-100 text-primary-700 rounded-full text-xs sm:text-sm font-semibold">
                          {curso.nivel}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">{curso.titulo}</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">
                      {curso.descripcion}
                    </p>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{curso.duracion || 'Variable'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{curso.instructor || 'Experto'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 scroll-reveal">
                  <div className="h-48 bg-primary-500 flex items-center justify-center">
                    <Play className="h-16 w-16 text-white opacity-80" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold">
                        Nuevo
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Cursos Disponibles Próximamente</h3>
                    <p className="text-gray-600 mb-4">
                      Estamos preparando contenido de calidad para ti. Mantente atento a las próximas actualizaciones.
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Por definir</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>Pronto</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 scroll-reveal">
                  <div className="h-48 bg-secondary-500 flex items-center justify-center">
                    <GraduationCap className="h-16 w-16 text-white opacity-80" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                        Próximamente
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Contenido en Desarrollo</h3>
                    <p className="text-gray-600 mb-4">
                      Nuestro equipo está trabajando en cursos especializados para mejorar tus competencias profesionales.
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>En preparación</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>Todos los niveles</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 scroll-reveal">
                  <div className="h-48 bg-primary-500 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-white opacity-80" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold">
                        Próximamente
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Más Cursos en Camino</h3>
                    <p className="text-gray-600 mb-4">
                      Continuamente agregamos nuevo contenido para mantenerte actualizado en tu área de especialización.
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Por anunciar</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>Interactivo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="text-center mt-12">
            <Link 
              href="/cursos"
              className="inline-flex items-center gap-2 bg-secondary-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-secondary-600 hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Ver Todos los Cursos
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
      {}
      <section className="py-20 bg-primary-600 text-white animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para comenzar tu viaje de aprendizaje?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Únete a Academia Santafé y comienza a desarrollar las habilidades que impulsarán tu carrera
          </p>
          <Link 
            href="/cursos"
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            Comenzar Ahora Gratis
            <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </section>
      {}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 bg-secondary-500 text-white p-4 rounded-full shadow-2xl hover:bg-secondary-600 transition-all duration-300 hover:scale-110 animate-fade-in"
          aria-label="Volver arriba"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
      <Footer />
      </div>
    </>
  );
}
