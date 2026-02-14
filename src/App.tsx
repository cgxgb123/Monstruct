import { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import SearchBar from './components/SearchBar.tsx';
import LandingPage from './pages/LandingPage.tsx';
import Auth from './utils/auth.ts';
import logo from '../assets/monstruct_logo.png';
import './css/App.css';
import './css/Dropdown.css';

const GET_POKEMON = gql`
  query GetPokemon($name: String!) {
    getPokemon(name: $name) {
      name
      spriteUrl
    }
  }
`;

interface PokemonData {
  getPokemon: {
    name: string;
    spriteUrl: string;
  };
}

function App() {
  const [selectedName, setSelectedName] = useState('');

  const { loading, error, data } = useQuery<PokemonData>(GET_POKEMON, {
    variables: { name: selectedName },
    skip: !selectedName,
  });

  // check if user is logged in
  if (!Auth.loggedIn()) {
    return <LandingPage />;
  }

  return (
    <div className="box">
      <button
        onClick={() => Auth.logout()}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '5px 10px',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>

      <img src={logo} alt="Monstruct Logo" className="logo" />
      <h1>Monstruct</h1>

      <SearchBar onSelect={(name) => setSelectedName(name)} />

      <div className="slot-container">
        <div className="slot active-search">
          {loading && <p>Loading...</p>}
          {error && <p>Error fetching data</p>}
          {data?.getPokemon ? (
            <img src={data.getPokemon.spriteUrl} alt={data.getPokemon.name} />
          ) : (
            !loading && <p>Search to begin</p>
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
