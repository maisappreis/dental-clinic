import React, { useState } from 'react';

interface AutocompleteProps {
  options: string[];
  onSelect: (option: string) => void;
}

export default function Autocomplete({ options, onSelect }: AutocompleteProps) {
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [inputValue, setInputValue] = useState<string>('');
  const [showOptions, setShowOptions] = useState<boolean>(false);

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

  return (
    <>
      <input
        type="text"
        className="form-input"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowOptions(true)}
        onBlur={() => setTimeout(() => setShowOptions(false), 100)}
      />
      {showOptions && (
        <ul className="autocomplete-list">
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