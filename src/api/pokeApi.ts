const BASE = 'https://pokeapi.co/api/v2';

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
    moves: data.moves.map((m: any) => ({
      name: m.move.name,
      url: m.move.url,
    })),
  };
};

export const fetchMoveDetails = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  const description = data.flavor_text_entries.find(
    (entry: any) => entry.language.name === 'en',
  );

  return {
    name: data.name,
    type: data.type.name,
    power: data.power,
    accuracy: data.accuracy,
    description: description
      ? description.flavor_text
      : 'No description available.',
  };
};
