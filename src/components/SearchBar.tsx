import { useState, useEffect } from 'react';
import { toTitleCase } from '../api/pokeApi.ts';
import { config } from 'dotenv';
config();
const R2_BASE = process.env.SPRITE_CDN;

const SearchBar = ({ onSelect, placeholder }: any) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const searchPokemon = async () => {
      if (query.length < 2) return setResults([]);

      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
        const data = await res.json();

        const filtered = data.results
          .filter((p: any) => p.name.includes(query.toLowerCase()))
          .slice(0, 6);

        const formattedResults = filtered.map((p: any) => {
          const cleanName = p.name.toLowerCase();
          return {
            name: p.name,
            sprite: `${R2_BASE}/official-artwork/${cleanName}.png`,
            url: p.url,
          };
        });

        setResults(formattedResults);
      } catch (e) {
        console.error(e);
      }
    };

    const debounce = setTimeout(searchPokemon, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="search-wrapper">
      <input
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
      />
      {results.length > 0 && (
        <ul className="search-dropdown">
          {results.map((pokemon) => (
            <div
              key={pokemon.name}
              className="search-result-item"
              onClick={() => {
                onSelect(pokemon);
                setQuery('');
                setResults([]);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '5px',
                cursor: 'pointer',
              }}
            >
              <img
                src={pokemon.sprite}
                alt={pokemon.name}
                style={{
                  width: '40px',
                  height: '40px',
                  marginRight: '10px',
                  objectFit: 'contain',
                }}
                onError={(e) => {
                  // fallback if R2 image doesn't exist yet
                  (e.target as HTMLImageElement).src =
                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png`;
                }}
              />
              <span>{toTitleCase(pokemon.name)}</span>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
