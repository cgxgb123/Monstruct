import { gql } from '@apollo/client';
import { useQuery, useLazyQuery } from '@apollo/client/react';
import { useState } from 'react';
import './css/App.css';
import './css/Dropdown.css';

interface PokemonData {
  getPokemon: {
    name: string;
    spriteUrl: string;
  };
}

interface SearchData {
  search: string[];
}

const GET_POKEMON = gql`
  query GetPokemon($name: String!) {
    getPokemon(name: $name) {
      name
      spriteUrl
    }
  }
`;

const SEARCH_NAMES = gql`
  query Search($name: String!) {
    search(name: $name)
  }
`;

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const [getPokemon, { loading, error, data }] =
    useLazyQuery<PokemonData>(GET_POKEMON);

  const { data: searchData } = useQuery<SearchData>(SEARCH_NAMES, {
    variables: { name: searchTerm },
    skip: searchTerm.length < 2,
  });

  const handleSelect = (name: string) => {
    setSearchTerm(name);
    setShowDropdown(false);
    getPokemon({ variables: { name: name } });
  };

  return (
    <div className="box">
      <h1>Monstruct</h1>

      <div className="search-container" style={{ position: 'relative' }}>
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

        {showDropdown && searchData?.search && searchData.search.length > 0 && (
          <ul className="dropdown">
            {searchData.search.map((name: string) => (
              <li key={name} onClick={() => handleSelect(name)}>
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="slot-container">
        <div className="slot">
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          {data?.getPokemon && (
            <img src={data.getPokemon.spriteUrl} alt={data.getPokemon.name} />
          )}
        </div>
        <div className="slot"></div>
        <div className="slot"></div>
        <div className="slot"></div>
        <div className="slot"></div>
      </div>
    </div>
  );
}

export default App;
