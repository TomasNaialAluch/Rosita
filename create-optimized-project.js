#!/usr/bin/env node

/**
 * 🚀 Script para crear proyecto optimizado desde cero
 * Basado en las optimizaciones aplicadas a Rosita Carnicería
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_NAME = process.argv[2] || 'mi-carniceria-optimizada';
const PROJECT_PATH = path.resolve(PROJECT_NAME);

console.log(`🚀 Creando proyecto optimizado: ${PROJECT_NAME}`);

// 1. Crear estructura de carpetas
const folders = [
  'app',
  'app/tienda',
  'app/noticias', 
  'app/admin',
  'app/auth',
  'app/api',
  'components',
  'components/ui',
  'lib',
  'public/images',
  'styles'
];

folders.forEach(folder => {
  const fullPath = path.join(PROJECT_PATH, folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Creado: ${folder}`);
  }
});

// 2. package.json optimizado
const packageJson = {
  "name": PROJECT_NAME,
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "next build",
    "dev": "next dev",
    "lint": "next lint",
    "start": "next start"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.1",
    "@radix-ui/react-dialog": "1.1.4",
    "@radix-ui/react-dropdown-menu": "2.1.4",
    "@radix-ui/react-label": "2.1.1",
    "@radix-ui/react-select": "2.1.4",
    "@radix-ui/react-sheet": "1.1.1",
    "@radix-ui/react-slot": "1.1.1",
    "@radix-ui/react-toast": "1.2.4",
    "@vercel/analytics": "1.3.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "firebase": "^12.3.0",
    "lucide-react": "^0.454.0",
    "next": "15.2.4",
    "next-themes": "^0.4.4",
    "react": "^19",
    "react-dom": "^19",
    "react-hook-form": "^7.54.1",
    "sonner": "latest",
    "tailwind-merge": "^2.5.5",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5",
    "tailwindcss": "^3.4.17",
    "typescript": "^5"
  }
};

fs.writeFileSync(
  path.join(PROJECT_PATH, 'package.json'),
  JSON.stringify(packageJson, null, 2)
);
console.log('📦 package.json creado');

// 3. next.config.mjs optimizado
const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Solo usar export para builds de producción, no en desarrollo
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
    distDir: 'dist'
  }),
  // Optimizaciones para desarrollo
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Mejorar compilación en desarrollo
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
}

export default nextConfig`;

fs.writeFileSync(path.join(PROJECT_PATH, 'next.config.mjs'), nextConfig);
console.log('⚙️ next.config.mjs creado');

// 4. tailwind.config.ts
const tailwindConfig = `import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Colores personalizados para carnicería
        'rosita-pink': '#e91e63',
        'rosita-black': '#2d2d2d',
        'rosita-gray': '#f5f5f5',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config`;

fs.writeFileSync(path.join(PROJECT_PATH, 'tailwind.config.ts'), tailwindConfig);
console.log('🎨 tailwind.config.ts creado');

// 5. tsconfig.json
const tsconfig = `{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`;

fs.writeFileSync(path.join(PROJECT_PATH, 'tsconfig.json'), tsconfig);
console.log('📝 tsconfig.json creado');

// 6. Sistema de caché optimizado
const cacheLib = `// Sistema de caché simple para mejorar rendimiento
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>();

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const cache = new SimpleCache();`;

fs.writeFileSync(path.join(PROJECT_PATH, 'lib/cache.ts'), cacheLib);
console.log('💾 Sistema de caché creado');

// 7. README con instrucciones
const readme = `# 🚀 ${PROJECT_NAME}

Proyecto optimizado creado con las mejores prácticas aplicadas.

## 🎯 Características

- ✅ Next.js 15 con App Router
- ✅ TypeScript estricto
- ✅ Tailwind CSS optimizado
- ✅ Firebase integrado
- ✅ Sistema de caché inteligente
- ✅ Server Components por defecto
- ✅ Performance optimizada

## 🚀 Inicio Rápido

\`\`\`bash
# Instalar dependencias
npm install

# Configurar Firebase
# 1. Crear proyecto en Firebase Console
# 2. Copiar config a .env.local
# 3. Habilitar Firestore con índices simples

# Ejecutar en desarrollo
npm run dev
\`\`\`

## 📁 Estructura

\`\`\`
app/                 # App Router (Next.js 15)
components/          # Componentes reutilizables
lib/                 # Lógica de negocio
public/              # Assets estáticos
\`\`\`

## 🔧 Optimizaciones Aplicadas

1. **Server Components** para carga rápida
2. **Sistema de caché** en memoria
3. **Firebase queries** simplificadas
4. **Bundle splitting** optimizado
5. **Error boundaries** y fallbacks

## 📚 Documentación

Ver \`PROJECT_REFERENCE.md\` para detalles completos.

---

Creado con ❤️ usando las mejores prácticas de Next.js
`;

fs.writeFileSync(path.join(PROJECT_PATH, 'README.md'), readme);
console.log('📚 README.md creado');

console.log(`\n🎉 ¡Proyecto ${PROJECT_NAME} creado exitosamente!`);
console.log(`\n📋 Próximos pasos:`);
console.log(`1. cd ${PROJECT_NAME}`);
console.log(`2. npm install`);
console.log(`3. Configurar Firebase`);
console.log(`4. npm run dev`);
console.log(`\n📖 Ver PROJECT_REFERENCE.md para más detalles`);
