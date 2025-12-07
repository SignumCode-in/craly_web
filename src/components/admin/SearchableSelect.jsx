import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

const SearchableSelect = ({ options, value, onChange, placeholder = "Select..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors flex items-center justify-between"
      >
        <span className={selectedOption ? 'text-white' : 'text-soft-grey'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-dark border border-white/10 rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-white/10">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white placeholder-soft-grey"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-white/10 transition-colors ${
                    value === option.value ? 'bg-primary/20 text-primary' : 'text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-soft-grey">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;

