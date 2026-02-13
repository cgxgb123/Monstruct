import { gql } from '@apollo/client';
import { useQuery, useLazyQuery } from '@apollo/client/react';
import { useState } from 'react';
import './css/App.css';

interface PokemonData {
  getPokemon: {
    name: string;
    spriteUrl: string;
  };
}

const GET_POKEMON = gql`
  query GetPokemon($name: String!) {
    getPokemon(name: $name) {
      name
      spriteUrl
    }
  }
`;

function App() {
  const [searchTerm, setSearchTerm] = useState('Koffing');
  const { loading, error, data } = useQuery<PokemonData>(GET_POKEMON, {
    variables: { name: searchTerm },
  });

  return (
    <div className="box">
      <h1>Monstruct</h1>

      <input
        type="text"
        placeholder="Search Pokemon..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="slot-container">
        <div className="slot">
          {loading && <p>Loading...</p>}

          {error && <p className="error">Not found!</p>}

          {data && !loading && (
            <img
              src={data.getPokemon.spriteUrl}
              alt={data.getPokemon.name}
              style={{ width: '100px' }}
            />
          )}
        </div>
        {/*slots for card displays*/}
        <div className="slot"></div>
        <div className="slot"></div>
        <div className="slot"></div>
        <div className="slot"></div>
        <div className="slot"></div>
      </div>
    </div>
  );
}

export default App;
