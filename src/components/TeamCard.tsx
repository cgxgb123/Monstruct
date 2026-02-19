import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  atk: 'Atk',
  def: 'Def',
  spa: 'SpA',
  spd: 'SpD',
  spe: 'Spe',
};

const TeamCard = ({ pokemon, index, onUpdate, onDelete }: any) => {
  const [showTeraMenu, setShowTeraMenu] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
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
          evs: pokemon.evs || { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
          ivs: pokemon.ivs || {
            hp: 31,
            atk: 31,
            def: 31,
            spa: 31,
            spd: 31,
            spe: 31,
          },
          nature: pokemon.nature || 'Hardy',
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

  const applySmogonSpread = () => {
    if (!insights?.recommendedSpread) return;

    // Format: "Jolly:0/252/4/0/0/252"
    const [nature, evString] = insights.recommendedSpread.split(':');
    const evValues = evString.split('/').map(Number);

    onUpdate(index, {
      ...pokemon,
      nature: nature,
      evs: {
        hp: evValues[0],
        atk: evValues[1],
        def: evValues[2],
        spa: evValues[3],
        spd: evValues[4],
        spe: evValues[5],
      },
    });
  };

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
              nature: 'Hardy',
            })
          }
        />
      </div>
    );
  }
  const isShiny = pokemon.shiny || pokemon.isShiny;

  // 1. Convert to standard lowercase hyphenated (PokeAPI style)
  const baseName = pokemon.name.toLowerCase().trim().replace(/\s+/g, '-');

  // 2. The "Smash Rule": Paradoxes, Ruins, and multi-word species smash the first hyphen.
  // This targets: great-tusk -> greattusk, iron-valiant -> ironvaliant, ting-lu -> tinglu, etc.
  // But ignores: pikachu-phd, rotom-wash, etc.
  const animatedName = baseName
    .replace(
      /^(great|scream|brute|flutter|slither|sandy|iron|roaring|walking|gouging|raging|ting|chien|chi|wo|tapu|mr|type|mime)-/g,
      '$1',
    )
    .replace(/-mega-([xy])/g, '-mega$1');

  // 3. Keep a totally smashed version for the artwork fallback just in case
  const artworkName = baseName.replace(/-/g, '');

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
              e.currentTarget.src = `${SPRITE}/official-artwork/${artworkName}.png`;
            }}
          />
          <div className="pokemon-types">
            {pokemon.types?.map((typeEntry: any, idx: number) => {
              const typeName =
                typeof typeEntry === 'string'
                  ? typeEntry.toLowerCase()
                  : typeEntry?.type?.name?.toLowerCase();
              return typeName && TYPE_ICONS[typeName] ? (
                <img
                  key={idx}
                  src={TYPE_ICONS[typeName]}
                  alt={typeName}
                  className="type-badge"
                />
              ) : null;
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
                  {toTitleCase(pokemon.name)} +{' '}
                  <strong>{toTitleCase(insights.partner)}</strong> (
                  {insights.percent}%)
                </span>
              </div>
              <div className="insight-item">
                <span className="label">REC MOVE:</span>
                <span>
                  Try <strong>{toTitleCase(insights.swap)}</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="column-stats">
          <button
            className="edit-stats-trigger"
            onClick={() => setShowStatsModal(true)}
          >
            ✏️ Edit Stats & Nature
          </button>
          <div className="mini-stats-grid">
            {STAT_KEYS.filter((s) => pokemon.evs?.[s] > 0).map((s) => (
              <div key={s} className="mini-stat">
                {s.toUpperCase()}: {pokemon.evs[s]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showStatsModal &&
        createPortal(
          <div className="modal-overlay">
            <div className="stats-modal">
              <div className="modal-header">
                <h3>{toTitleCase(pokemon.name)} Training</h3>
                <button onClick={() => setShowStatsModal(false)}>×</button>
              </div>

              {insights?.recommendedSpread && (
                <button
                  className="smogon-apply-btn"
                  onClick={applySmogonSpread}
                >
                  Apply Suggested Nature (
                  {insights.recommendedSpread.split(':')[0]})
                </button>
              )}

              <div className="nature-row">
                <label>Nature:</label>
                <input
                  type="text"
                  value={pokemon.nature}
                  onChange={(e) =>
                    onUpdate(index, { ...pokemon, nature: e.target.value })
                  }
                />
              </div>

              <div className="stats-editor-grid">
                <div className="stat-row-header">
                  <span>Stat</span>
                  <span>EV (Max 252)</span>
                  <span>IV (Max 31)</span>
                </div>
                {STAT_KEYS.map((s) => (
                  <div key={s} className="stat-edit-row">
                    <label>{STAT_LABELS[s]}</label>
                    <input
                      type="number"
                      value={pokemon.evs?.[s] || 0}
                      onChange={(e) =>
                        onUpdate(index, {
                          ...pokemon,
                          evs: {
                            ...pokemon.evs,
                            [s]: Math.min(252, parseInt(e.target.value) || 0),
                          },
                        })
                      }
                    />
                    <input
                      type="range"
                      min="0"
                      max="252"
                      step="4"
                      value={pokemon.evs?.[s] || 0}
                      onChange={(e) =>
                        onUpdate(index, {
                          ...pokemon,
                          evs: {
                            ...pokemon.evs,
                            [s]: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                    <input
                      className="iv-input"
                      type="number"
                      value={pokemon.ivs?.[s] ?? 31}
                      onChange={(e) =>
                        onUpdate(index, {
                          ...pokemon,
                          ivs: {
                            ...pokemon.ivs,
                            [s]: Math.min(31, parseInt(e.target.value) || 0),
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}

      {hoverInfo && (
        <div className="info-modal">
          <div className="modal-header">
            {/* Name on the left */}
            <span className="modal-title">{toTitleCase(hoverInfo.name)}</span>

            {/* Badges pushed to the right */}
            <div className="modal-badges">
              <span className={`category-badge ${hoverInfo.category}`}>
                {hoverInfo.category}
              </span>
              {(hoverInfo.type || hoverInfo.moveType) && (
                <span
                  className={`type-badge-text ${(hoverInfo.type || hoverInfo.moveType).toLowerCase()}`}
                >
                  {(hoverInfo.type || hoverInfo.moveType).toUpperCase()}
                </span>
              )}
            </div>
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
            {hoverInfo.description?.replace('$effect_chance', '10%') ||
              'No description available.'}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCard;
