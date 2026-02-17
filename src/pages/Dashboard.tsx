import { useQuery } from '@apollo/client/react';
import { GET_MY_TEAMS } from '../utils/mutations.ts';
import '../css/Dashboard.css';

const Dashboard = () => {
  const { loading, data } = useQuery(GET_MY_TEAMS);

  if (loading) return <div>Loading Teams...</div>;

  return (
    <div className="dashboard">
      <h1>Your Saved Teams</h1>
      <div className="teams-grid">
        {data?.me?.teams.map((team: any) => (
          <div key={team._id} className="team-card monstruct-card">
            <h3>{team.teamName}</h3>
            <p className="format-badge">{team.format}</p>
            <div className="mini-sprites">
              {team.members.map((mon: any, i: number) => (
                <div key={i} className="mini-mon">
                  {/* Using a simple sprite fallback */}
                  <img
                    src={`https://play.pokemonshowdown.com/sprites/ani/${mon.name.toLowerCase()}.gif`}
                    alt={mon.name}
                  />
                  <span>{mon.name}</span>
                </div>
              ))}
            </div>
            <button className="view-btn">Edit Team</button>
          </div>
        ))}
      </div>
    </div>
  );
};
