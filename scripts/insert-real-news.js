#!/usr/bin/env node

/**
 * Script para insertar noticias reales en Firebase
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
  },
  {
    title: "Promoción Especial: 20% de Descuento en Pollo",
    slug: "promocion-descuento-pollo",
    excerpt: "Aprovecha esta increíble oferta en todos nuestros cortes de pollo fresco.",
    content: `
      <h2>¡Promoción especial en pollo!</h2>
      <p>Esta semana tenemos una oferta imperdible en todos nuestros cortes de pollo fresco.</p>
      
      <h3>Detalles de la promoción:</h3>
      <ul>
        <li><strong>Descuento:</strong> 20% en todos los cortes de pollo</li>
        <li><strong>Válido hasta:</strong> Domingo 15 de diciembre</li>
        <li><strong>Productos incluidos:</strong> Muslos, pechugas, alas y pollo entero</li>
      </ul>
      
      <p>¡No te pierdas esta oportunidad de disfrutar pollo fresco a un precio increíble!</p>
    `,
    image_url: "/images/news/promocion-pollo.jpg",
    author: "Rosita Carnicería",
    category: "promociones",
    tags: ["promoción", "pollo", "descuento"],
    is_featured: true,
    is_published: true,
    published_at: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    created_at: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    updated_at: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
  },
  {
    title: "Nuevos Horarios de Atención",
    slug: "nuevos-horarios-atencion",
    excerpt: "Actualizamos nuestros horarios para brindarte un mejor servicio.",
    content: `
      <h2>Nuevos horarios de atención</h2>
      <p>Hemos actualizado nuestros horarios para brindarte un servicio más conveniente.</p>
      
      <h3>Horarios actualizados:</h3>
      <ul>
        <li><strong>Lunes a Viernes:</strong> 8:00 - 20:00</li>
        <li><strong>Sábados:</strong> 8:00 - 18:00</li>
        <li><strong>Domingos:</strong> 9:00 - 14:00</li>
      </ul>
      
      <p>¡Te esperamos en nuestros nuevos horarios para servirte mejor!</p>
    `,
    image_url: "/images/news/horarios-atencion.jpg",
    author: "Rosita Carnicería",
    category: "avisos",
    tags: ["horarios", "atención", "servicio"],
    is_featured: false,
    is_published: true,
    published_at: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    created_at: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    updated_at: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))
  }
];

async function insertNews() {
  try {
    console.log('📰 Insertando noticias reales en Firebase...');
    
    for (const newsItem of realNews) {
      const docRef = await addDoc(collection(db, "news"), newsItem);
      console.log(`✅ Noticia creada: "${newsItem.title}" (ID: ${docRef.id})`);
    }
    
    console.log('\n🎉 ¡Todas las noticias han sido insertadas exitosamente!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Ve a https://rosita-b76eb.web.app/admin');
    console.log('2. Haz login con ELTETE@gmail.com / DiosesUno33!');
    console.log('3. Ve a "Gestionar Noticias"');
    console.log('4. ¡Ahora podrás ver, editar y eliminar las noticias reales!');
    
  } catch (error) {
    console.error('❌ Error insertando noticias:', error);
  }
}

// Ejecutar la inserción
insertNews();
