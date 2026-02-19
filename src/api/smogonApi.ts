const SMOGON_STATS_URL = 'https://pkmn.github.io/smogon/data/stats/gen9ou.json';

const normalizeName = (name: string) => {
  return name
    .split(/[- ]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const fetchSmogonInsights = async (pokemonName: string) => {
  try {
    const response = await fetch(SMOGON_STATS_URL);
    const data = await response.json();
    const pokemonData = data.pokemon || data;

    const id = pokemonName
      .split(/[- ]+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    const stats = pokemonData[id];

    if (!stats) return null;

    const partners = Object.entries(stats.teammates || {}) as [
      string,
      number,
    ][];
    const topPartner = partners.sort((a, b) => b[1] - a[1])[0];

    const moves = Object.entries(stats.moves || {}) as [string, number][];
    const topMove = moves.sort((a, b) => b[1] - a[1])[0];

    // Get Recommended Spreads (Nature + EVs)
    const spreads = Object.entries(stats.spreads || {}) as [string, number][];
    const topSpread = spreads.sort((a, b) => b[1] - a[1])[0];
    // Format: "Jolly:0/252/4/0/0/252"

    return {
      partner: topPartner ? topPartner[0] : 'N/A',
      percent: topPartner ? (topPartner[1] * 100).toFixed(1) : 0,
      swap: topMove ? topMove[0] : 'N/A',
      recommendedSpread: topSpread ? topSpread[0] : null,
    };
  } catch (err) {
    console.error('Smogon fetch failed', err);
    return null;
  }
};
