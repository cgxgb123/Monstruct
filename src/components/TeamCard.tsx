import { useState } from 'react';
import SearchBar from '../components/SearchBar.tsx';
import { TERA_TYPES } from '../utils/teraTypes.ts';
import '../css/TeamCard.css';

interface TeamCardProps {
  pokemon: any;
  index: number;
  onUpdate: (index: number, data: any) => void;
  onDelete: (index: number) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({
  pokemon,
  index,
  onUpdate,
  onDelete,
}) => {
  const [showTeraMenu, setShowTeraMenu] = useState(false);

  // If no pokemon in this slot, show the search bar
  if (!pokemon) {
    return (
      <div className="team-card empty-slot">
        <div className="search-wrapper-card">
          <SearchBar
            placeholder="Search Pokémon..."
            onSelect={(data) =>
              onUpdate(index, {
                ...data,
                isShiny: false,
                teraType: data.types[0] || 'Normal', // Default Tera to primary type
                moves: ['', '', '', ''],
              })
            }
          />
        </div>
        <p className="empty-text">Add Pokémon</p>
      </div>
    );
  }

  const spriteUrl = pokemon.isShiny
    ? `https://play.pokemonshowdown.com/sprites/ani-shiny/${pokemon.name.toLowerCase().replace(/\s/g, '')}.gif`
    : `https://play.pokemonshowdown.com/sprites/ani/${pokemon.name.toLowerCase().replace(/\s/g, '')}.gif`;

  const toggleShiny = () => {
    onUpdate(index, { ...pokemon, isShiny: !pokemon.isShiny });
  };

  const handleTeraSelect = (type: string) => {
    onUpdate(index, { ...pokemon, teraType: type });
    setShowTeraMenu(false);
  };

  return (
    <div className="team-card filled-slot">
      <div className="card-header">
        <span className="pokemon-name">{pokemon.name}</span>
        <button className="delete-btn" onClick={() => onDelete(index)}>
          ×
        </button>
      </div>

      <div className="visuals-row">
        {/* Shiny Toggle Button */}
        <button
          className={`shiny-btn ${pokemon.isShiny ? 'active' : ''}`}
          onClick={toggleShiny}
          title="Toggle Shiny"
        >
          ✨
        </button>

        <div className="sprite-container">
          <img src={spriteUrl} alt={pokemon.name} className="pokemon-sprite" />
        </div>

        {/* Tera Type Selector */}
        <div className="tera-wrapper">
          <button
            className="tera-trigger"
            onClick={() => setShowTeraMenu(!showTeraMenu)}
          >
            <img
              src={
                TERA_TYPES[pokemon.teraType as keyof typeof TERA_TYPES] ||
                TERA_TYPES.Normal
              }
              alt="Tera"
              className="tera-icon-current"
            />
          </button>

          {showTeraMenu && (
            <div className="tera-dropdown">
              {Object.keys(TERA_TYPES).map((type) => (
                <div
                  key={type}
                  className="tera-option"
                  onClick={() => handleTeraSelect(type)}
                >
                  <img
                    src={TERA_TYPES[type as keyof typeof TERA_TYPES]}
                    alt={type}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Types Display */}
      <div className="types-row">
        {pokemon.types.map((t: string) => (
          <span key={t} className={`type-badge type-${t.toLowerCase()}`}>
            {t}
          </span>
        ))}
      </div>

      <div className="details-grid">
        <input
          className="detail-input"
          placeholder="Item"
          value={pokemon.item || ''}
          onChange={(e) =>
            onUpdate(index, { ...pokemon, item: e.target.value })
          }
        />
        <input
          className="detail-input"
          placeholder="Ability"
          value={pokemon.ability || ''}
          onChange={(e) =>
            onUpdate(index, { ...pokemon, ability: e.target.value })
          }
        />
      </div>

      <div className="moves-grid">
        {pokemon.moves.map((move: string, i: number) => (
          <input
            key={i}
            className="move-input"
            placeholder={`Move ${i + 1}`}
            value={move}
            onChange={(e) => {
              const newMoves = [...pokemon.moves];
              newMoves[i] = e.target.value;
              onUpdate(index, { ...pokemon, moves: newMoves });
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamCard;
