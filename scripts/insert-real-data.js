#!/usr/bin/env node

/**
 * Script para insertar datos reales (productos y noticias) en Firebase
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCdilgyg87D9pDIM1Gvs-H5DqtfbTpC3ys",
  authDomain: "rosita-b76eb.firebaseapp.com",
  projectId: "rosita-b76eb",
  storageBucket: "rosita-b76eb.firebasestorage.app",
  messagingSenderId: "778473943709",
  appId: "1:778473943709:web:a44d114c61ab7456f99a74",
  measurementId: "G-JHC9CKT0BS"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Productos reales para insertar
const realProducts = [
  {
    name: "Asado de Tira",
    price: 2800,
    category: "vacuno",
    description: "Corte tradicional argentino, ideal para asado a la parrilla",
    image_url: "/images/products/asado-tira.jpg",
    image: "/images/products/asado-tira.jpg",
    featured: true,
    sale_format: "Por kg",
    stock: 50,
    minimum_kg: 1,
    minimumKg: 1,
    sellBy: "kilo",
    boneOptions: ["con-hueso"],
    formatOptions: ["entero"],
    inStock: true,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    name: "Bife de Chorizo",
    price: 3200,
    category: "vacuno",
    description: "Corte premium, tierno y jugoso",
    image_url: "/images/products/bife-chorizo.jpg",
    image: "/images/products/bife-chorizo.jpg",
    featured: true,
    sale_format: "Por kg",
    stock: 30,
    minimum_kg: 0.5,
    minimumKg: 0.5,
    sellBy: "kilo",
    boneOptions: ["sin-hueso"],
    formatOptions: ["entero"],
    inStock: true,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    name: "Costillas de Cerdo",
    price: 2200,
    category: "cerdo",
    description: "Costillas tiernas, perfectas para barbacoa. Jugosas y sabrosas.",
    image_url: "/images/products/costillas-cerdo.jpg",
    image: "/images/products/costillas-cerdo.jpg",
    featured: true,
    sale_format: "Por kg",
    stock: 35,
    minimum_kg: 1,
    minimumKg: 1,
    sellBy: "kilo",
    boneOptions: ["con-hueso"],
    formatOptions: ["entero"],
    inStock: true,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    name: "Matambre",
    price: 2600,
    category: "vacuno",
    description: "Ideal para matambre relleno o a la pizza",
    image_url: "/images/products/matambre.jpg",
    image: "/images/products/matambre.jpg",
    featured: false,
    sale_format: "Por kg",
    stock: 20,
    minimum_kg: 0.8,
    minimumKg: 0.8,
    sellBy: "kilo",
    boneOptions: ["sin-hueso"],
    formatOptions: ["entero"],
    inStock: true,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    name: "Pollo Entero",
    price: 1800,
    category: "pollo",
    description: "Pollo fresco de granja",
    image_url: "/images/products/pollo-entero.jpg",
    image: "/images/products/pollo-entero.jpg",
    featured: true,
    sale_format: "Por unidad",
    stock: 40,
    minimum_kg: 1.5,
    minimumKg: 1.5,
    sellBy: "unidad",
    boneOptions: ["con-hueso"],
    formatOptions: ["entero"],
    inStock: true,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  }
];

// Noticias reales para insertar
const realNews = [
  {
    title: "Nueva Línea de Cortes Premium",
    slug: "nueva-linea-cortes-premium",
    excerpt: "Descubre nuestra nueva selección de cortes premium seleccionados especialmente para ti.",
    content: `
      <h2>¡Presentamos nuestra nueva línea de cortes premium!</h2>
      <p>En Rosita Carnicería estamos orgullosos de presentar nuestra nueva selección de cortes premium, cuidadosamente seleccionados para ofrecerte la mejor calidad.</p>
      
      <h3>¿Qué incluye esta nueva línea?</h3>
      <ul>
        <li><strong>Cortes Angus:</strong> Carne de la más alta calidad</li>
        <li><strong>Cortes Wagyu:</strong> La experiencia gastronómica definitiva</li>
        <li><strong>Cortes Orgánicos:</strong> Sin conservantes ni aditivos</li>
      </ul>
      
      <p>Visita nuestra tienda y descubre estos increíbles cortes que elevarán tus comidas al siguiente nivel.</p>
    `,
    image_url: "/images/news/cortes-premium.jpg",
    author: "Rosita Carnicería",
    category: "productos",
    tags: ["cortes", "premium", "calidad"],
    is_featured: true,
    is_published: true,
    published_at: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
    created_at: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
    updated_at: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000))
  },
  {
    title: "Horarios Especiales para las Fiestas",
    slug: "horarios-especiales-fiestas",
    excerpt: "Conoce nuestros horarios especiales durante las fiestas de fin de año.",
    content: `
      <h2>Horarios especiales para las fiestas</h2>
      <p>Durante las fiestas de fin de año, hemos ajustado nuestros horarios para brindarte el mejor servicio.</p>
      
      <h3>Horarios de atención:</h3>
      <ul>
        <li><strong>24 de Diciembre:</strong> 8:00 - 14:00</li>
        <li><strong>25 de Diciembre:</strong> Cerrado</li>
        <li><strong>31 de Diciembre:</strong> 8:00 - 14:00</li>
        <li><strong>1 de Enero:</strong> Cerrado</li>
      </ul>
      
      <p>¡Asegúrate de hacer tus pedidos con anticipación para las fiestas!</p>
    `,
    image_url: "/images/news/horarios-fiestas.jpg",
    author: "Rosita Carnicería",
    category: "avisos",
    tags: ["horarios", "fiestas", "navidad"],
    is_featured: false,
    is_published: true,
    published_at: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
    created_at: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
    updated_at: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000))
  },
  {
    title: "Consejos para Conservar Carne Fresca",
    slug: "consejos-conservar-carne-fresca",
    excerpt: "Aprende las mejores técnicas para conservar la frescura y calidad de tu carne.",
    content: `
      <h2>Consejos para conservar carne fresca</h2>
      <p>La conservación adecuada de la carne es fundamental para mantener su sabor, textura y valor nutricional.</p>
      
      <h3>Consejos básicos:</h3>
      <ul>
        <li><strong>Refrigeración:</strong> Mantén la carne entre 0°C y 4°C</li>
        <li><strong>Congelación:</strong> Para almacenamiento prolongado, congela a -18°C</li>
        <li><strong>Embalaje:</strong> Usa papel de carnicería o bolsas herméticas</li>
        <li><strong>Tiempo:</strong> Consume dentro de los tiempos recomendados</li>
      </ul>
      
      <h3>Tiempos de conservación:</h3>
      <ul>
        <li><strong>Refrigerador:</strong> 3-5 días</li>
        <li><strong>Congelador:</strong> 6-12 meses</li>
      </ul>
    `,
    image_url: "/images/news/conservacion-carne.jpg",
    author: "Rosita Carnicería",
    category: "consejos",
    tags: ["conservación", "calidad", "frescura"],
    is_featured: false,
    is_published: true,
    published_at: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    created_at: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
    updated_at: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  }
];

async function insertData() {
  try {
    console.log('🚀 Insertando datos reales en Firebase...\n');
    
    // Insertar productos
    console.log('📦 Insertando productos...');
    for (const product of realProducts) {
      const docRef = await addDoc(collection(db, "products"), product);
      console.log(`✅ Producto creado: "${product.name}" (ID: ${docRef.id})`);
    }
    
    console.log('\n📰 Insertando noticias...');
    // Insertar noticias
    for (const newsItem of realNews) {
      const docRef = await addDoc(collection(db, "news"), newsItem);
      console.log(`✅ Noticia creada: "${newsItem.title}" (ID: ${docRef.id})`);
    }
    
    console.log('\n🎉 ¡Todos los datos han sido insertados exitosamente!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Ve a https://rosita-b76eb.web.app/admin');
    console.log('2. Haz login con ELTETE@gmail.com / DiosesUno33!');
    console.log('3. Ve a "Gestionar Productos" - ¡Ahora podrás editar/eliminar productos reales!');
    console.log('4. Ve a "Gestionar Noticias" - ¡Ahora podrás editar/eliminar noticias reales!');
    console.log('\n✅ Los datos hardcodeados seguirán apareciendo si no hay datos en Firebase.');
    console.log('✅ Pero ahora tendrás datos REALES que SÍ puedes gestionar desde el admin.');
    
  } catch (error) {
    console.error('❌ Error insertando datos:', error);
  }
}

// Ejecutar la inserción
insertData();
