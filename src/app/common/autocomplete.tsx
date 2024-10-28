"use client";
import React, { useRef, useState, useEffect } from 'react';

interface AutocompleteProps {
  options: string[];
  onSelect: (option: string) => void;
}

export default function Autocomplete({ options, onSelect }: AutocompleteProps) {
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [inputValue, setInputValue] = useState<string>('');
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [position, setPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
      setFilteredOptions(
        options.filter(option =>
          option.toLowerCase().includes(value.toLowerCase())
        )
      );
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    setShowOptions(false);
    onSelect(option);
  };

  const openList = (e: React.MouseEvent<HTMLInputElement>) => {
    setPosition({
      top: e.clientY - 70,
      left: e.clientX - 500,
    });
    setShowOptions(true);
  };

  useEffect(() => {
    if (inputValue === '') {
      setShowOptions(false);
    }
  }, [inputValue]);

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        className="form-input"
        value={inputValue}
        onClick={openList}
        onChange={handleInputChange}
        onBlur={() => setTimeout(() => setShowOptions(false), 100)}
      />
      {showOptions && (
        <ul className="autocomplete-list"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}>
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};