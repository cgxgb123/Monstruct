// 2 - Super effective (2x damage)
// 0.5 - Not very effective (0.5x damage)
// 0 - No effect (0x damage)

export const typeEffectiveness: Record<string, Record<string, number>> = {
  Normal: { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Fire: {
    Fire: 0.5,
    Water: 0.5,
    Grass: 2,
    Ice: 2,
    Bug: 2,
    Rock: 0.5,
    Dragon: 0.5,
    Steel: 2,
  },
  Water: {
    Fire: 2,
    Water: 0.5,
    Grass: 0.5,
    Ground: 2,
    Rock: 2,
    Dragon: 0.5,
  },
  Electric: {
    Water: 2,
    Electric: 0.5,
    Grass: 0.5,
    Ground: 0,
    Flying: 2,
    Dragon: 0.5,
  },
  Grass: {
    Fire: 0.5,
    Water: 2,
    Grass: 0.5,
    Poison: 0.5,
    Ground: 2,
    Flying: 0.5,
    Bug: 0.5,
    Rock: 2,
    Dragon: 0.5,
    Steel: 0.5,
  },
  Ice: {
    Fire: 0.5,
    Water: 0.5,
    Grass: 2,
    Ice: 0.5,
    Ground: 2,
    Flying: 2,
    Dragon: 2,
    Steel: 0.5,
  },
  Fighting: {
    Normal: 2,
    Ice: 2,
    Poison: 0.5,
    Flying: 0.5,
    Psychic: 0.5,
    Bug: 0.5,
    Rock: 2,
    Ghost: 0,
    Dark: 2,
    Steel: 2,
    Fairy: 0.5,
  },
  Poison: {
    Grass: 2,
    Poison: 0.5,
    Ground: 0.5,
    Rock: 0.5,
    Ghost: 0.5,
    Steel: 0,
    Fairy: 2,
  },
  Ground: {
    Fire: 2,
    Electric: 2,
    Grass: 0.5,
    Poison: 2,
    Flying: 0,
    Bug: 0.5,
    Rock: 2,
    Steel: 2,
  },
  Flying: {
    Electric: 0.5,
    Grass: 2,
    Fighting: 2,
    Bug: 2,
    Rock: 0.5,
    Steel: 0.5,
  },
  Psychic: {
    Fighting: 2,
    Poison: 2,
    Psychic: 0.5,
    Dark: 0,
    Steel: 0.5,
  },
  Bug: {
    Fire: 0.5,
    Grass: 2,
    Fighting: 0.5,
    Poison: 0.5,
    Flying: 0.5,
    Psychic: 2,
    Ghost: 0.5,
    Dark: 2,
    Steel: 0.5,
    Fairy: 0.5,
  },
  Rock: {
    Fire: 2,
    Ice: 2,
    Fighting: 0.5,
    Ground: 0.5,
    Flying: 2,
    Bug: 2,
    Steel: 0.5,
  },
  Ghost: {
    Normal: 0,
    Psychic: 2,
    Ghost: 2,
    Dark: 0.5,
  },
  Dragon: {
    Dragon: 2,
    Steel: 0.5,
    Fairy: 0,
  },
  Dark: {
    Fighting: 0.5,
    Psychic: 2,
    Ghost: 2,
    Dark: 0.5,
    Fairy: 0.5,
  },
  Steel: {
    Fire: 0.5,
    Water: 0.5,
    Electric: 0.5,
    Ice: 2,
    Rock: 2,
    Steel: 0.5,
    Fairy: 2,
  },
  Fairy: {
    Fire: 0.5,
    Fighting: 2,
    Poison: 0.5,
    Dragon: 2,
    Dark: 2,
    Steel: 0.5,
  },
};

export const typeWeaknesses: Record<string, Record<string, number>> = {
  Normal: { Fighting: 2, Ghost: 0 },
  Fire: { Water: 2, Ground: 2, Rock: 2 },
  Water: { Electric: 2, Grass: 2 },
  Electric: { Ground: 2 },
  Grass: { Fire: 2, Ice: 2, Poison: 2, Flying: 2, Bug: 2 },
  Ice: { Fire: 2, Fighting: 2, Rock: 2, Steel: 2 },
  Fighting: { Flying: 2, Psychic: 2, Fairy: 2 },
  Poison: { Ground: 2, Psychic: 2 },
  Ground: { Water: 2, Grass: 2, Ice: 2 },
  Flying: { Electric: 2, Ice: 2, Rock: 2 },
  Psychic: { Bug: 2, Ghost: 2, Dark: 2 },
  Bug: { Fire: 2, Flying: 2, Rock: 2 },
  Rock: { Water: 2, Grass: 2, Fighting: 2, Ground: 2, Steel: 2 },
  Ghost: { Ghost: 2, Dark: 2, Normal: 0 },
  Dragon: { Ice: 2, Dragon: 2, Fairy: 2 },
  Dark: { Fighting: 2, Bug: 2, Fairy: 2 },
  Steel: { Fire: 2, Fighting: 2, Ground: 2 },
  Fairy: { Poison: 2, Steel: 2 },
};

export const calculateWeaknesses = (teamTypes: string[][]) => {
  const weaknessChart: Record<string, number> = {};
  teamTypes.forEach((types) => {
    types.forEach((type) => {
      if (typeWeaknesses[type]) {
        Object.entries(typeWeaknesses[type]).forEach(
          ([attackingType, multiplier]) => {
            weaknessChart[attackingType] =
              (weaknessChart[attackingType] || 0) + multiplier;
          },
        );
      }
    });
  });

  return weaknessChart;
};

export const calculateEffectiveness = (teamTypes: string[][]) => {
  const chart: Record<string, number> = {};
  teamTypes.forEach((types) => {
    types.forEach((type) => {
      if (typeEffectiveness[type]) {
        Object.entries(typeEffectiveness[type]).forEach(
          ([defendingType, multiplier]) => {
            chart[defendingType] = (chart[defendingType] || 0) + multiplier;
          },
        );
      }
    });
  });
  return chart;
};
