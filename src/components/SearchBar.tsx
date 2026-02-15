import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { SEARCH_NAMES } from '../utils/mutations.ts';

interface SearchResult {
  name: string;
  displayName: string;
  sprite: string;
  fallbackSprite: string;
}

interface SearchData {
  search: SearchResult[];
}

interface SearchBarProps {
  onSelect: (pokemon: SearchResult) => void;
}

const SearchBar = ({ onSelect }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const { data } = useQuery<SearchData>(SEARCH_NAMES, {
    variables: { name: searchTerm },
    skip: searchTerm.length < 2,
  });

  const handlePick = (pokemon: SearchResult) => {
    setSearchTerm(pokemon.displayName);
    setShowDropdown(false);
    onSelect(pokemon); // Pass the whole object back to App.tsx
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search Pokemon..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowDropdown(true);
        }}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />

      {showDropdown && data?.search && data.search.length > 0 && (
        <ul className="dropdown">
          {data.search.map((pokemon) => (
            <li key={pokemon.name} onClick={() => handlePick(pokemon)}>
              <img
                src={pokemon.sprite}
                alt={pokemon.name}
                width="30"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = pokemon.fallbackSprite;
                }}
              />
              <span>{pokemon.displayName}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
