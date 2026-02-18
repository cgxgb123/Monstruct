// Monstruct\src\components\TeamCard.tsx:
import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar.tsx';
import { TERA_TYPES, TYPE_ICONS } from '../utils/teraTypes.ts';
import {
  toTitleCase,
  fetchAbility,
  fetchMoveDetails,
  fetchItemDetails,
} from '../api/pokeApi.ts';
import { SearchResult } from '../utils/types.ts';
import { fetchSmogonInsights } from '../api/smogonApi.ts';
import '../css/TeamCard.css';

const SPRITE = import.meta.env.SPRITE_CDN;
const STAT_KEYS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

const TeamCard = ({ pokemon, index, onUpdate, onDelete }: any) => {
  const [showTeraMenu, setShowTeraMenu] = useState(false);
  const [allGameItems, setAllGameItems] = useState<any[]>([]);
  const [availableMoves, setAvailableMoves] = useState<string[]>([]);
  const [possibleAbilities, setPossibleAbilities] = useState<string[]>([]);
  const [hoverInfo, setHoverInfo] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    if (pokemon?.name) {
      fetchSmogonInsights(pokemon.name).then((res) => setInsights(res));
    }
  }, [pokemon?.name]);

  useEffect(() => {
    if (!pokemon?.name) return;

    //  "Charizard Mega X" -> "charizard-mega-x"
    const apiName = pokemon.name.toLowerCase().trim().replace(/\s+/g, '-');
    const fetchUrl = `https://pokeapi.co/api/v2/pokemon/${apiName}`;

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        setAvailableMoves(
          data.moves.map((m: any) => toTitleCase(m.move.name)).sort(),
        );
        setPossibleAbilities(
          data.abilities.map((a: any) => toTitleCase(a.ability.name)),
        );

        onUpdate(index, {
          ...pokemon,
          types: data.types,
          url: fetchUrl,
          evs: pokemon.evs || { HP: 0, Atk: 0, Def: 0, SpA: 0, SpD: 0, Spe: 0 },
          ivs: pokemon.ivs || {
            HP: 31,
            Atk: 31,
            Def: 31,
            SpA: 31,
            SpD: 31,
            Spe: 31,
          },
        });
      })
      .catch((err) => console.error('API Sync failed for icons:', err));
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
              shiny: false,
              evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
              ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
            })
          }
        />
      </div>
    );
  }

  const handleStatChange = (stat: string, val: number) => {
    onUpdate(index, {
      ...pokemon,
      evs: { ...pokemon.evs, [stat]: Math.max(0, Math.min(252, val)) },
    });
  };

  const isShiny = pokemon.shiny || pokemon.isShiny;

  //  Charizard Mega X -> charizard-megax
  const animatedName = pokemon.name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-mega-([xy])/g, '-mega$1');

  const artworkName = animatedName.replace(/-/g, '');

  const spriteUrl = isShiny
    ? `${SPRITE}/animated-shiny/${animatedName}.gif`
    : `${SPRITE}/animated/${animatedName}.gif`;

  return (
    <div className="team-card filled-slot">
      <div className="card-header">
        <span>{toTitleCase(pokemon.name)}</span>
        <div className="header-actions">
          <button
            className={`shiny-btn ${isShiny ? 'active' : ''}`}
            onClick={() =>
              onUpdate(index, {
                ...pokemon,
                shiny: !isShiny,
                isShiny: !isShiny,
              })
            }
          >
            ✨
          </button>
          <button className="delete-btn" onClick={() => onDelete(index)}>
            ×
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="column-visuals">
          <img
            src={spriteUrl}
            alt={pokemon.name}
            className="pokemon-sprite"
            onError={(e) => {
              // charizardmegax.png
              e.currentTarget.src = `${SPRITE}/official-artwork/${artworkName}.png`;
            }}
          />
          <div className="pokemon-types">
            {pokemon.types?.map((typeEntry: any, idx: number) => {
              const typeName =
                typeof typeEntry === 'string'
                  ? typeEntry.toLowerCase()
                  : typeEntry?.type?.name?.toLowerCase();

              if (!typeName || !TYPE_ICONS[typeName]) return null;

              return (
                <img
                  key={`${typeName}-${idx}`}
                  src={TYPE_ICONS[typeName]}
                  alt={typeName}
                  className="type-badge"
                  style={{ width: '30px', height: 'auto' }}
                />
              );
            })}
          </div>
          <div className="tera-wrapper">
            <img
              src={
                TERA_TYPES[toTitleCase(pokemon.teraType)] || TERA_TYPES.Normal
              }
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

        <div className="column-inputs">
          <div className="details-grid">
            <div className="input-container">
              <input
                className="detail-input"
                placeholder="Item"
                list={`items-${index}`}
                value={pokemon.item || ''}
                onChange={(e) =>
                  onUpdate(index, { ...pokemon, item: e.target.value })
                }
                onMouseEnter={async () => {
                  if (pokemon.item) {
                    const d = await fetchItemDetails(pokemon.item);
                    if (d) setHoverInfo({ category: 'item', ...d });
                  }
                }}
                onMouseLeave={() => setHoverInfo(null)}
              />
              <datalist id={`items-${index}`}>
                {allGameItems.map((item, i) => (
                  <option key={i} value={item} />
                ))}
              </datalist>
            </div>
            <div className="input-container">
              <input
                className="detail-input"
                placeholder="Ability"
                list={`abilities-${index}`}
                value={pokemon.ability || ''}
                onChange={(e) =>
                  onUpdate(index, { ...pokemon, ability: e.target.value })
                }
                onMouseEnter={async () => {
                  if (pokemon.ability) {
                    const desc = await fetchAbility(pokemon.ability);
                    if (desc)
                      setHoverInfo({
                        category: 'ability',
                        name: pokemon.ability,
                        description: desc,
                      });
                  }
                }}
                onMouseLeave={() => setHoverInfo(null)}
              />
              <datalist id={`abilities-${index}`}>
                {possibleAbilities.map((ab, i) => (
                  <option key={i} value={ab} />
                ))}
              </datalist>
            </div>
          </div>
          <div className="moves-grid">
            {(pokemon.moves || ['', '', '', '']).map(
              (move: string, i: number) => (
                <input
                  key={i}
                  className="move-input"
                  placeholder={`Move ${i + 1}`}
                  list={`moves-${index}`}
                  value={move || ''}
                  onChange={(e) => {
                    const newMoves = [...(pokemon.moves || ['', '', '', ''])];
                    newMoves[i] = e.target.value;
                    onUpdate(index, { ...pokemon, moves: newMoves });
                  }}
                  onMouseEnter={async () => {
                    if (move) {
                      const d = await fetchMoveDetails(move);
                      if (d) setHoverInfo({ category: 'move', ...d });
                    }
                  }}
                  onMouseLeave={() => setHoverInfo(null)}
                />
              ),
            )}
            <datalist id={`moves-${index}`}>
              {availableMoves.map((m, idx) => (
                <option key={idx} value={m} />
              ))}
            </datalist>
          </div>
          {insights && (
            <div className="smogon-insights-panel">
              <div className="insight-item">
                <span className="label">SYNERGY:</span>
                <span className="insight-text">
                  {toTitleCase(pokemon.name)} is paired with{' '}
                  <strong>{toTitleCase(insights.partner)}</strong>{' '}
                  {insights.percent}% of the time.
                </span>
              </div>
              <div className="insight-item">
                <span className="label">Recommended Move:</span>
                <span>
                  Try Adding <strong>{toTitleCase(insights.swap)}</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="column-stats">
          {STAT_KEYS.map((s) => (
            <div key={s} className="stat-slider-row">
              <label>{s.toUpperCase()}</label>
              <input
                type="range"
                min="0"
                max="252"
                step="4"
                value={pokemon.evs?.[s] || 0}
                onChange={(e) => handleStatChange(s, parseInt(e.target.value))}
              />
              <span className="stat-number">{pokemon.evs?.[s] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {hoverInfo && (
        <div className="info-modal">
          <div className="modal-header">
            <div className="modal-title-group">
              <span className="modal-title">{toTitleCase(hoverInfo.name)}</span>
              <span className={`category-badge ${hoverInfo.category}`}>
                {hoverInfo.category}
              </span>
            </div>
            {hoverInfo.moveType && (
              <span
                className={`type-badge-text ${hoverInfo.moveType.toLowerCase()}`}
              >
                {hoverInfo.moveType}
              </span>
            )}
          </div>

          {hoverInfo.category === 'move' && (
            <div className="modal-move-stats">
              <div className="stat-column">
                <span className="stat-label">POW:</span>
                <span className="stat-value">{hoverInfo.power || '--'}</span>
              </div>
              <div className="stat-column">
                <span className="stat-label">ACC:</span>
                <span className="stat-value">
                  {hoverInfo.accuracy ? `${hoverInfo.accuracy}%` : '--'}
                </span>
              </div>
              <div className="stat-column">
                <span className="stat-label">PP:</span>
                <span className="stat-value">{hoverInfo.pp}</span>
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
