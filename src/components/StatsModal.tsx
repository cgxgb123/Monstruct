import { createPortal } from 'react-dom';
import { toTitleCase } from '../api/pokeApi';

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  atk: 'Atk',
  def: 'Def',
  spa: 'SpA',
  spd: 'SpD',
  spe: 'Spe',
};

const StatsModal = ({ pokemon, onClose, onUpdate, recommended }: any) => {
  const applySuggestedSpread = () => {
    if (!recommended) return;
    const [nature, evString] = recommended.split(':');
    const evValues = evString.split('/').map(Number);

    const newEvs = {
      hp: evValues[0],
      atk: evValues[1],
      def: evValues[2],
      spa: evValues[3],
      spd: evValues[4],
      spe: evValues[5],
    };

    onUpdate({ ...pokemon, nature, evs: newEvs });
  };

  return createPortal(
    <div className="modal-overlay">
      <div className="stats-modal">
        <div className="modal-header">
          <h3>{toTitleCase(pokemon.name)} Training</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {recommended && (
          <button className="suggested-btn" onClick={applySuggestedSpread}>
            Apply Smogon Meta Spread
          </button>
        )}

        <div className="stats-grid">
          <div className="nature-selector">
            <label>Nature:</label>
            <input
              value={pokemon.nature || 'Hardy'}
              onChange={(e) => onUpdate({ ...pokemon, nature: e.target.value })}
            />
          </div>

          {Object.keys(STAT_LABELS).map((s) => (
            <div key={s} className="stat-row">
              <label>{STAT_LABELS[s]}</label>
              <div className="stat-inputs">
                <input
                  type="number"
                  placeholder="EV"
                  value={pokemon.evs?.[s] || 0}
                  onChange={(e) => {
                    const val = Math.min(252, parseInt(e.target.value) || 0);
                    onUpdate({ ...pokemon, evs: { ...pokemon.evs, [s]: val } });
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="252"
                  step="4"
                  value={pokemon.evs?.[s] || 0}
                  onChange={(e) =>
                    onUpdate({
                      ...pokemon,
                      evs: { ...pokemon.evs, [s]: parseInt(e.target.value) },
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="IV"
                  className="iv-input"
                  value={pokemon.ivs?.[s] ?? 31}
                  onChange={(e) => {
                    const val = Math.min(31, parseInt(e.target.value) || 0);
                    onUpdate({ ...pokemon, ivs: { ...pokemon.ivs, [s]: val } });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default StatsModal;
