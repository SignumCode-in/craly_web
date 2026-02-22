import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

const MultiTagInput = ({
    value = [],
    onChange,
    placeholder = "Add tags...",
    fetchSuggestions, // async function returning [{label, value}]
    onCreateNew, // async function when non-existing tag is added
}) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const getSuggestions = async () => {
            if (!fetchSuggestions) return;
            try {
                const query = inputValue.replace(/^#/, '');
                const results = await fetchSuggestions(query);
                setSuggestions(results || []);
            } catch (err) {
                console.error(err);
            }
        };
        const timer = setTimeout(() => { getSuggestions(); }, 300);
        return () => clearTimeout(timer);
    }, [inputValue, fetchSuggestions]);

    const handleAdd = async (tagStr) => {
        const cleanTag = tagStr.replace(/^#/, '').trim();
        if (!cleanTag) return;

        // Check if tag exists in the list
        if (value.includes(cleanTag)) {
            setInputValue('');
            setShowSuggestions(false);
            return;
        }

        if (onCreateNew) {
            try {
                const newRecord = await onCreateNew(cleanTag);
                onChange([...value, newRecord.name || cleanTag]);
            } catch (e) {
                console.error(e);
            }
        } else {
            onChange([...value, cleanTag]);
        }

        setInputValue('');
        setShowSuggestions(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            onChange(value.slice(0, -1));
        }
    };

    const removeTag = (indexToRemove) => {
        onChange(value.filter((_, idx) => idx !== indexToRemove));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="min-h-[42px] px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus-within:border-primary flex flex-wrap gap-2 items-center text-white">
                {value.map((tag, idx) => (
                    <span key={idx} className="bg-primary/20 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(idx)} className="hover:text-white transition-colors">
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder={value.length === 0 ? placeholder : ''}
                    className="bg-transparent border-none outline-none flex-1 min-w-[120px] text-sm placeholder-soft-grey"
                />
            </div>

            {showSuggestions && (inputValue.trim() || suggestions.length > 0) && (
                <div className="absolute z-50 w-full mt-1 bg-dark border border-white/10 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map((option, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleAdd(option.value)}
                            className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors text-white text-sm"
                        >
                            {option.label}
                        </button>
                    ))}
                    {inputValue.trim() && !suggestions.some(s => s.value.toLowerCase() === inputValue.trim().toLowerCase().replace(/^#/, '')) && (
                        <button
                            type="button"
                            onClick={() => handleAdd(inputValue)}
                            className="w-full text-left px-4 py-2 hover:bg-primary/20 transition-colors text-primary text-sm font-medium border-t border-white/5"
                        >
                            + Add "{inputValue.replace(/^#/, '')}"
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default MultiTagInput;
