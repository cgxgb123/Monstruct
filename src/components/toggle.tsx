import { useState } from 'react';

export const ThemeToggle = () => {
  const [isCherish, setIsCherish] = useState(false);

  const toggleTheme = () => {
    setIsCherish(!isCherish);
    document.body.classList.toggle('cherish-mode');
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
