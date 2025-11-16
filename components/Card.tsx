import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
};

export default Card;