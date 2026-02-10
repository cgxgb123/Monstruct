// src/utils/helpers.ts
// toApi: "Mr. Mime" -> "mr-mime" (For PokeAPI)

export const toApi = (s: string): string =>
  s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

// toGif: "mr-mime" -> "mrmime" (For Showdown)
export const toGif = (s: string): string =>
  s.toLowerCase().replace(/[^a-z0-9]/g, '');
