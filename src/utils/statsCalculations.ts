export const calculateStat = (
  statName: string,
  base: number,
  ev: number,
  iv: number,
  level = 100,
  natureMod = 1.0,
) => {
  if (statName === 'hp') {
    if (base === 1) return 1;
    return (
      Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) +
      level +
      10
    );
  } else {
    return Math.floor(
      (Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5) *
        natureMod,
    );
  }
};
