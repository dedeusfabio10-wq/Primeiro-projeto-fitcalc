import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <Link to="/" className={`flex items-center space-x-2 group ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-teal-500 group-hover:opacity-90 transition-opacity"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
          fill="url(#logo-gradient)"
        />
        <defs>
          <linearGradient id="logo-gradient" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
            <stop stopColor="#14B8A6" /> 
            <stop offset="1" stopColor="#06B6D4" /> 
          </linearGradient>
        </defs>
      </svg>
      <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600 group-hover:opacity-90 transition-opacity">
        FitCalc Premium
      </span>
    </Link>
  );
};

export default Logo;
