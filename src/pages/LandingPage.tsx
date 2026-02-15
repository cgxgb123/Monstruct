import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { LOGIN, SIGNUP } from '../utils/mutations.ts';
import Auth from '../utils/auth.ts';
import { LoginData } from '../utils/auth.ts';
import { SignupData } from '../utils/auth.ts';
import Loader from '../components/Loader.tsx';
import logo from '../assets/monstruct_logo.png';
import '../css/LandingPage.css';

const LandingPage = () => {
  const [isEvolving, setIsEvolving] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [login] = useMutation<LoginData>(LOGIN);
  const [signup] = useMutation<SignupData>(SIGNUP);

  const handleOrbClick = () => setIsEvolving(true);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (isLogin) {
        const { data } = await login({
          variables: { email: formState.email, password: formState.password },
        });
        if (data?.login.token) {
          Auth.login(data.login.token);
        }
      } else {
        const { data } = await signup({ variables: { ...formState } });
        if (data?.signup.token) {
          Auth.login(data.signup.token);
        }
      }
    } catch (e) {
      console.error('Authentication failed:', e);
    }
  };

  return (
    <div className={`landing-wrapper ${isEvolving ? 'active-evolution' : ''}`}>
      {!isEvolving ? (
        <div className="orb-trigger" onClick={handleOrbClick}>
          <Loader />
          <p className="pulse-text">Click to Evolve</p>
        </div>
      ) : (
        <div className="auth-modal-reveal">
          <form className="auth-form" onSubmit={handleFormSubmit}>
            <img src={logo} alt="Monstruct Logo" className="logo" />
            <h2>{isLogin ? 'Welcome Back' : 'Begin Journey'}</h2>
            {!isLogin && (
              <input
                placeholder="Username"
                name="username"
                onChange={(e) =>
                  setFormState({ ...formState, username: e.target.value })
                }
              />
            )}
            <input
              placeholder="Email"
              name="email"
              type="email"
              onChange={(e) =>
                setFormState({ ...formState, email: e.target.value })
              }
            />
            <input
              placeholder="Password"
              name="password"
              type="password"
              onChange={(e) =>
                setFormState({ ...formState, password: e.target.value })
              }
            />
            <button type="submit" className="submit-btn">
              {isLogin ? 'Login' : 'Signup'}
            </button>
            <p onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
              {isLogin ? 'Need an account? Sign up' : 'Have an account? Log in'}
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
