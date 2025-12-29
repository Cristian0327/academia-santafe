// Script para listar modelos disponibles en Gemini API
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyANJx8rWrtHUzrjFJSYyMPg7VonZkzlyxg');

async function listarModelos() {
  try {
    console.log('🔍 Listando modelos disponibles...\n');
    
    // Intentar diferentes modelos comunes
    const modelosParaProbar = [
      'gemini-2.0-flash-exp',
      'gemini-2.0-flash-thinking-exp',
      'gemini-2.5-flash',
      'gemini-2.5-flash-exp',
      'gemini-2.5-pro',
      'gemini-exp-1206',
      'learnlm-1.5-pro-experimental',
      'gemini-1.5-flash-002',
      'gemini-1.5-pro-002'
    ];

    for (const nombreModelo of modelosParaProbar) {
      try {
        const model = genAI.getGenerativeModel({ model: nombreModelo });
        const result = await model.generateContent('Hola');
        console.log(`✅ ${nombreModelo} - FUNCIONA`);
      } catch (error) {
        if (error.message?.includes('404')) {
          console.log(`❌ ${nombreModelo} - No existe (404)`);
        } else if (error.message?.includes('429')) {
          console.log(`⚠️ ${nombreModelo} - Existe pero límite alcanzado (429)`);
        } else {
          console.log(`❓ ${nombreModelo} - Error: ${error.message?.substring(0, 60)}`);
        }
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listarModelos();
