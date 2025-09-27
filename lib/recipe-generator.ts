interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

// Recetas tradicionales argentinas por corte
const traditionalRecipes: Record<string, string> = {
  Asado: `**🥩 ASADO TRADICIONAL ARGENTINO**

**Ingredientes:**
• 2-3 kg de asado
• Sal gruesa
• Chimichurri (perejil, ajo, aceite, vinagre, orégano)
• Carbón o leña

**Preparación:**
1. Encendé el fuego 1 hora antes de cocinar
2. Sazoná la carne con sal gruesa 30 minutos antes
3. Colocá el asado con el hueso hacia abajo primero
4. Cociná 45 minutos de cada lado a fuego medio
5. Controlá que no se queme, moviendo si es necesario

**Tiempo:** 2-3 horas total
**Dificultad:** Media
**Porciones:** 6-8 personas

**Consejos del Chef:**
• El fuego debe estar "a punto" (sin llama, solo brasas)
• No pinches la carne para que no pierda jugos
• Acompañá con ensalada criolla y papas al plomo`,

  "Bife de Chorizo": `**🥩 BIFE DE CHORIZO A LA PARRILLA**

**Ingredientes:**
• 4 bifes de chorizo (200g c/u)
• Sal gruesa
• Pimienta negra
• Manteca
• Ajo

**Preparación:**
1. Sacá la carne de la heladera 30 min antes
2. Sazoná con sal y pimienta
3. Cociná 3-4 minutos de cada lado en parrilla bien caliente
4. Agregá un toque de manteca y ajo al final

**Tiempo:** 15 minutos
**Dificultad:** Fácil
**Porciones:** 4 personas

**Consejos del Chef:**
• Para punto medio: 4 min de cada lado
• Dejá reposar 2 minutos antes de servir
• Ideal con papas fritas y ensalada mixta`,

  Vacío: `**🥩 VACÍO A LA PARRILLA**

**Ingredientes:**
• 1.5 kg de vacío
• Sal gruesa
• Chimichurri
• Limón

**Preparación:**
1. Hacé cortes superficiales en la grasa
2. Sazoná con sal gruesa
3. Cociná primero del lado de la grasa (20 min)
4. Dá vuelta y cociná 15 min más
5. Cortá en diagonal contra la fibra

**Tiempo:** 45 minutos
**Dificultad:** Media
**Porciones:** 4-6 personas

**Consejos del Chef:**
• La grasa debe quedar dorada y crocante
• Cortá siempre contra la fibra
• Perfecto con provoleta de entrada`,

  Entraña: `**🥩 ENTRAÑA MARINADA**

**Ingredientes:**
• 1 kg de entraña
• Sal gruesa
• Aceite de oliva
• Ajo picado
• Perejil
• Limón

**Preparación:**
1. Mariná la entraña 2 horas con aceite, ajo y perejil
2. Cociná 3-4 minutos de cada lado a fuego fuerte
3. Debe quedar jugosa por dentro
4. Cortá en diagonal

**Tiempo:** 15 minutos (+ marinado)
**Dificultad:** Fácil
**Porciones:** 3-4 personas

**Consejos del Chef:**
• No la cocines de más, se pone dura
• Ideal punto medio a jugoso
• Excelente con chimichurri picante`,

  Bondiola: `**🐷 BONDIOLA AL HORNO**

**Ingredientes:**
• 1.5 kg de bondiola
• Sal, pimienta, pimentón
• Cebolla
• Vino blanco
• Hierbas (romero, tomillo)

**Preparación:**
1. Sazoná la bondiola con especias
2. Sellá en sartén por todos lados
3. Cociná en horno a 180°C por 1 hora
4. Agregá cebolla y vino a mitad de cocción

**Tiempo:** 1.5 horas
**Dificultad:** Media
**Porciones:** 6 personas

**Consejos del Chef:**
• Controlá que la temperatura interna llegue a 65°C
• Dejá reposar 10 minutos antes de cortar
• Ideal con puré de papas y verduras asadas`,

  "Pollo Entero": `**🐔 POLLO AL HORNO TRADICIONAL**

**Ingredientes:**
• 1 pollo entero (2 kg)
• Sal, pimienta, pimentón
• Limón
• Ajo
• Papas
• Cebolla

**Preparación:**
1. Sazoná el pollo por dentro y fuera
2. Rellenalo con limón y ajo
3. Rodealo con papas y cebolla
4. Horno a 200°C por 1 hora y 15 min

**Tiempo:** 1.5 horas
**Dificultad:** Fácil
**Porciones:** 4-6 personas

**Consejos del Chef:**
• Pincelá con su propio jugo cada 20 minutos
• La piel debe quedar dorada y crocante
• Perfecto para almuerzo familiar dominical`,
}

