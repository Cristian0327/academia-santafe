async function testGeminiDirect() {
  const apiKey = 'AIzaSyANJx8rWrtHUzrjFJSYyMPg7VonZkzlyxg';
  
  console.log('Probando Gemini API directamente con HTTP...\n');
  
  // Primero listar modelos disponibles
  try {
    console.log('1. Listando modelos disponibles...');
    const listResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );
    
    if (!listResponse.ok) {
      console.error('Error al listar modelos:', listResponse.status, listResponse.statusText);
      const error = await listResponse.json();
      console.error('Detalles:', JSON.stringify(error, null, 2));
      return;
    }
    
    const models = await listResponse.json();
    console.log('\nModelos disponibles:');
    models.models.forEach(model => {
      console.log(`  - ${model.name}`);
    });
    
    // Intentar generar contenido con el primer modelo disponible
    const modelName = models.models[0].name;
    console.log(`\n2. Probando generación de contenido con ${modelName}...`);
    
    const generateResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Di solo: "Funciona correctamente"'
            }]
          }]
        })
      }
    );
    
    if (!generateResponse.ok) {
      console.error('\n❌ Error:', generateResponse.status, generateResponse.statusText);
      const error = await generateResponse.json();
      console.error('Detalles:', JSON.stringify(error, null, 2));
      return;
    }
    
    const result = await generateResponse.json();
    const text = result.candidates[0].content.parts[0].text;
    
    console.log('\n✅ ÉXITO! Respuesta:', text);
    console.log(`\nUsa el modelo: ${modelName.replace('models/', '')}`);
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
  }
}

testGeminiDirect();
