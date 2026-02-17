import { useState, useEffect } from 'react';
import { toTitleCase } from '../api/pokeApi.ts';
import { SearchBarProps } from '../utils/types.ts';
import '../css/SearchBar.css';
const SPRITE = import.meta.env.SPRITE_CDN;

const SearchBar = ({ onSelect, placeholder }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [allPokemon, setAllPokemon] = useState<any[]>([]);

  // Fetch all Pokemon on mount
  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
        const data = await res.json();
        setAllPokemon(data.results);
      } catch (e) {
        console.error('Failed to fetch Pokemon list', e);
      }
    };
    fetchAllPokemon();
  }, []);

  useEffect(() => {
    const searchPokemon = async () => {
      if (query.length < 2 && !isActive) {
        setResults([]);
        return;
      }

      // If search is empty but active, show first 10
      if (query.length === 0 && isActive) {
        const initial10 = allPokemon.slice(0, 10);
        const formatted = initial10.map((p: any) => ({
          name: p.name,
          sprite: `${SPRITE}/official-artwork/${p.name.toLowerCase()}.png`,
          url: p.url,
        }));
        setResults(formatted);
        return;
      }

      // Filter based on query
      const filtered = allPokemon
        .filter((p: any) => p.name.includes(query.toLowerCase()))
        .slice(0, 10);

      const formatted = filtered.map((p: any) => ({
        name: p.name,
        sprite: `${SPRITE}/official-artwork/${p.name.toLowerCase()}.png`,
        url: p.url,
      }));

      setResults(formatted);
    };

    const debounce = setTimeout(searchPokemon, 200);
    return () => clearTimeout(debounce);
  }, [query, isActive, allPokemon]);

  const handleFocus = () => {
    setIsActive(true);
    // Show first 10 when focused
    if (query.length === 0 && allPokemon.length > 0) {
      const initial10 = allPokemon.slice(0, 10);
      const formatted = initial10.map((p: any) => ({
        name: p.name,
        sprite: `${SPRITE}/official-artwork/${p.name.toLowerCase()}.png`,
        url: p.url,
      }));
      setResults(formatted);
    }
  };

  const handleBlur = () => {
    // Delay to allow click events to fire
    setTimeout(() => {
      setIsActive(false);
      setResults([]);
    }, 200);
  };

  return (
    <div className="search-wrapper">
      <input
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
      {isActive && results.length > 0 && (
        <ul className="search-dropdown">
          {results.map((pokemon) => (
            <li
              key={pokemon.name}
              className="search-result-item"
              onClick={() => {
                onSelect(pokemon);
                setQuery('');
                setResults([]);
                setIsActive(false);
              }}
            >
              <img
                src={pokemon.sprite}
                alt={pokemon.name}
                className="search-result-sprite"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png`;
                }}
              />
              <span className="search-result-name">
                {toTitleCase(pokemon.name)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
