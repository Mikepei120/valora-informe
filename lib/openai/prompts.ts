export const prompts = {
  propertyDescription: (propertyData: any) => `
    Eres un experto redactor inmobiliario. Genera una descripción comercial atractiva y profesional para esta propiedad basándote en los datos proporcionados. 
    Incluye características únicas, ubicación, y beneficios. Longitud: 200-300 palabras.
    
    Datos de la propiedad:
    - Título: ${propertyData.title}
    - Tipo: ${propertyData.property_type}
    - Precio: $${propertyData.price?.toLocaleString()}
    - Habitaciones: ${propertyData.bedrooms}
    - Baños: ${propertyData.bathrooms}
    - Metros cuadrados: ${propertyData.square_feet}
    - Año construcción: ${propertyData.year_built}
    - Dirección: ${propertyData.address?.street}, ${propertyData.address?.city}
    - Características: ${propertyData.features?.join(', ') || 'N/A'}
    - Amenidades: ${propertyData.amenities?.join(', ') || 'N/A'}
    
    Escribe una descripción que destaque el valor y atractivo de la propiedad.
  `,

  marketAnalysis: (propertyData: any) => `
    Eres un analista inmobiliario experto. Genera un análisis de mercado profesional que incluya: 
    tendencias de precios, comparación con propiedades similares, factores de valor, y perspectivas de inversión. 
    Longitud: 300-500 palabras.
    
    Datos de la propiedad:
    - Tipo: ${propertyData.property_type}
    - Precio: $${propertyData.price?.toLocaleString()}
    - Ubicación: ${propertyData.address?.city}, ${propertyData.address?.state}
    - Tamaño: ${propertyData.square_feet} pies cuadrados
    - Habitaciones: ${propertyData.bedrooms}
    - Año: ${propertyData.year_built}
    
    Proporciona un análisis detallado del mercado local y factores que afectan el valor.
  `,

  executiveSummary: (propertyData: any, valuation: number) => `
    Genera un resumen ejecutivo para un informe de valoración que incluya: 
    valoración recomendada, justificación del precio, puntos clave, y nivel de confianza. 
    Longitud: 150-250 palabras.
    
    Valoración estimada: $${valuation.toLocaleString()}
    
    Datos de la propiedad:
    - Título: ${propertyData.title}
    - Tipo: ${propertyData.property_type}
    - Ubicación: ${propertyData.address?.city}
    - Tamaño: ${propertyData.square_feet} pies cuadrados
    - Habitaciones: ${propertyData.bedrooms}
    - Baños: ${propertyData.bathrooms}
    
    Escribe un resumen ejecutivo profesional que justifique la valoración.
  `
}