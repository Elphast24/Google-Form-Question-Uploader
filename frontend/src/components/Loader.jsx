import React from 'react';
import '../styles/global.css';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;