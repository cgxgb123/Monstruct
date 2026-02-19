// src/pages/Dashboard.tsx
import { toGif } from '../utils/helpers.ts';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_MY_TEAMS, DELETE_TEAM } from '../utils/mutations.ts';
import { useNavigate } from 'react-router-dom';
import '../css/Dashboard.css';

interface TeamMember {
  species: string;
  item?: string;
  ability?: string;
  teraType?: string;
  shiny?: boolean;
}

interface Team {
  _id: string;
  teamName: string;
  format: string;
  members: TeamMember[] | null;
}

interface TeamData {
  me: {
    _id: string;
    username: string;
    teams: Team[] | null;
  } | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery<TeamData>(GET_MY_TEAMS, {
    fetchPolicy: 'network-only',
  });

  const [deleteTeam] = useMutation(DELETE_TEAM, {
    refetchQueries: [{ query: GET_MY_TEAMS }],
    onCompleted: () => {
      alert('Team deleted successfully!');
    },
    onError: (err) => {
      alert(`Failed to delete team: ${err.message}`);
    },
  });

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your teams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error-state">
          <h2>⚠️ Error Loading Teams</h2>
          <p>{error.message}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  const teams = data?.me?.teams ?? [];
  const username = data?.me?.username ?? 'Trainer';

  const handleDelete = async (teamId: string, teamName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${teamName}"?\n\nThis action cannot be undone!`,
      )
    ) {
      try {
        await deleteTeam({ variables: { teamId } });
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>
              Welcome back, <span className="highlight">{username}</span>!
            </h1>
            <p className="subtitle">Manage your competitive Pokémon teams</p>
          </div>
          <div className="header-stats">
            <div className="stat-box">
              <span className="stat-number">{teams.length}</span>
              <span className="stat-label">Teams</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">
                {teams.reduce((acc, t) => acc + (t.members?.length ?? 0), 0)}
              </span>
              <span className="stat-label">Pokémon</span>
            </div>
          </div>
        </div>
        <button className="create-team-btn" onClick={() => navigate('/')}>
          + Create New Team
        </button>
      </header>

      {teams.length === 0 ? (
        <div className="empty-state">
          <img
            src="https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyZDB4eDVwazA1OW9qdjc2M29pYjhhd2w5N3Y5M3RzcmZwNTZxMWFlZiZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/tfnfQi1gFonKZWmt2c/source.gif"
            alt="Empty Team Icon"
            className="empty-icon"
          />
          <h2>No teams saved yet</h2>
          <p>Start building your dream team in the Team Builder!</p>
          <button
            className="create-team-btn large"
            onClick={() => navigate('/')}
          >
            Build Your First Team
          </button>
        </div>
      ) : (
        <div className="teams-grid">
          {teams.map((team) => {
            const members = team.members ?? [];

            return (
              <div key={team._id} className="team-card">
                <div className="team-card-header">
                  <div className="team-title-section">
                    <h3 className="team-name">
                      {team.teamName || 'Untitled Team'}
                    </h3>
                    <span className="format-badge">
                      {team.format || 'Unranked'}
                    </span>
                  </div>
                  <div className="team-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => navigate(`/?teamId=${team._id}`)}
                      title="Edit Team"
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() =>
                        handleDelete(team._id, team.teamName || 'Untitled Team')
                      }
                      title="Delete Team"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="team-members-preview">
                  {members.length > 0 ? (
                    <div className="mini-sprites">
                      {members.slice(0, 6).map((mon, i) => {
                        const spriteName = toGif(mon?.species || 'unknown');

                        const spriteUrl = mon?.shiny
                          ? `https://play.pokemonshowdown.com/sprites/ani-shiny/${spriteName}.gif`
                          : `https://play.pokemonshowdown.com/sprites/ani/${spriteName}.gif`;

                        return (
                          <div
                            key={`${team._id}-mon-${i}`}
                            className="mini-mon"
                            title={mon?.species}
                          >
                            <div className="sprite-container">
                              <img
                                src={spriteUrl}
                                alt={mon?.species || 'Pokemon'}
                                className="mini-sprite"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    'https://play.pokemonshowdown.com/sprites/ani/unown.gif';
                                }}
                              />
                              {mon?.shiny && (
                                <span className="shiny-indicator">✨</span>
                              )}
                            </div>
                            <span className="mini-name">
                              {mon?.species?.substring(0, 12) ?? 'Unknown'}
                              {mon?.species && mon.species.length > 12
                                ? '...'
                                : ''}
                            </span>
                            {mon?.item && (
                              <span className="mini-item">{mon.item}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="no-members">No Pokémon in this team</p>
                  )}
                </div>

                <div className="team-card-footer">
                  <div className="team-info">
                    <span className="member-count">
                      {members.length}/6 Pokémon
                    </span>
                  </div>
                  <button
                    className="view-team-btn"
                    onClick={() => navigate(`/?teamId=${team._id}`)}
                  >
                    View Team →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
