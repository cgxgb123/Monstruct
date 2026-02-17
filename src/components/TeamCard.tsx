import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar.tsx';
import { TERA_TYPES } from '../utils/teraTypes.ts';
import { toTitleCase, fetchAbility, fetchMoveDetails } from '../api/pokeApi.ts';
import { SearchResult } from '../utils/types.ts';
import '../css/TeamCard.css';

const SPRITE = import.meta.env.SPRITE_CDN;

const TeamCard = ({ pokemon, index, onUpdate, onDelete }: any) => {
  const [showTeraMenu, setShowTeraMenu] = useState(false);
  const [allGameItems, setAllGameItems] = useState<any[]>([]);
  const [availableMoves, setAvailableMoves] = useState<string[]>([]);
  const [hoverInfo, setHoverInfo] = useState('');

  useEffect(() => {
    if (pokemon?.url) {
      fetch(pokemon.url)
        .then((res) => res.json())
        .then((data) => {
          setAvailableMoves(
            data.moves.map((m: any) => toTitleCase(m.move.name)).sort(),
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

  // Ensure name is safe for CDN URL
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
        <button onClick={() => onDelete(index)}>×</button>
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
                <img
                  key={type}
                  src={TERA_TYPES[type]}
                  onClick={() => {
                    onUpdate(index, { ...pokemon, teraType: type });
                    setShowTeraMenu(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="details-grid">
        <div className="input-container">
          <input
            placeholder="Item"
            list={`items-${index}`}
            value={pokemon.item}
            onChange={(e) =>
              onUpdate(index, { ...pokemon, item: e.target.value })
            }
          />
          <datalist id={`items-${index}`}>
            {allGameItems.map((item, i) => (
              <option key={`${item}-${i}`} value={item} />
            ))}
          </datalist>
        </div>

        <input
          placeholder="Ability"
          value={pokemon.ability}
          onMouseEnter={async () =>
            setHoverInfo(await fetchAbility(pokemon.ability))
          }
          onMouseLeave={() => setHoverInfo('')}
          onChange={(e) =>
            onUpdate(index, { ...pokemon, ability: e.target.value })
          }
        />
      </div>

      <div className="moves-grid">
        {pokemon.moves.map((move: string, i: number) => (
          <div key={i} className="move-container">
            <input
              placeholder={`Move ${i + 1}`}
              list={`moves-${index}`}
              value={move}
              onMouseEnter={async () => {
                const details = await fetchMoveDetails(move);
                if (details) setHoverInfo(details.description);
              }}
              onMouseLeave={() => setHoverInfo('')}
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

      {hoverInfo && <div className="hover-tooltip">{hoverInfo}</div>}
    </div>
  );
};

export default TeamCard;
