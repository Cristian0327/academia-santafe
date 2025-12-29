const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  const apiKey = 'AIzaSyANJx8rWrtHUzrjFJSYyMPg7VonZkzlyxg';
  const genAI = new GoogleGenerativeAI(apiKey);
  
  console.log('Probando conexión a Gemini API...\n');
  
  try {
    // Listar modelos disponibles
    console.log('Obteniendo lista de modelos...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    console.log('Enviando prompt de prueba...');
    const result = await model.generateContent('Di solo "Funciona correctamente"');
    const response = result.response;
    const text = response.text();
    
    console.log('\n✅ ÉXITO! Respuesta:', text);
    console.log('\nLa API key funciona correctamente.');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.status) {
      console.error('Status:', error.status);
    }
  }
}

testGemini();
