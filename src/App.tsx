import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { toApi, toGif } from './utils/helpers.ts';
import { useState } from 'react';
import './App.css';

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
  // pass the interface to useQuery <PokemonData>
  const [searchTerm, setSearchTerm] = useState('Koffing');
  const { loading, error, data } = useQuery<PokemonData>(GET_POKEMON, {
    variables: { name: toApi(searchTerm) },
  });

  return (
    <>
      <div className="box">
        <h1>Monstruct</h1>

        <div className="slot">
          {data && (
            <img
              src={`https://play.pokemonshowdown.com/sprites/ani/${toGif(data.getPokemon.name)}.gif`}
              alt={data.getPokemon.name}
            />
          )}
        </div>

        <div className="slot"></div>
        <div className="slot"></div>
      </div>
    </>
  );
}

export default App;
