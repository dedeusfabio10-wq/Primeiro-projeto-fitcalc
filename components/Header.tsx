import React from 'react';
import Logo from './Logo';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Logo />
      </div>
    </header>
  );
};

export default Header;
