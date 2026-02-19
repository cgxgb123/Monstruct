import { useState, useEffect } from 'react';

export const ThemeToggle = () => {
  const [isCherish, setIsCherish] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'cherish') {
      setIsCherish(true);
      document.documentElement.classList.add('cherish-mode');
    } else if (savedTheme === 'beast') {
      document.documentElement.classList.remove('cherish-mode');
      document.documentElement.classList.add('beast-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isCherish;
    setIsCherish(newMode);
    localStorage.setItem('theme', newMode ? 'cherish' : 'beast');

    if (newMode) {
      document.documentElement.classList.add('cherish-mode');
    } else {
      document.documentElement.classList.remove('cherish-mode');
    }
  };

  return (
    <button className="theme-toggle-btn" onClick={toggleTheme}>
      <img
        src={
          isCherish
            ? 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cherish-ball.png'
            : 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/beast-ball.png'
        }
        alt="Toggle Theme"
        className="ball-icon"
      />
      <span>{isCherish ? 'CHERISH MODE' : 'BEAST MODE'}</span>
    </button>
  );
};
