'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, Sparkles, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface GeneradorCursoPDFProps {
  onCursoGenerado: (curso: any) => void;
}

export function GeneradorCursoPDF({ onCursoGenerado }: GeneradorCursoPDFProps) {
  const [archivos, setArchivos] = useState<File[]>([]);
  const [generando, setGenerando] = useState(false);
  const [progreso, setProgreso] = useState('');
  const [porcentaje, setPorcentaje] = useState(0);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleArchivoSeleccionado = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length > 0) {
      setArchivos(pdfFiles);
      setError('');
    } else {
      setError('Por favor selecciona archivos PDF válidos');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length > 0) {
      setArchivos(pdfFiles);
      setError('');
    } else {
      setError('Por favor arrastra archivos PDF válidos');
    }
  };

  const generarCurso = async () => {
    if (archivos.length === 0) return;

    setGenerando(true);
    setError('');
    setProgreso(`Subiendo ${archivos.length} PDF(s)...`);
    setPorcentaje(10);

    // Simular progreso estimado (40-60 segundos aprox)
    let tiempoTranscurrido = 0;
    const intervalo = setInterval(() => {
      tiempoTranscurrido += 5;
      const porcentajeEstimado = Math.min(90, 10 + (tiempoTranscurrido / 60) * 80);
      setPorcentaje(Math.round(porcentajeEstimado));
      
      if (tiempoTranscurrido <= 10) {
        setProgreso('Analizando contenido con IA... (esto puede tomar 40-60 segundos)');
      } else if (tiempoTranscurrido <= 30) {
        setProgreso(`Procesando ${archivos.length} PDF(s) con IA... ${tiempoTranscurrido}s`);
      } else if (tiempoTranscurrido <= 50) {
        setProgreso(`Generando estructura del curso... ${tiempoTranscurrido}s`);
      } else {
        setProgreso(`Finalizando generación... ${tiempoTranscurrido}s`);
      }
    }, 5000);

    try {
      const formData = new FormData();
      archivos.forEach((archivo, index) => {
        formData.append(`pdf${index}`, archivo);
      });
      formData.append('numArchivos', archivos.length.toString());
      
      const response = await fetch('/api/generar-curso-pdf', {
        method: 'POST',
        body: formData
      });

      clearInterval(intervalo);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Error al generar curso');
      }

      setProgreso('¡Curso generado exitosamente!');
      setPorcentaje(100);
      const data = await response.json();
      
      // Pequeña pausa para mostrar éxito
      setTimeout(() => {
        onCursoGenerado({
          curso: data.curso,
          imagenes: data.imagenes || []
        });
        setGenerando(false);
        setArchivos([]);
        setPorcentaje(0);
        if (inputRef.current) inputRef.current.value = '';
      }, 1000);

    } catch (error) {
      clearInterval(intervalo);
      console.error('Error al generar curso:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      setGenerando(false);
      setPorcentaje(0);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-secondary-600 rounded-xl">
          <Sparkles className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Generador de Cursos con IA
          </h2>
          <p className="text-sm text-gray-600">
            Sube un PDF y la IA creará un curso completo automáticamente
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Zona de carga */}
        <div
          className={`border-3 border-dashed rounded-2xl p-8 text-center transition-all ${
            archivos.length > 0
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 bg-gray-50 hover:border-secondary-500 hover:bg-secondary-50'
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            multiple
            onChange={handleArchivoSeleccionado}
            className="hidden"
            id="pdf-upload"
            disabled={generando}
          />
          
          {archivos.length === 0 ? (
            <label htmlFor="pdf-upload" className="cursor-pointer block">
              <Upload className="h-16 w-16 text-secondary-500 mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Click para seleccionar PDF(s)
              </p>
              <p className="text-sm text-gray-500">
                O arrastra y suelta aquí tus archivos PDF
              </p>
            </label>
          ) : (
            <div className="space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              {archivos.map((arch, idx) => (
                <div key={idx} className="flex items-center justify-center gap-3">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold text-gray-900">{arch.name}</span>
                  <span className="text-sm text-gray-600">
                    ({(arch.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              ))}
              {!generando && (
                <button
                  onClick={() => {
                    setArchivos([]);
                    if (inputRef.current) inputRef.current.value = '';
                  }}
                  className="text-sm text-secondary-600 hover:text-secondary-700 font-semibold"
                >
                  Cambiar archivos
                </button>
              )}
            </div>
          )}
        </div>

        {/* Información */}
        <div className="bg-orange-50 border border-secondary-200 rounded-xl p-4">
          <h4 className="font-semibold text-secondary-900 mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            ¿Cómo funciona?
          </h4>
          <ul className="text-sm text-secondary-800 space-y-1">
            <li>• La IA analiza todo el contenido del PDF</li>
            <li>• Extrae texto, imágenes y estructura</li>
            <li>• Genera bloques de lecciones organizadas</li>
            <li>• Crea evaluaciones automáticamente</li>
            <li>• Identifica dónde colocar las imágenes</li>
          </ul>
        </div>

        {/* Progreso */}
        {generando && (
          <div className="bg-white border border-secondary-300 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 text-secondary-600 animate-spin" />
              <span className="font-semibold text-gray-900">{progreso}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progreso estimado</span>
                <span className="font-bold text-secondary-600">{porcentaje}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-secondary-600 transition-all duration-500 ease-out"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-300 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Botón generar */}
        <button
          onClick={generarCurso}
          disabled={archivos.length === 0 || generando}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
            archivos.length > 0 && !generando
              ? 'bg-secondary-600 text-white hover:bg-secondary-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {generando ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              Generando curso...
            </>
          ) : (
            <>
              <Sparkles className="h-6 w-6" />
              Generar Curso con IA
            </>
          )}
        </button>
      </div>
    </div>
  );
}
