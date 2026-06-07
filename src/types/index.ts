export type ProcessingMethod = 'washed' | 'natural' | 'honey' | 'anaerobic' | 'wet-hulled' | 'other';
export type RoastLevel = 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark';
export type BrewMethod =
  | 'espresso'
  | 'v60'
  | 'aeropress'
  | 'french-press'
  | 'chemex'
  | 'moka-pot'
  | 'cold-brew'
  | 'kalita'
  | 'drip'
  | 'siphon';

export const BREW_METHODS: { id: BrewMethod; label: string; emoji: string }[] = [
  { id: 'espresso',     label: 'Espresso',     emoji: '☕' },
  { id: 'v60',          label: 'V60',           emoji: '🔺' },
  { id: 'aeropress',    label: 'AeroPress',     emoji: '💉' },
  { id: 'french-press', label: 'French Press',  emoji: '🫖' },
  { id: 'chemex',       label: 'Chemex',        emoji: '⚗️' },
  { id: 'moka-pot',     label: 'Moka Pot',      emoji: '🍶' },
  { id: 'cold-brew',    label: 'Cold Brew',     emoji: '🧊' },
  { id: 'kalita',       label: 'Kalita Wave',   emoji: '🌊' },
  { id: 'drip',         label: 'Drip',          emoji: '💧' },
  { id: 'siphon',       label: 'Siphon',        emoji: '🔬' },
];

export const PROCESSING_METHODS: { id: ProcessingMethod; label: string }[] = [
  { id: 'washed',    label: 'Washed'    },
  { id: 'natural',   label: 'Natural'   },
  { id: 'honey',     label: 'Honey'     },
  { id: 'anaerobic', label: 'Anaerobic' },
  { id: 'wet-hulled',label: 'Wet-Hulled'},
  { id: 'other',     label: 'Other'     },
];

export const ROAST_LEVELS: { id: RoastLevel; label: string; color: string }[] = [
  { id: 'light',       label: 'Light',        color: '#D4A05A' },
  { id: 'medium-light',label: 'Med-Light',    color: '#C0783C' },
  { id: 'medium',      label: 'Medium',       color: '#9B5523' },
  { id: 'medium-dark', label: 'Med-Dark',     color: '#7A3F15' },
  { id: 'dark',        label: 'Dark',         color: '#3D1C02' },
];

export const AROMA_NOTES = [
  'Floral', 'Jasmine', 'Rose',
  'Fruity', 'Berry', 'Citrus', 'Stone Fruit', 'Tropical',
  'Chocolate', 'Caramel', 'Honey', 'Vanilla',
  'Nutty', 'Almond', 'Spicy', 'Earthy', 'Woody',
  'Winey', 'Fermented', 'Sweet',
];

export interface CoffeeBean {
  name: string;
  roastery: string;
  origin: string;
  processing: ProcessingMethod;
  roastLevel: RoastLevel;
}

export interface CheckIn {
  id: string;
  userId: string;
  createdAt: string;
  coffee: CoffeeBean;
  brewMethod: BrewMethod;
  rating: number;
  aromaProfile: string[];
  notes: string;
  likes: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  progress: number;
  target: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  bio: string;
  checkIns: CheckIn[];
}
