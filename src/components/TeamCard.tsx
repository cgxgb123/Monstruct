import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar.tsx';
import { TERA_TYPES } from '../utils/teraTypes.ts';
import {
  toTitleCase,
  fetchAbility,
  fetchMoveDetails,
  fetchItemDetails,
} from '../api/pokeApi.ts';
import { SearchResult } from '../utils/types.ts';
import '../css/TeamCard.css';

const SPRITE = import.meta.env.SPRITE_CDN;

const TeamCard = ({ pokemon, index, onUpdate, onDelete }: any) => {
  const [showTeraMenu, setShowTeraMenu] = useState(false);
  const [allGameItems, setAllGameItems] = useState<any[]>([]);
  const [availableMoves, setAvailableMoves] = useState<string[]>([]);
  const [possibleAbilities, setPossibleAbilities] = useState<string[]>([]);
  const [hoverInfo, setHoverInfo] = useState<any>(null);

  useEffect(() => {
    if (pokemon?.url) {
      fetch(pokemon.url)
        .then((res) => res.json())
        .then((data) => {
          setAvailableMoves(
            data.moves.map((m: any) => toTitleCase(m.move.name)).sort(),
          );
          setPossibleAbilities(
            data.abilities.map((a: any) => toTitleCase(a.ability.name)),
          );
        });
    }
  }, [pokemon?.name]);

  useEffect(() => {
    const cached = localStorage.getItem('items_full_cache');
    if (cached) {
      setAllGameItems(JSON.parse(cached));
      return;
    }
    fetch('https://pokeapi.co/api/v2/item?limit=2000')
      .then((res) => res.json())
      .then((data) => {
        const items = data.results.map((i: any) => toTitleCase(i.name));
        setAllGameItems(items);
        localStorage.setItem('items_full_cache', JSON.stringify(items));
      });
  }, []);

  if (!pokemon) {
    return (
      <div className="team-card empty-slot">
        <SearchBar
          onSelect={(data: SearchResult) =>
            onUpdate(index, {
              ...data,
              moves: ['', '', '', ''],
              item: '',
              ability: '',
              teraType: 'Normal',
            })
          }
        />
      </div>
    );
  }

  const safeName = pokemon.name
    .toLowerCase()
    .trim()
    .replace(/ /g, '-')
    .replace(/[^\w-]/g, '');
  const spriteUrl = pokemon.isShiny
    ? `${SPRITE}/animated-shiny/${safeName}.gif`
    : `${SPRITE}/animated/${safeName}.gif`;

  return (
    <div className="team-card filled-slot">
      <div className="card-header">
        <span>{toTitleCase(pokemon.name)}</span>
        <button className="delete-btn" onClick={() => onDelete(index)}>
          ×
        </button>
      </div>

      <div className="visuals-row">
        <img
          src={spriteUrl}
          alt={pokemon.name}
          className="pokemon-sprite"
          onError={(e) =>
            (e.currentTarget.src = `${SPRITE}/official-artwork/${safeName}.png`)
          }
        />
        <div className="tera-wrapper">
          <img
            src={TERA_TYPES[toTitleCase(pokemon.teraType)] || TERA_TYPES.Normal}
            className="tera-icon-current"
            onClick={() => setShowTeraMenu(!showTeraMenu)}
          />
          {showTeraMenu && (
            <div className="tera-dropdown">
              {Object.keys(TERA_TYPES).map((type) => (
                <div
                  key={type}
                  className="tera-option"
                  onClick={() => {
                    onUpdate(index, { ...pokemon, teraType: type });
                    setShowTeraMenu(false);
                  }}
                >
                  <img src={TERA_TYPES[type]} alt={type} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="details-grid">
        <div className="input-container">
          <input
            className="detail-input"
            placeholder="Item"
            list={`items-${index}`}
            value={pokemon.item}
            onChange={(e) =>
              onUpdate(index, { ...pokemon, item: e.target.value })
            }
            onMouseEnter={async () => {
              if (!pokemon.item) return;
              const details = await fetchItemDetails(pokemon.item);
              if (details) setHoverInfo({ category: 'item', ...details });
            }}
            onMouseLeave={() => setHoverInfo(null)}
          />
          <datalist id={`items-${index}`}>
            {allGameItems.map((item, i) => (
              <option key={`${item}-${i}`} value={item} />
            ))}
          </datalist>
        </div>

        <div className="input-container">
          <input
            className="detail-input"
            placeholder="Ability"
            list={`abilities-${index}`}
            value={pokemon.ability}
            onChange={(e) =>
              onUpdate(index, { ...pokemon, ability: e.target.value })
            }
            onMouseEnter={async () => {
              if (!pokemon.ability) return;
              const desc = await fetchAbility(pokemon.ability);
              if (desc)
                setHoverInfo({
                  category: 'ability',
                  description: desc,
                  name: pokemon.ability,
                });
            }}
            onMouseLeave={() => setHoverInfo(null)}
          />
          <datalist id={`abilities-${index}`}>
            {possibleAbilities.map((ab, i) => (
              <option key={`${ab}-${i}`} value={ab} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="moves-grid">
        {pokemon.moves.map((move: string, i: number) => (
          <div key={i} className="move-container">
            <input
              className="move-input"
              placeholder={`Move ${i + 1}`}
              list={`moves-${index}`}
              value={move}
              onMouseEnter={async () => {
                if (!move) return;
                const details = await fetchMoveDetails(move);
                if (details) setHoverInfo({ category: 'move', ...details });
              }}
              onMouseLeave={() => setHoverInfo(null)}
              onChange={(e) => {
                const newMoves = [...pokemon.moves];
                newMoves[i] = e.target.value;
                onUpdate(index, { ...pokemon, moves: newMoves });
              }}
            />
          </div>
        ))}
        <datalist id={`moves-${index}`}>
          {availableMoves.map((m, idx) => (
            <option key={`${m}-${idx}`} value={m} />
          ))}
        </datalist>
      </div>

      {/* FIXED HOVER MODAL */}
      {hoverInfo && (
        <div className="info-modal">
          <div className="modal-header">
            <span className="modal-title">{toTitleCase(hoverInfo.name)}</span>
            {hoverInfo.moveType && (
              <span
                className={`type-badge ${hoverInfo.moveType.toLowerCase()}`}
              >
                {hoverInfo.moveType}
              </span>
            )}
            {hoverInfo.category === 'item' && (
              <span className="type-badge">ITEM</span>
            )}
            {hoverInfo.category === 'ability' && (
              <span className="type-badge">ABILITY</span>
            )}
          </div>

          {hoverInfo.category === 'move' && (
            <div className="modal-stats">
              <div className="stat-item">
                <span className="stat-label">Pow</span>
                <span className="stat-value">{hoverInfo.power || '--'}</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-label">Acc</span>
                <span className="stat-value">
                  {hoverInfo.accuracy ? `${hoverInfo.accuracy}%` : '--'}
                </span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-label">PP</span>
                <span className="stat-value">{hoverInfo.pp || '--'}</span>
              </div>
            </div>
          )}

          <div className="modal-desc">
            {hoverInfo.description?.replace('$effect_chance', '10%')}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCard;
