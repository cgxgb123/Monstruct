const SMOGON_STATS_URL = 'https://pkmn.github.io/smogon/data/stats/gen9ou.json';

export const fetchSmogonInsights = async (pokemonName: string) => {
  try {
    const response = await fetch(SMOGON_STATS_URL);
    const data = await response.json();

    // Smogon uses lowercase IDs (e.g., "roaringmoon", "ironvaliant")
    const id = pokemonName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const stats = data.pokemon[id];

    if (!stats || !stats.teammates) {
      return { partner: 'N/A', percent: 0, swap: 'N/A' };
    }

    // Get Best Partner (Highest percentage in teammates object)
    const partners = Object.entries(stats.teammates) as [string, number][];
    const topPartner = partners.sort((a, b) => b[1] - a[1])[0];

    const topOverall = Object.entries(data.pokemon).sort(
      (a: any, b: any) => b[1].usage - a[1].usage,
    )[0][0];

    return {
      partner: topPartner[0],
      percent: (topPartner[1] * 100).toFixed(1),
      swap: topOverall !== id ? topOverall : 'Gholdengo',
    };
  } catch (err) {
    console.error('Smogon fetch failed', err);
    return null;
  }
};
