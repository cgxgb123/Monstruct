import { useState } from 'react';
import TeamCard from '../components/TeamCard.tsx';
import {
  exportTeamToText,
  parseShowdownImport,
} from '../utils/showdownParser.ts';
import '../css/TeamBuilder.css';

const TeamBuilder = () => {
  const [team, setTeam] = useState(Array(6).fill(null));
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');

  const updateSlot = (index: number, data: any) => {
    const newTeam = [...team];
    newTeam[index] = data;
    setTeam(newTeam);
  };

  const deleteSlot = (index: number) => {
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
  };

  const handleExport = () => {
    const filledSlots = team.filter((p) => p !== null);
    if (filledSlots.length === 0) return alert('Team is empty!');

    const text = exportTeamToText(filledSlots);
    navigator.clipboard.writeText(text);
    alert('Team exported to clipboard in Showdown format!');
  };

  const handleImport = () => {
    try {
      const parsedTeam = parseShowdownImport(importText);
      // Fill the team array up to 6 slots
      const newTeam = Array(6).fill(null);
      parsedTeam.slice(0, 6).forEach((p, i) => (newTeam[i] = p));
      setTeam(newTeam);
      setImportModalOpen(false);
    } catch (e) {
      alert('Invalid Showdown format.');
    }
  };

  return (
    <div className="builder-container">
      <div className="toolbar">
        <h1 className="app-title">MonStruct Builder</h1>
        <div className="actions">
          <button className="tool-btn" onClick={() => setImportModalOpen(true)}>
            Import
          </button>
          <button className="tool-btn" onClick={handleExport}>
            Export
          </button>
        </div>
      </div>

      <div className="team-grid">
        {team.map((pokemon, index) => (
          <TeamCard
            key={index}
            index={index}
            pokemon={pokemon}
            onUpdate={updateSlot}
            onDelete={deleteSlot}
          />
        ))}
      </div>

      {/* Simple Import Modal */}
      {importModalOpen && (
        <div className="modal-overlay">
          <div className="import-modal">
            <h3>Import from Showdown</h3>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste team data here..."
              rows={10}
            />
            <div className="modal-actions">
              <button onClick={handleImport}>Import</button>
              <button onClick={() => setImportModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamBuilder;
