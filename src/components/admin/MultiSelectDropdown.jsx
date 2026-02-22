import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

const MultiSelectDropdown = ({
    options = [],
    value = [],
    onChange,
    placeholder = "Select..."
}) => {
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

    const selectedLabels = value.map(val => {
        const opt = options.find(o => o.value === val);
        return opt ? opt.label : val;
    });

    const toggleOption = (optValue) => {
        if (value.includes(optValue)) {
            onChange(value.filter(v => v !== optValue));
        } else {
            onChange([...value, optValue]);
        }
    };

    const removeValue = (e, valToRemove) => {
        e.stopPropagation();
        onChange(value.filter(v => v !== valToRemove));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="min-h-[42px] w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus-within:border-primary cursor-pointer flex flex-wrap gap-2 items-center transition-colors"
            >
                {value.length === 0 && (
                    <span className="text-soft-grey text-sm flex-1">{placeholder}</span>
                )}
                {value.map((val, idx) => (
                    <span key={idx} className="bg-primary/20 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1">
                        {options.find(o => o.value === val)?.label || val}
                        <button type="button" onClick={(e) => removeValue(e, val)} className="hover:text-white transition-colors">
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
                {value.length > 0 && <span className="flex-1" />}
                <ChevronDown className={`w-4 h-4 text-soft-grey transition-transform ml-auto ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-dark border border-white/10 rounded-lg shadow-lg max-h-60 overflow-hidden">
                    <div className="p-2 border-b border-white/10">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search..."
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white placeholder-soft-grey text-sm"
                            autoFocus
                        />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => {
                                const isSelected = value.includes(option.value);
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => toggleOption(option.value)}
                                        className={`w-full text-left px-4 py-2 hover:bg-white/10 transition-colors flex items-center gap-2 ${isSelected ? 'bg-primary/20 text-primary' : 'text-white'
                                            }`}
                                    >
                                        <div className={`w-4 h-4 rounded border ${isSelected ? 'bg-primary border-primary' : 'border-white/30'} flex items-center justify-center`}>
                                            {isSelected && <div className="w-2 h-2 bg-white rounded-sm" />}
                                        </div>
                                        {option.label}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-4 py-2 text-soft-grey text-sm">No options found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
