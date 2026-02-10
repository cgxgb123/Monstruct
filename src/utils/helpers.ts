// src/utils/helpers.ts

export const cleanName = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, ''); // remove EVERYTHING that isn't a letter or number
};
