import '../css/Loader.css';
const Loader = () => {
  return (
    <div className="loader">
      <div className="sphere" />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <mask id="waves" maskUnits="userSpaceOnUse">
            <g
              fill="none"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5,50 C25,50 30,20 50,20 C70,20 75,50 95,50" />
              <path d="M5,50 C25,50 30,20 50,20 C70,20 75,50 95,50" />
              <path d="M5,50 C25,50 30,80 50,80 C70,80 75,50 95,50" />
              <path d="M5,50 C25,50 30,80 50,80 C70,80 75,50 95,50" />
            </g>
          </mask>
          <mask id="blurriness" maskUnits="userSpaceOnUse">
            <g>
              <circle className="blur-outer" fill="white" />
              <ellipse className="blur-inner" fill="black" />
            </g>
          </mask>
          <mask id="clipping" maskUnits="userSpaceOnUse">
            <ellipse className="clip-mask" fill="white" />
          </mask>
          <mask id="fade" maskUnits="userSpaceOnUse">
            <ellipse className="fade-mask" fill="white" />
          </mask>
        </defs>
        <g id="shapes" mask="url(#fade)">
          <g mask="url(#clipping)">
            <circle
              className="wave-circle"
              fill="currentColor"
              mask="url(#waves)"
            />
          </g>
          <g mask="url(#blurriness)">
            <circle
              className="wave-circle"
              fill="currentColor"
              mask="url(#waves)"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Loader;
