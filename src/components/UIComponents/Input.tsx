import React from 'react';

interface InputProps {
  inputType?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  label?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export const Input: React.FC<InputProps> = ({
  inputType = 'text',
  placeholder,
  label,
  required = false,
  value,
  onChange,
}) => {
  const baseStyles =
    'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        className={baseStyles}
      />
    </div>
  );
};

