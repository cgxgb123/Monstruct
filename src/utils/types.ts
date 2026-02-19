// src/utils/types.ts:
export interface SearchResult {
  name: string;
  url: string;
  id: number;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork'?: { front_default: string };
    };
  };
  types: string[];
  displayName?: string;
  sprite?: string;
}

export interface SearchBarProps {
  onSelect: (data: SearchResult) => void;
  placeholder?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    username: string;
  };
}

export interface LoginData {
  login: AuthResponse;
}

export interface SignupData {
  signup: AuthResponse;
}

export interface StatBlock {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export interface PokemonData {
  name: string;
  sprite: string;
  stats: StatBlock;
  moves: string[];
  types: any[];
  item?: string;
  ability?: string;
  shiny?: boolean;
  teraType?: string;
  evs: { [key: string]: number };
  ivs: { [key: string]: number };
  nature?: string;
  url?: string;
}

export const COMMON_ITEMS = [
  'Leftovers',
  'Life Orb',
  'Choice Scarf',
  'Choice Band',
  'Choice Specs',
  'Focus Sash',
  'Heavy-Duty Boots',
  'Assault Vest',
  'Rocky Helmet',
  'Black Sludge',
  'Eviolite',
  'Expert Belt',
  'Sitrus Berry',
  'Weakness Policy',
];

export const NATURES = [
  'Hardy',
  'Lonely',
  'Adamant',
  'Naughty',
  'Bold',
  'Docile',
  'Modest',
  'Timid',
  'Neutral',
  'Brave',
  'Relaxed',
  'Quiet',
  'Sassy',
  'Calm',
  'Gentle',
  'Careful',
];

export const POKEMON_TYPES = [
  'Normal',
  'Fire',
  'Water',
  'Electric',
  'Grass',
  'Ice',
  'Fighting',
  'Poison',
  'Ground',
  'Flying',
  'Psychic',
  'Bug',
  'Rock',
  'Ghost',
  'Dragon',
  'Dark',
  'Steel',
  'Fairy',
];
