import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children,
  onClick 
}) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    ghost: 'bg-transparent border-2 border-gray-300 text-gray-700 hover:border-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};