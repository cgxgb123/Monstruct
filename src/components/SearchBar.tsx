import { useState, useEffect } from 'react';
import { toTitleCase } from '../api/pokeApi.ts';

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
        placeholder={placeholder}
      />
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((p) => (
            <li
              key={p.id}
              onClick={() => {
                onSelect(p);
                setQuery('');
                setResults([]);
              }}
            >
              <img src={p.sprite} alt="" width="30" />
              {toTitleCase(p.name)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
