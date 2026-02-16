const BASE = 'https://pokeapi.co/api/v2';

export const toTitleCase = (str: string) => {
  if (!str) return '';
  return str
    .replace(/-/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const fetchPokemonData = async (name: string) => {
  const response = await fetch(`${BASE}/pokemon/${name.toLowerCase()}`);
  if (!response.ok) throw new Error('Pokemon not found');
  const data = await response.json();

  return {
    name: data.name,
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

export const fetchMoveDetails = async (name: string) => {
  if (!name) return null;
  try {
    const cleanName = name.toLowerCase().replace(/ /g, '-');
    const response = await fetch(`${BASE}/move/${cleanName}`);
    if (!response.ok) return null;
    const data = await response.json();

    const entry = data.flavor_text_entries.find(
      (e: any) => e.language.name === 'en',
    );

    return {
      name: toTitleCase(data.name),
      type: data.type.name,
      power: data.power,
      accuracy: data.accuracy,
      pp: data.pp,
      description: entry
        ? entry.flavor_text.replace(/\n/g, ' ')
        : 'No description available.',
    };
  } catch (e) {
    console.error('Move fetch error:', e);
    return null;
  }
};

export const fetchItemDetails = async (name: string) => {
  if (!name) return null;
  try {
    const cleanName = name.toLowerCase().replace(/ /g, '-');
    const response = await fetch(`${BASE}/item/${cleanName}`);
    if (!response.ok) return null;
    const data = await response.json();

    const entry = data.flavor_text_entries.find(
      (e: any) => e.language.name === 'en',
    );

    return {
      name: toTitleCase(data.name),
      description: entry
        ? entry.flavor_text.replace(/\n/g, ' ')
        : 'No description available.',
    };
  } catch (e) {
    console.error('Item fetch error:', e);
    return null;
  }
};
