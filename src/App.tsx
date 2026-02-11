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
      <div></div>
    </>
  );
}

export default App;
