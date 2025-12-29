# 🤖 Cómo Obtener tu API Key de Google Gemini (GRATIS)

## 📋 Pasos para obtener la API Key

### 1. Ve a Google AI Studio
🔗 https://aistudio.google.com/app/apikey

### 2. Inicia sesión con tu cuenta de Google
- Usa cualquier cuenta de Gmail
- No necesitas tarjeta de crédito

### 3. Click en "Create API Key"
- Aparecerá un botón azul que dice **"Create API key"**
- Click ahí

### 4. Selecciona o crea un proyecto
- Puedes crear un proyecto nuevo llamado "Academia Santafe"
- O usar un proyecto existente

### 5. Copia tu API Key
- Se generará una key que empieza con `AIza...`
- Copia toda la key completa

### 6. Pégala en el archivo `.env.local`
```env
GEMINI_API_KEY=AIzaSyDc_tu_key_aqui_ejemplo
```

---

## ✅ Verificar que funciona

1. Guarda el archivo `.env.local`
2. Reinicia el servidor: detén con `Ctrl+C` y vuelve a ejecutar `npm run dev`
3. Ve a **Admin Cursos**
4. Click en el botón morado **"Generar con IA desde PDF"**
5. Sube un PDF de prueba
6. ¡Listo! La IA generará el curso automáticamente

---

## 💰 Límites GRATIS

- ✅ **1,500 requests por día** GRATIS
- ✅ **1 millón de tokens** de contexto (PDFs gigantes)
- ✅ Sin tarjeta de crédito
- ✅ Sin expiración

---

## 🎯 Qué hace el sistema

1. **Subes un PDF** (manual técnico, curso, guía, etc.)
2. **Gemini AI analiza:**
   - Todo el texto del PDF
   - Todas las imágenes y gráficas
   - La estructura y organización
3. **Genera automáticamente:**
   - Título atractivo del curso
   - Descripción profesional
   - Bloques de lecciones organizadas
   - Contenido formateado en HTML
   - Evaluaciones con preguntas
   - Identifica dónde colocar cada imagen
4. **Tú revisas y editas** antes de publicar

---

## 🚨 Si tienes problemas

### Error: "API key de Gemini no configurada"
- Verifica que copiaste bien la key en `.env.local`
- Verifica que NO tenga espacios al inicio o final
- Reinicia el servidor después de agregar la key

### Error: "Invalid API key"
- La key debe empezar con `AIza`
- Copia la key completa
- Genera una nueva key si es necesario

### Error al procesar PDF
- El PDF debe ser texto (no imagen escaneada)
- Tamaño máximo recomendado: 20 MB
- Usa PDFs con contenido educativo/técnico

---

## 📞 Soporte

Si necesitas ayuda:
1. Verifica que la key esté en `.env.local`
2. Reinicia el servidor
3. Prueba con un PDF pequeño primero (2-5 páginas)

---

**¡Listo para crear cursos automáticamente con IA! 🚀**
