const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCdilgyg87D9pDIM1Gvs-H5DqtfbTpC3ys",
  authDomain: "rosita-b76eb.firebaseapp.com",
  projectId: "rosita-b76eb",
  storageBucket: "rosita-b76eb.firebasestorage.app",
  messagingSenderId: "778473943709",
  appId: "1:778473943709:web:a44d114c61ab7456f99a74"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Productos de la carnicería con imágenes reales
const products = [
  {
    name: "Asado de Tira",
    price: 2800,
    category: "vacuno",
    description: "Corte tradicional argentino, ideal para asado a la parrilla. Tierno y jugoso, perfecto para compartir en familia.",
    image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
    featured: true,
    sale_format: "Por kg",
    stock: 50,
    minimum_kg: 1,
    minimumKg: 1,
    sellBy: "kilo",
    boneOptions: ["con-hueso"],
    formatOptions: ["entero"],
    inStock: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: "Bife de Chorizo",
    price: 3200,
    category: "vacuno",
    description: "Corte premium, tierno y jugoso. Uno de los cortes más apreciados de la res.",
    image_url: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop",
    featured: true,
    sale_format: "Por kg",
    stock: 30,
    minimum_kg: 0.5,
    minimumKg: 0.5,
    sellBy: "kilo",
    boneOptions: ["sin-hueso"],
    formatOptions: ["entero"],
    inStock: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: "Vacío",
    price: 2900,
    category: "vacuno",
    description: "Corte magro y sabroso, perfecto para parrilla. Ideal para asados y barbacoas.",
    image_url: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop",
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop",
    featured: true,
    sale_format: "Por kg",
    stock: 25,
    minimum_kg: 1,
    minimumKg: 1,
    sellBy: "kilo",
    boneOptions: ["sin-hueso"],
    formatOptions: ["entero"],
    inStock: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: "Matambre",
    price: 2600,
    category: "vacuno",
    description: "Ideal para matambre relleno o a la pizza. Corte versátil y delicioso.",
    image_url: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop",
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop",
    featured: false,
    sale_format: "Por kg",
    stock: 20,
    minimum_kg: 0.8,
    minimumKg: 0.8,
    sellBy: "kilo",
    boneOptions: ["sin-hueso"],
    formatOptions: ["entero"],
    inStock: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: "Costillas de Cerdo",
    price: 2200,
    category: "cerdo",
    description: "Costillas tiernas, perfectas para barbacoa. Jugosas y sabrosas.",
    image_url: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop",
    featured: true,
    sale_format: "Por kg",
    stock: 35,
    minimum_kg: 1,
    minimumKg: 1,
    sellBy: "kilo",
    boneOptions: ["con-hueso"],
    formatOptions: ["entero"],
    inStock: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: "Bondiola",
    price: 2400,
    category: "cerdo",
    description: "Corte jugoso y sabroso del cerdo. Perfecto para asados y guisos.",
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    featured: false,
    sale_format: "Por kg",
    stock: 28,
    minimum_kg: 0.8,
    minimumKg: 0.8,
    sellBy: "kilo",
    boneOptions: ["sin-hueso"],
    formatOptions: ["entero"],
    inStock: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: "Pollo Entero",
    price: 1800,
    category: "pollo",
    description: "Pollo fresco de granja. Tierno y jugoso, perfecto para cualquier preparación.",
    image_url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop",
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop",
    featured: true,
    sale_format: "Por unidad",
    stock: 40,
    minimum_kg: 1.5,
    minimumKg: 1.5,
    sellBy: "unidad",
    boneOptions: ["con-hueso"],
    formatOptions: ["entero"],
    inStock: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: "Pechuga de Pollo",
    price: 2100,
    category: "pollo",
    description: "Pechuga sin hueso, ideal para milanesas y preparaciones saludables.",
    image_url: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop",
    featured: false,
    sale_format: "Por kg",
    stock: 32,
    minimum_kg: 0.5,
    minimumKg: 0.5,
    sellBy: "kilo",
    boneOptions: ["sin-hueso"],
    formatOptions: ["entero"],
    inStock: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: "Cordero Patagónico",
    price: 3800,
    category: "cordero",
    description: "Cordero premium de la Patagonia. Carne tierna y de sabor único.",
    image_url: "https://images.unsplash.com/photo-1574781330855-d0dbd52a8e8c?w=400&h=300&fit=crop",
    image: "https://images.unsplash.com/photo-1574781330855-d0dbd52a8e8c?w=400&h=300&fit=crop",
    featured: true,
    sale_format: "Por kg",
    stock: 15,
    minimum_kg: 2,
    minimumKg: 2,
    sellBy: "kilo",
    boneOptions: ["con-hueso"],
    formatOptions: ["entero"],
    inStock: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: "Chuletas de Cordero",
    price: 4200,
    category: "cordero",
    description: "Chuletas tiernas y sabrosas. Perfectas para la parrilla.",
    image_url: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop",
    featured: false,
    sale_format: "Por kg",
    stock: 12,
    minimum_kg: 0.8,
    minimumKg: 0.8,
    sellBy: "kilo",
    boneOptions: ["con-hueso"],
    formatOptions: ["entero"],
    inStock: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

async function importProducts() {
  try {
    console.log('Iniciando importación de productos...');
    
    for (const product of products) {
      await addDoc(collection(db, 'products'), product);
      console.log(`✅ Producto agregado: ${product.name}`);
    }
    
    console.log('🎉 Todos los productos fueron importados exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al importar productos:', error);
    process.exit(1);
  }
}

importProducts();
