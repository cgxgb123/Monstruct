interface PokemonData {
  name: string;
  item: string;
  ability: string;
  shiny: boolean;
  teraType: string;
  evs: { [key: string]: number };
  ivs: { [key: string]: number };
  nature: string;
  moves: string[];
}

export const exportTeamToText = (team: PokemonData[]) => {
  return team
    .map((pkmn) => {
      let text = `${pkmn.name}`;
      if (pkmn.item) text += ` @ ${pkmn.item}`;
      text += '\n';

      if (pkmn.ability) text += `Ability: ${pkmn.ability}\n`;
      if (pkmn.shiny) text += `Shiny: Yes\n`;
      if (pkmn.teraType) text += `Tera Type: ${pkmn.teraType}\n`;

      // Format EVs
      const evsList = Object.entries(pkmn.evs)
        .filter(([_, val]) => val > 0)
        .map(([stat, val]) => `${val} ${stat}`)
        .join(' / ');
      if (evsList) text += `EVs: ${evsList}\n`;

      if (pkmn.nature) text += `${pkmn.nature} Nature\n`;

      // Format IVs
      const ivsList = Object.entries(pkmn.ivs)
        .filter(([_, val]) => val < 31)
        .map(([stat, val]) => `${val} ${stat}`)
        .join(' / ');
      if (ivsList) text += `IVs: ${ivsList}\n`;

      pkmn.moves.forEach((move) => {
        if (move) text += `- ${move}\n`;
      });

      return text;
    })
    .join('\n');
};

export const parseShowdownImport = (text: string): PokemonData[] => {
  const team: PokemonData[] = [];
  const pokemonBlocks = text.split(/\n\s*\n/);
  pokemonBlocks.forEach((block) => {
    if (!block.trim()) return;

    const lines = block.split('\n');
    const firstLine = lines[0].split('@');
    const name = firstLine[0].trim();
    const item = firstLine[1] ? firstLine[1].trim() : '';

    const pokemon: PokemonData = {
      name,
      item,
      ability: '',
      shiny: false,
      teraType: 'Normal',
      evs: { HP: 0, Atk: 0, Def: 0, SpA: 0, SpD: 0, Spe: 0 },
      ivs: { HP: 31, Atk: 31, Def: 31, SpA: 31, SpD: 31, Spe: 31 },
      nature: 'Serious',
      moves: [],
    };

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('Ability:'))
        pokemon.ability = line.split(':')[1].trim();
      else if (line.startsWith('Shiny:')) pokemon.shiny = true;
      else if (line.startsWith('Tera Type:'))
        pokemon.teraType = line.split(':')[1].trim();
      else if (line.endsWith('Nature'))
        pokemon.nature = line.split(' ')[0].trim();
      else if (line.startsWith('-'))
        pokemon.moves.push(line.substring(1).trim());
      else if (line.startsWith('EVs:')) {
        const parts = line.split(':')[1].split('/');
        parts.forEach((p) => {
          const [val, stat] = p.trim().split(' ');
          pokemon.evs[stat as any] = parseInt(val);
        });
      }
    }
    team.push(pokemon);
  });

  return team;
};
