import { useState, useEffect, useRef } from 'react';
import {
  fetchPokemonData,
  fetchMoveDetails,
  fetchItemDetails,
  toTitleCase,
} from '../api/pokeApi.ts';
import {
  StatBlock,
  PokemonData,
  COMMON_ITEMS,
  NATURES,
  POKEMON_TYPES,
} from '../utils/types.ts';
import { calculateStat } from '../utils/statsCalculations.ts';
import { TYPE_ICONS } from '../utils/teraTypes.ts';
import '../css/PokemonSlot.css';

const PokemonSlot = ({
  defaultName,
  onRemove,
}: {
  defaultName: string;
  onRemove: () => void;
}) => {
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [evs, setEvs] = useState<StatBlock>({
    hp: 0,
    atk: 0,
    def: 0,
    spa: 0,
    spd: 0,
    spe: 0,
  });
  const [ivs] = useState<StatBlock>({
    hp: 31,
    atk: 31,
    def: 31,
    spa: 31,
    spd: 31,
    spe: 31,
  });

  const [moves, setMoves] = useState(Array(4).fill(''));
  const [item, setItem] = useState('');
  const [nature, setNature] = useState('Hardy');
  const [teraType, setTeraType] = useState('Normal');
  const [hoveredInfo, setHoveredInfo] = useState<any>(null);
  const [activeDropdown, setActiveDropdown] = useState<{
    type: 'move' | 'item';
    index?: number;
  } | null>(null);

  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!defaultName) return;
    fetchPokemonData(defaultName)
      .then((data) => {
        setPokemon(data);
        if (data?.types?.[0]) {
          setTeraType(toTitleCase(data.types[0].type.name));
        }
      })
      .catch((err) => console.error('Failed to fetch:', defaultName, err));
  }, [defaultName]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (slotRef.current && !slotRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = (type: 'move' | 'item', index?: number) =>
    setActiveDropdown({ type, index });

  const handleSelection = (
    value: string,
    type: 'move' | 'item',
    index?: number,
  ) => {
    if (type === 'move' && typeof index === 'number') {
      const newMoves = [...moves];
      newMoves[index] = toTitleCase(value);
      setMoves(newMoves);
    } else if (type === 'item') {
      setItem(toTitleCase(value));
    }
    setActiveDropdown(null);
  };

  const handleHover = async (name: string, type: 'move' | 'item') => {
    if (!name) {
      setHoveredInfo(null);
      return;
    }
    try {
      const details =
        type === 'move'
          ? await fetchMoveDetails(name)
          : await fetchItemDetails(name);
      setHoveredInfo(details);
    } catch (e) {
      console.error(e);
    }
  };

  const getFilteredOptions = (query: string, type: 'move' | 'item') => {
    let source = type === 'move' ? pokemon?.moves || [] : COMMON_ITEMS;
    if (!query) return source.slice(0, 20);
    return source
      .filter((opt: string) => opt.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 15);
  };

  if (!pokemon) return <div className="monstruct-card p-4">Loading...</div>;

  const usedEvs = Object.values(evs).reduce((a, b) => a + b, 0);
  const remainingEvs = 508 - usedEvs;
  const spriteUrl = `https://play.pokemonshowdown.com/sprites/xyani/${pokemon.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.gif`;

  return (
    <div className="monstruct-card" ref={slotRef}>
      <button className="close-btn" onClick={onRemove}>
        ×
      </button>

      <div className="card-inner">
        <div className="identity-section">
          <div className="sprite-container">
            <img
              src={spriteUrl}
              onError={(e) => {
                (e.target as HTMLImageElement).src = pokemon.sprite;
              }}
              alt={pokemon.name}
              className="sprite-image"
            />
          </div>

          <div className="mon-name-display">{toTitleCase(pokemon.name)}</div>

          <div
            className="types-container"
            style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              margin: '10px 0',
            }}
          >
            {pokemon.types?.map((t: any) => {
              const typeName = toTitleCase(t.type.name);
              return (
                <img
                  key={t.type.name}
                  src={TYPE_ICONS[typeName as keyof typeof TYPE_ICONS]}
                  alt={typeName}
                  title={typeName}
                  style={{
                    height: '22px',
                    width: 'auto',
                    filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.3))',
                  }}
                />
              );
            })}
          </div>

          <div className="move-input-wrapper" style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Hold Item"
              className="move-input"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              onFocus={() => handleFocus('item')}
              onMouseEnter={() => handleHover(item, 'item')}
              onMouseLeave={() => setHoveredInfo(null)}
            />
            {activeDropdown?.type === 'item' && (
              <div className="dropdown-list">
                {getFilteredOptions(item, 'item').map((opt: string) => (
                  <div
                    key={opt}
                    className="dropdown-item"
                    onClick={() => handleSelection(opt, 'item')}
                  >
                    {toTitleCase(opt)}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="moves-grid">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="move-input-wrapper">
                <input
                  type="text"
                  placeholder={`Move ${index + 1}`}
                  className="move-input"
                  value={moves[index]}
                  onChange={(e) => {
                    const newMoves = [...moves];
                    newMoves[index] = e.target.value;
                    setMoves(newMoves);
                  }}
                  onFocus={() => handleFocus('move', index)}
                  onMouseEnter={() => handleHover(moves[index], 'move')}
                  onMouseLeave={() => setHoveredInfo(null)}
                />
                {activeDropdown?.type === 'move' &&
                  activeDropdown.index === index && (
                    <div className="dropdown-list">
                      {getFilteredOptions(moves[index], 'move').map(
                        (m: string) => (
                          <div
                            key={m}
                            className="dropdown-item"
                            onClick={() => handleSelection(m, 'move', index)}
                          >
                            {toTitleCase(m)}
                          </div>
                        ),
                      )}
                    </div>
                  )}
              </div>
            ))}
          </div>

          {hoveredInfo && (
            <div className="move-tooltip">
              <div className="tooltip-header">
                <span className="tooltip-title">{hoveredInfo.name}</span>
                {hoveredInfo.type && (
                  <span
                    className="type-badge"
                    style={{ backgroundColor: 'var(--type-bg)' }}
                  >
                    {hoveredInfo.type}
                  </span>
                )}
              </div>
              {hoveredInfo.power !== undefined && (
                <div className="tooltip-stats-grid">
                  <div className="tooltip-stat-box">
                    <span className="stat-val">{hoveredInfo.power || '-'}</span>
                    <span className="stat-key">Power</span>
                  </div>
                  <div className="tooltip-stat-box">
                    <span className="stat-val">
                      {hoveredInfo.accuracy || '-'}%
                    </span>
                    <span className="stat-key">Acc</span>
                  </div>
                  <div className="tooltip-stat-box">
                    <span className="stat-val">{hoveredInfo.pp || '-'}</span>
                    <span className="stat-key">PP</span>
                  </div>
                </div>
              )}
              <p className="tooltip-desc">{hoveredInfo.description}</p>
            </div>
          )}
        </div>

        <div className="stats-section">
          <div className="stats-header">
            <span>Base Stats</span>
            <span
              style={{
                color: remainingEvs < 0 ? '#d32f2f' : '#2e7d32',
                fontWeight: 'bold',
              }}
            >
              Rem: {remainingEvs}
            </span>
          </div>

          {(Object.keys(pokemon.stats) as Array<keyof StatBlock>).map(
            (stat) => {
              const total = calculateStat(
                stat,
                pokemon.stats[stat],
                evs[stat],
                ivs[stat],
              );
              return (
                <div key={stat} className="stat-row">
                  <span className="stat-label">{stat.toUpperCase()}</span>
                  <span className="base-stat">{pokemon.stats[stat]}</span>
                  <input
                    type="range"
                    min="0"
                    max="252"
                    step="4"
                    value={evs[stat]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (
                        remainingEvs - (val - evs[stat]) >= 0 ||
                        val < evs[stat]
                      ) {
                        setEvs({ ...evs, [stat]: val });
                      }
                    }}
                    className="ev-slider"
                  />
                  <span className="total-stat">{total}</span>
                </div>
              );
            },
          )}

          <div
            className="controls-footer"
            style={{
              marginTop: '15px',
              display: 'flex',
              gap: '10px',
              flexDirection: 'column',
            }}
          >
            <div className="footer-select-row">
              <label>Nature:</label>
              <select
                className="builder-select"
                value={nature}
                onChange={(e) => setNature(e.target.value)}
              >
                {NATURES.map((n: string) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="footer-select-row">
              <label>Tera:</label>
              <select
                className="builder-select"
                value={teraType}
                onChange={(e) => setTeraType(e.target.value)}
              >
                {POKEMON_TYPES.map((t: string) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonSlot;
