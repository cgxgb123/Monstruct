// src/pages/TeamBuilder.tsx:
import { useState, useEffect } from 'react';
import Typewriter from 'typewriter-effect';
import TeamCard from '../components/TeamCard.tsx';
import {
  exportTeamToText,
  parseShowdownImport,
} from '../utils/showdownParser.ts';
import { useMutation, useQuery } from '@apollo/client/react';
import { SAVE_TEAM, UPDATE_TEAM, GET_TEAM_BY_ID } from '../utils/mutations.ts';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../css/TeamBuilder.css';

const normalizeStats = (stats: any) => ({
  hp: stats?.hp ?? stats?.HP ?? 0,
  atk: stats?.atk ?? stats?.Atk ?? 0,
  def: stats?.def ?? stats?.Def ?? 0,
  spa: stats?.spa ?? stats?.SpA ?? 0,
  spd: stats?.spd ?? stats?.SpD ?? 0,
  spe: stats?.spe ?? stats?.Spe ?? 0,
});

const transformForGraphQL = (pokemon: any) => ({
  species: pokemon.name,
  nickname: pokemon.nickname || pokemon.name,
  shiny: pokemon.shiny || false,
  gender: 'N',
  level: 50,
  item: pokemon.item || '',
  ability: pokemon.ability || '',
  nature: pokemon.nature || 'Serious',
  teraType: pokemon.teraType || 'Normal',
  moves: pokemon.moves || ['', '', '', ''],
  evs: normalizeStats(pokemon.evs),
  ivs: normalizeStats(pokemon.ivs),
});

interface GetTeamData {
  getTeam: {
    _id: string;
    teamName: string;
    format: string;
    members: Array<{
      species: string;
      item?: string;
      ability?: string;
      teraType?: string;
      shiny?: boolean;
      nature?: string;
      moves: string[];
      evs: {
        hp: number;
        atk: number;
        def: number;
        spa: number;
        spd: number;
        spe: number;
      };
      ivs: {
        hp: number;
        atk: number;
        def: number;
        spa: number;
        spd: number;
        spe: number;
      };
    }> | null;
  } | null;
}

const TeamBuilder = () => {
  const [team, setTeam] = useState(Array(6).fill(null));
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [teamName, setTeamName] = useState('My Team');

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const teamId = searchParams.get('teamId');
  const isEditMode = !!teamId;

  const { data: teamData, loading: teamLoading } = useQuery<GetTeamData>(
    GET_TEAM_BY_ID,
    {
      variables: { teamId },
      skip: !isEditMode,
    },
  );

  useEffect(() => {
    if (teamData?.getTeam) {
      const loadedTeam = Array(6).fill(null);
      const members = teamData.getTeam.members || [];

      members.forEach((mon, i: number) => {
        if (i < 6 && mon?.species) {
          loadedTeam[i] = {
            name: mon.species,
            item: mon.item || '',
            ability: mon.ability || '',
            teraType: mon.teraType || 'Normal',
            shiny: mon.shiny || false,
            nature: mon.nature || 'Serious',
            moves: mon.moves || ['', '', '', ''],
            evs: mon.evs || { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
            ivs: mon.ivs || {
              hp: 31,
              atk: 31,
              def: 31,
              spa: 31,
              spd: 31,
              spe: 31,
            },
          };
        }
      });

      setTeam(loadedTeam);
      setTeamName(teamData.getTeam.teamName || 'My Team');
    }
  }, [teamData]);

  const [saveTeam] = useMutation(SAVE_TEAM);
  const [updateTeam] = useMutation(UPDATE_TEAM);

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
      const newTeam = Array(6).fill(null);
      parsedTeam.slice(0, 6).forEach((p, i) => (newTeam[i] = p));
      setTeam(newTeam);
      setImportModalOpen(false);
    } catch (e) {
      alert('Invalid Showdown format.');
    }
  };

  const handleSaveTeam = async () => {
    const filledSlots = team.filter((p) => p !== null && p.name);
    if (filledSlots.length === 0)
      return alert(
        'Team is empty! Please add at least one Pokémon before saving. <3',
      );

    try {
      const membersData = filledSlots.map(transformForGraphQL);
      if (isEditMode && teamId) {
        await updateTeam({
          variables: {
            teamId,
            teamName,
            format: 'gen9vgc2026regi',
            members: membersData,
          },
        });
        alert('Team updated successfully!');
      } else {
        await saveTeam({
          variables: {
            teamName,
            format: 'gen9vgc2026regi',
            members: membersData,
          },
        });
        alert('Team saved successfully!');
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Save Error:', err);
      alert(`Failed to save team: ${err.message}`);
    }
  };

  if (teamLoading && isEditMode) {
    return (
      <div className="builder-container">
        <div className="loading-state">Loading team...</div>
      </div>
    );
  }

  return (
    <div className="builder-container">
      <div className="toolbar">
        <h1 className="app-title">
          <span
            className="typing-text"
            style={{ color: 'var(--accent-color)', display: 'inline-block' }}
          >
            <Typewriter
              options={{
                strings: ['Build', 'Battle', 'Dominate'],
                autoStart: true,
                loop: true,
                delay: 75,
                deleteSpeed: 50,
              }}
            />
          </span>
        </h1>

        <div className="actions">
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team Name"
            className="team-name-input"
          />
          <button className="tool-btn" onClick={() => setImportModalOpen(true)}>
            Import
          </button>
          <button className="tool-btn" onClick={handleExport}>
            Export
          </button>
          <button className="tool-btn save-btn" onClick={handleSaveTeam}>
            {isEditMode ? 'Update Team' : 'Save Team'}
          </button>
          {isEditMode && (
            <button className="tool-btn" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
          )}
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
