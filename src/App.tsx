// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';
import TeamBuilder from './pages/TeamBuilder.tsx';
import LandingPage from './pages/LandingPage.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Auth from './utils/auth.ts';
import { ThemeToggle } from './components/toggle.tsx';
import logo from './assets/monstruct_logo.png';
import './css/App.css';

function App() {
  if (!Auth.loggedIn()) return <LandingPage />;

  return (
    <Router>
      <div className="box">
        <div className="content-wrapper">
          <header className="builder-header">
            <div className="nav-left">
              <ThemeToggle />
              <button className="logout-btn" onClick={() => Auth.logout()}>
                Logout
              </button>
              <nav className="main-nav">
                <Link
                  to="/"
                  className="nav-link"
                  style={{ color: 'var(--accent-color)' }}
                >
                  Builder
                </Link>
                <Link
                  to="/dashboard"
                  className="nav-link"
                  style={{ color: 'var(--accent-color)' }}
                >
                  Dashboard
                </Link>
              </nav>
            </div>

            <img src={logo} alt="Monstruct Logo" className="logo" />
          </header>

          <Routes>
            <Route path="/" element={<TeamBuilder />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
