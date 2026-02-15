import { useState } from 'react';
import SearchBar from './components/SearchBar.tsx';
import LandingPage from './pages/LandingPage.tsx';
import Auth from './utils/auth.ts';
import logo from '../src/assets/monstruct_logo.png';
import './css/App.css';
import './css/Dropdown.css';

// Interface to match your SearchResult for consistency
interface PokemonMember {
  name: string;
  displayName: string;
  sprite: string;
}

function App() {
  // Initialize 6 empty slots
  const [team, setTeam] = useState<(PokemonMember | null)[]>(
    Array(6).fill(null),
  );
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  const handleSelectPokemon = (pokemon: any, index: number) => {
    const newTeam = [...team];
    newTeam[index] = {
      name: pokemon.name,
      displayName: pokemon.displayName,
      sprite: pokemon.sprite,
    };
    setTeam(newTeam);
    setActiveSlot(null); // Close search after picking
  };

  const removePokemon = (index: number) => {
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
  };

  if (!Auth.loggedIn()) return <LandingPage />;

  return (
    <div className="box">
      <button className="logout-btn" onClick={() => Auth.logout()}>
        Logout
      </button>
      <img src={logo} alt="Monstruct Logo" className="logo" />
      <h1>Monstruct</h1>

      <div className="slot-grid">
        {team.map((member, index) => (
          <div key={index} className={`slot ${member ? 'occupied' : 'empty'}`}>
            <span className="slot-label">SLOT {index + 1}</span>

            {member ? (
              <div className="member-display">
                <button
                  className="remove-btn"
                  onClick={() => removePokemon(index)}
                >
                  ×
                </button>
                <img
                  src={member.sprite}
                  alt={member.name}
                  className="slot-sprite"
                />
                <p>{member.displayName}</p>
              </div>
            ) : activeSlot === index ? (
              <SearchBar
                onSelect={(pokemon) => handleSelectPokemon(pokemon, index)}
              />
            ) : (
              <button className="add-btn" onClick={() => setActiveSlot(index)}>
                ADD POKÉMON
              </button>
            )}
          </div>
        ))}
      </div>

      {/* matrix will go here once team is full */}
      {team.every((m) => m !== null) && (
        <button className="save-team-btn">SAVE TEAM</button>
      )}
    </div>
  );
}

export default App;
