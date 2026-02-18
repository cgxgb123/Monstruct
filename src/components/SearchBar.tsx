import { useState, useEffect } from 'react';
import { toTitleCase } from '../api/pokeApi.ts';
import '../css/SearchBar.css';
import '../css/Dropdown.css';

const SearchBar = ({ onSelect, placeholder }: any) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) return setResults([]);
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1300');
      const data = await res.json();
      const filtered = data.results
        .filter((p: any) => p.name.includes(query.toLowerCase()))
        .slice(0, 8);

      const detailed = await Promise.all(
        filtered.map(async (p: any) => {
          const detailRes = await fetch(p.url);
          const d = await detailRes.json();
          return {
            name: d.name,
            id: d.id,
            url: p.url,
            types: d.types,
            sprite:
              d.sprites.front_default ||
              d.sprites.other['official-artwork'].front_default,
          };
        }),
      );
      setResults(detailed);
    };
    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="search-container">
      <input
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || 'Search Pokémon...'}
      />
      {results.length > 0 && (
        <ul className="dropdown">
          {results.map((p) => (
            <li
              key={p.id}
              onClick={() => {
                onSelect({ ...p, species: p.name });
                setQuery('');
                setResults([]);
              }}
            >
              <img src={p.sprite} alt={p.name} />
              <span>{toTitleCase(p.name)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
