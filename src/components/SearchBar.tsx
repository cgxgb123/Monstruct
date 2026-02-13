import { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const SEARCH_NAMES = gql`
  query Search($name: String!) {
    search(name: $name) {
      name
      displayName
      sprite
    }
  }
`;

interface SearchResult {
  name: string;
  displayName: string;
  sprite: string;
}

interface SearchData {
  search: SearchResult[];
}

interface SearchBarProps {
  onSelect: (name: string) => void;
}

const SearchBar = ({ onSelect }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const { data } = useQuery<SearchData>(SEARCH_NAMES, {
    variables: { name: searchTerm },
    skip: searchTerm.length < 2,
  });

  const handlePick = (pokemon: SearchResult) => {
    setSearchTerm(pokemon.displayName); // Show "Toxtricity" in the bar
    setShowDropdown(false);
    onSelect(pokemon.name); // Send "toxtricity-amped" to the backend
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
              <img src={pokemon.sprite} alt={pokemon.name} width="30" />
              <span>{pokemon.displayName}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
