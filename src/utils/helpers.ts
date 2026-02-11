// toApi: "Mr. Mime" -> "mr-mime" (For PokeAPI)

export const toApi = (s: string): string => {
  const name = s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Check the 'name' variable, not 's'
  // And always return the full API name 'toxtricity-amped'
  if (name === 'toxtricity') return 'toxtricity-amped';

  return name;
};

export const toGif = (name: string): string => {
  const clean = name.toLowerCase();

  // Showdown specific naming quirks
  if (clean === 'toxtricity-amped') return 'toxtricity';
  if (clean === 'toxtricity-low-key') return 'toxtricity-lowkey';

  return clean.replace(/-/g, '');
};
