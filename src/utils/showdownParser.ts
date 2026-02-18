import { PokemonData } from './types.ts';

export const exportTeamToText = (team: PokemonData[]) => {
  return team
    .filter((pkmn) => pkmn && pkmn.name) // Safety check
    .map((pkmn) => {
      let text = `${pkmn.name}`;
      if (pkmn.item) text += ` @ ${pkmn.item}`;
      text += '\n';

      if (pkmn.ability) text += `Ability: ${pkmn.ability}\n`;
      if (pkmn.shiny) text += `Shiny: Yes\n`;
      if (pkmn.teraType) text += `Tera Type: ${pkmn.teraType}\n`;

      const evsList = Object.entries(pkmn.evs || {})
        .filter(([_, val]) => val > 0)
        .map(([stat, val]) => `${val} ${stat}`)
        .join(' / ');
      if (evsList) text += `EVs: ${evsList}\n`;

      if (pkmn.nature) text += `${pkmn.nature} Nature\n`;

      const ivsList = Object.entries(pkmn.ivs || {})
        .filter(([_, val]) => val < 31)
        .map(([stat, val]) => `${val} ${stat}`)
        .join(' / ');
      if (ivsList) text += `IVs: ${ivsList}\n`;

      // Only export non-empty moves
      (pkmn.moves || []).forEach((move) => {
        if (move && move.trim() !== '') text += `- ${move}\n`;
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

    const lines = block.split('\n').map((l) => l.trim());
    const firstLine = lines[0].split('@');

    let rawName = firstLine[0].trim();
    let speciesName = rawName;

    if (rawName.includes('(')) {
      const match = rawName.match(/(.+)\s\((.+)\)/);
      if (match) {
        if (match[2] === 'M' || match[2] === 'F') {
          speciesName = match[1].trim();
        } else {
          speciesName = match[2].trim();
        }
      } else {
        speciesName = rawName.split('(')[0].trim();
      }
    }

    const item = firstLine[1] ? firstLine[1].trim() : '';

    const pokemon: PokemonData = {
      name: speciesName,
      item,
      ability: '',
      shiny: false,
      teraType: 'Normal',
      sprite: '',
      stats: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      types: [],
      evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
      nature: 'Serious',
      moves: ['', '', '', ''],
    };

    let moveCount = 0;
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('Ability:'))
        pokemon.ability = line.split(':')[1].trim();
      else if (line.startsWith('Shiny:')) pokemon.shiny = true;
      else if (line.startsWith('Tera Type:'))
        pokemon.teraType = line.split(':')[1].trim();
      else if (line.endsWith('Nature'))
        pokemon.nature = line.split(' ')[0].trim();
      else if (line.startsWith('-') && moveCount < 4) {
        pokemon.moves[moveCount] = line.substring(1).trim();
        moveCount++;
      } else if (line.startsWith('EVs:')) {
        const parts = line.split(':')[1].split('/');
        parts.forEach((p) => {
          const [val, stat] = p.trim().split(' ');
          if (stat) {
            const statKey = stat.toLowerCase();
            pokemon.evs[statKey] = parseInt(val);
          }
        });
      } else if (line.startsWith('IVs:')) {
        const parts = line.split(':')[1].split('/');
        parts.forEach((p) => {
          const [val, stat] = p.trim().split(' ');
          if (stat) {
            const statKey = stat.toLowerCase();
            pokemon.ivs[statKey] = parseInt(val);
          }
        });
      }
    }
    team.push(pokemon);
  });

  return team;
};
