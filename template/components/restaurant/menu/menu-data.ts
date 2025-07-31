// Authentic Burgergrill Menu Data - Based on Real Menu Card 2025
import { BurgergrillMenu } from './types';

export const authenticBurgergrillMenu: BurgergrillMenu = {
  hauptgerichte: [
    // Signature Cevapcici Items (Top Priority)
    {
      id: 'cevapcici-7stk',
      name: 'Cevapcici im Fladenbrot (7Stk.)',
      price: 11.50,
      isSignature: true,
      available: true
    },
    {
      id: 'cevapcici-kaese-7stk', 
      name: 'Cevapcici im Fladenbrot (7Stk.) Mit Käse',
      price: 13.50,
      isSignature: true,
      available: true
    },
    
    // Profitable Mix Items (Golden Triangle)
    {
      id: 'mix-hamburger-cevapcici',
      name: 'Mix (Hamburger + 3 Cevapcici)',
      price: 14.50,
      isProfitable: true,
      available: true
    },
    {
      id: 'mix-kaese',
      name: 'Mix mit Käse',
      price: 16.50,
      isProfitable: true,
      available: true
    },
    
    // Standard Burger Items
    {
      id: 'hamburger-fladenbrot',
      name: 'Hamburger im Fladenbrot',
      price: 11.50,
      available: true
    },
    {
      id: 'cheeseburger-fladenbrot',
      name: 'Cheeseburger im Fladenbrot', 
      price: 13.50,
      available: true
    },
    
    // Premium Double Items  
    {
      id: 'doppel-hamburger',
      name: 'Doppel Hamburger',
      price: 15.50,
      available: true
    },
    {
      id: 'doppel-cheeseburger',
      name: 'Doppel Cheeseburger',
      price: 17.50,
      available: true
    },
    
    // XXL Hot Dog Items
    {
      id: 'xxl-double-dog',
      name: 'XXL Double Dog im Baguette (Rind und Lamm)',
      price: 11.50,
      available: true
    },
    {
      id: 'xxl-double-dog-kaese',
      name: 'XXL Double Dog im Baguette Mit Käse',
      price: 13.50,
      available: true
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
    },
    {
      id: 'senf',
      name: 'Senf'
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