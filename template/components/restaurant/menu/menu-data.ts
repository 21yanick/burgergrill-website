// Authentic Burgergrill Menu Data - Based on Real Menu Card 2025
import { BurgergrillMenu, MenuImageConfig } from './types';

// 🆕 IMAGE CONFIGURATION
export const menuImageConfig: MenuImageConfig = {
  basePath: '/images/menu/hauptgerichte',
  fallbackImage: '/images/menu/fallback/dish-placeholder.jpg',
  aspectRatio: 4/3
};

export const authenticBurgergrillMenu: BurgergrillMenu = {
  hauptgerichte: [
    // Signature Cevapcici Items (Top Priority)
    {
      id: 'cevapcici-7stk',
      name: 'Cevapcici im Fladenbrot (7Stk.)',
      price: 11.50,
      isSignature: true,
      available: true,
      // 🆕 IMAGE DATA (Proof of concept)
      image: '/images/menu/hauptgerichte/cevapcici-7stk.jpg',
      imageAlt: 'Cevapcici im Fladenbrot mit Ajvar, Zwiebeln und frischem Salat'
    },
    {
      id: 'cevapcici-kaese-7stk', 
      name: 'Cevapcici im Fladenbrot (7Stk.) Mit Käse',
      price: 13.50,
      isSignature: true,
      available: true,
      // 🆕 IMAGE DATA (Proof of concept)
      image: '/images/menu/hauptgerichte/cevapcici-kaese-7stk.jpg',
      imageAlt: 'Cevapcici mit geschmolzenem Käse im warmen Fladenbrot'
    },
    
    // Profitable Mix Items (Golden Triangle)
    {
      id: 'mix-hamburger-cevapcici',
      name: 'Mix (Hamburger + 3 Cevapcici)',
      price: 14.50,
      isProfitable: true,
      available: true,
      // 🆕 IMAGE DATA (Proof of concept)
      image: '/images/menu/hauptgerichte/mix-hamburger-cevapcici.jpg',
      imageAlt: 'Mix aus Hamburger und drei Cevapcici im Fladenbrot mit Beilagen'
    },
    {
      id: 'mix-kaese',
      name: 'Mix mit Käse',
      price: 16.50,
      isProfitable: true,
      available: true,
      // 🆕 IMAGE DATA (User will upload)
      image: '/images/menu/hauptgerichte/mix-kaese.jpg',
      imageAlt: 'Mix aus Hamburger und drei Cevapcici mit geschmolzenem Käse'
    },
    
    // Standard Burger Items
    {
      id: 'hamburger-fladenbrot',
      name: 'Hamburger im Fladenbrot',
      price: 11.50,
      available: true,
      // 🆕 IMAGE DATA (User uploaded)
      image: '/images/menu/hauptgerichte/hamburger-fladenbrot.jpg',
      imageAlt: 'Hamburger im warmen Fladenbrot mit frischen Zutaten'
    },
    {
      id: 'cheeseburger-fladenbrot',
      name: 'Cheeseburger im Fladenbrot', 
      price: 13.50,
      available: true,
      // 🆕 IMAGE DATA (User uploaded)
      image: '/images/menu/hauptgerichte/cheeseburger-fladenbrot.jpg',
      imageAlt: 'Cheeseburger mit geschmolzenem Käse im Fladenbrot'
    },
    
    // Premium Double Items  
    {
      id: 'doppel-hamburger',
      name: 'Doppel Hamburger',
      price: 15.50,
      available: true,
      // 🆕 IMAGE DATA (User will upload)
      image: '/images/menu/hauptgerichte/doppel-hamburger.jpg',
      imageAlt: 'Doppel Hamburger mit zwei saftigen Fleischpatties im Fladenbrot'
    },
    {
      id: 'doppel-cheeseburger',
      name: 'Doppel Cheeseburger',
      price: 17.50,
      available: true,
      // 🆕 IMAGE DATA (User will upload)
      image: '/images/menu/hauptgerichte/doppel-cheeseburger.jpg',
      imageAlt: 'Doppel Cheeseburger mit zwei Patties und doppelt Käse im Fladenbrot'
    },
    
    // XXL Hot Dog Items
    {
      id: 'xxl-double-dog',
      name: 'XXL Double Dog im Baguette (Rind und Lamm)',
      price: 11.50,
      available: true,
      // 🆕 IMAGE DATA (User uploaded)
      image: '/images/menu/hauptgerichte/xxl-double-dog.jpg',
      imageAlt: 'XXL Double Dog mit Rind und Lamm im knusprigen Baguette'
    },
    {
      id: 'xxl-double-dog-kaese',
      name: 'XXL Double Dog im Baguette Mit Käse',
      price: 13.50,
      available: true,
      // 🆕 IMAGE DATA (User uploaded)
      image: '/images/menu/hauptgerichte/xxl-double-dog-kaese.jpg',
      imageAlt: 'XXL Double Dog mit Rind, Lamm und geschmolzenem Käse im Baguette'
    }
  ],

  beilagen: [
    {
      id: 'gruener-salat',
      name: 'Grüner Salat'
    },
    {
      id: 'essig-gurken',
      name: 'Essig-Gurken'
    },
    {
      id: 'zwiebeln',
      name: 'Zwiebeln'
    },
    {
      id: 'jalapeno',
      name: 'Jalapeño'
    }
  ],

  saucen: [
    {
      id: 'ketchup',
      name: 'Ketchup'
    },
    {
      id: 'cocktail',
      name: 'Cocktail'
    },
    {
      id: 'mayonnaise',
      name: 'Mayonnaise'
    },
    {
      id: 'ajvar',
      name: 'Ajvar'
    },
    {
      id: 'joghurt-knoblauch',
      name: 'Joghurt-Knoblauch'
    },
    {
      id: 'barbecue',
      name: 'Barbecue'
    }
  ],

  getränke: {
    title: '',
    description: '',
    price: 2.00
  },

  kontakt: {
    telefon: '079 489 77 55',
    vorbestellungText: 'Vorbestellung unter'
  }
};

// Category Labels for Navigation
export const categoryLabels = {
  hauptgerichte: 'Hauptgerichte',
  beilagen: 'Beilagen', 
  saucen: 'Saucen',
  getränke: 'Getränke'
} as const;

// Category Icons for Enhanced UI
export const categoryIcons = {
  hauptgerichte: '🍔',
  beilagen: '🥗', 
  saucen: '🌶️',
  getränke: '🥤'
} as const;

// Header Content
export const menuHeader = {
  title: 'Unsere Speisekarte',
  subtitle: 'Für Sie unsere Hausgemachten Spezialitäten frisch vom Grill!',
  description: '100% Rind und Kalbsfleisch',
} as const;