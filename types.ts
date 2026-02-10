
export enum Category {
  MEALS = 'MEALS',
  DRINKS = 'DRINKS',
  DESSERTS = 'DESSERTS',
}

export enum Portion {
  QUARTER = 'Q',
  HALF = 'H',
  FULL = 'F',
}

export enum SpiceLevel {
  NORMAL = 'Normal',
  EXTRA = 'Extra',
}

export enum DiningOption {
  OUT = 'Out',
  IN = 'In',
}

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  description: string; // Ingredients list essentially
  calories: {
    fat: number;
    saturatedFat: number;
    transFat: number;
  };
  price: number;
  image: string;
  prepTime: number; // in minutes
  isPopular?: boolean;
  quote?: string;
  available: boolean; // New field for stock management
}

export interface CartItem extends MenuItem {
  cartId: string;
  selectedPortion: Portion;
  selectedSpice: SpiceLevel;
  selectedDining: DiningOption;
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}
