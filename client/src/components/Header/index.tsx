import * as React from 'react';
import './Header.css';

const Header = ({ title, bgColor, textColor }) => {
  return (
    <header style={{ background: `${bgColor}`, color: `${textColor}` }}>
      {title}
    </header>
  );
};

export default Header;