// Respuestas personalizadas según palabras clave
const personalizedResponses: Record<string, (productName: string) => string> = {
  rápido: (product) => `**⚡ RECETA RÁPIDA: ${product.toUpperCase()}**

Para algo rápido te recomiendo:

**A la plancha (10 minutos):**
• Cortá en porciones individuales
• Sal y pimienta
• Plancha bien caliente con un toque de aceite
• 3-4 minutos de cada lado

**Consejos express:**
• Carne a temperatura ambiente antes de cocinar
• No muevas mucho, dejá que se selle
• Acompañá con ensalada ya preparada

¡Listo en menos de 15 minutos!`,

  horno: (product) => `**🔥 ${product.toUpperCase()} AL HORNO**

**Preparación al horno:**
• Precalentá a 180°C
• Sazoná bien la carne
• Agregá verduras (cebolla, zanahoria, apio)
• Un chorrito de vino o caldo
• Papel aluminio los primeros 30 min

**Tiempos aproximados:**
• Cortes tiernos: 25-30 min por kg
• Cortes duros: 45-60 min por kg

**Tip:** Usá termómetro para carne - 60°C punto medio`,

  parrilla: (product) => `**🔥 ${product.toUpperCase()} A LA PARRILLA**

**Técnica parrillera:**
• Fuego medio, sin llama
• Sal gruesa 30 min antes
• Sellá primero a fuego fuerte
• Terminá a fuego suave
• No pinches la carne

**El secreto:** Paciencia y fuego parejo
**Acompañamiento clásico:** Chimichurri y ensalada criolla`,

  cebolla: (product) => `**🧅 ${product.toUpperCase()} CON CEBOLLA**

**Preparación:**
• Cortá 2-3 cebollas en juliana
• Rehogá hasta que estén transparentes
• Agregá la carne sazonada
• Cociná junto hasta que esté tierna
• Un toque de vino blanco al final

**Resultado:** Sabor dulce de la cebolla caramelizada que realza la carne
**Perfecto con:** Puré de papas o arroz blanco`,

  ajo: (product) => `**🧄 ${product.toUpperCase()} AL AJO**

**Marinada de ajo:**
• 4-5 dientes de ajo picados
• Aceite de oliva
• Perejil fresco
• Sal y pimienta
• Mariná 1-2 horas mínimo

**Cocción:**
• Cociná la carne con la marinada
• El ajo se dora y perfuma todo
• Agregá más ajo fresco al servir

**Tip:** No quemes el ajo, se pone amargo`,
}

export async function generateSurpriseRecipe(productName: string): Promise<string> {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Buscar receta específica o usar genérica
  const recipe = traditionalRecipes[productName] || generateGenericRecipe(productName)

  return recipe
}

export async function generateRecipe(productName: string, userInput: string, messages: Message[]): Promise<string> {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const input = userInput.toLowerCase()

  // Buscar palabras clave en el input del usuario
  for (const [keyword, responseGenerator] of Object.entries(personalizedResponses)) {
    if (input.includes(keyword)) {
      return responseGenerator(productName)
    }
  }

  // Si no hay palabras clave específicas, dar consejos generales
  return `**👨‍🍳 CONSEJOS PARA ${productName.toUpperCase()}**

Basándome en tu consulta sobre "${userInput}", te recomiendo:

**Preparación básica:**
• Sazoná con sal y pimienta
• Dejá que tome temperatura ambiente
• Cociná a fuego medio-alto para sellar
• Controlá la cocción según tu gusto

**¿Querés algo más específico?**
Podés preguntarme sobre:
• Cocción rápida
• Al horno
• A la parrilla  
• Con ingredientes específicos (cebolla, ajo, etc.)

¡Estoy acá para ayudarte a que salga perfecto!`
}

function generateGenericRecipe(productName: string): string {
  return `**🍖 RECETA TRADICIONAL: ${productName.toUpperCase()}**

**Ingredientes básicos:**
• ${productName}
• Sal gruesa
• Pimienta negra
• Aceite o manteca
• Ajo (opcional)

**Preparación:**
1. Sazoná la carne 30 minutos antes
2. Cociná a fuego medio-alto
3. Sellá por ambos lados
4. Ajustá el tiempo según el grosor
5. Dejá reposar antes de servir

**Tiempo:** 20-30 minutos
**Dificultad:** Fácil
**Acompañamientos:** Ensalada, papas, verduras

**Consejo del Chef:**
Cada corte tiene su técnica ideal. ¡Preguntame por detalles específicos!`
}
