// src/api/pokeApi.ts:
import { PokemonData } from '../utils/types.ts';
const SPRITE = import.meta.env.SPRITE_CDN;
const BASE = 'https://pokeapi.co/api/v2';

export const toTitleCase = (str: string) => {
  if (!str) return '';
  return str
    .replace(/-/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getR2Sprite = (
  name: string,
  isShiny: boolean,
  isIcon: boolean = false,
) => {
  const cleanName = name.toLowerCase().trim().replace(/\s+/g, '-');
  if (isIcon) return `${BASE}/official-artwork/${cleanName}.png`;
  return isShiny
    ? `${SPRITE}/animated-shiny/${cleanName}.gif`
    : `${SPRITE}/animated/${cleanName}.gif`;
};

export const fetchPokemonData = async (name: string): Promise<PokemonData> => {
  const searchName = name.toLowerCase().trim().replace(/\s+/g, '-');
  const response = await fetch(`${BASE}/pokemon/${searchName}`);

  if (!response.ok) throw new Error('Pokemon not found');
  const data = await response.json();

  return {
    name: data.name,
    types: data.types,
    sprite: data.sprites.other['official-artwork'].front_default,
    stats: {
      hp: data.stats[0].base_stat,
      atk: data.stats[1].base_stat,
      def: data.stats[2].base_stat,
      spa: data.stats[3].base_stat,
      spd: data.stats[4].base_stat,
      spe: data.stats[5].base_stat,
    },
    moves: data.moves.map((m: any) => m.move.name),
  };
};

export const fetchAbility = async (abilityName: string) => {
  if (!abilityName) return null;
  try {
    const res = await fetch(
      `${BASE}/ability/${abilityName.toLowerCase().replace(/\s/g, '-')}`,
    );
    const data = await res.json();
    return (
      data.effect_entries.find((e: any) => e.language.name === 'en')
        ?.short_effect || 'No description available.'
    );
  } catch (e) {
    return null;
  }
};

export const fetchItemDetails = async (itemName: string) => {
  if (!itemName) return null;
  try {
    const res = await fetch(
      `${BASE}/item/${itemName.toLowerCase().replace(/\s/g, '-')}`,
    );
    const data = await res.json();
    return {
      name: toTitleCase(data.name),
      description:
        data.effect_entries.find((e: any) => e.language.name === 'en')
          ?.short_effect || 'No description available.',
      sprite: data.sprites.default,
    };
  } catch (e) {
    return null;
  }
};

export const fetchMoveDetails = async (moveName: string) => {
  if (!moveName) return null;
  try {
    const res = await fetch(
      `${BASE}/move/${moveName.toLowerCase().replace(/\s/g, '-')}`,
    );
    const data = await res.json();
    return {
      name: toTitleCase(data.name),
      power: data.power,
      pp: data.pp,
      accuracy: data.accuracy,
      type: toTitleCase(data.type.name),
      description:
        data.effect_entries.find((e: any) => e.language.name === 'en')
          ?.short_effect || 'No description.',
    };
  } catch (err) {
    return null;
  }
};
