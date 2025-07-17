import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PriorityDropdown = ({ filterPriority, setFilterPriority, priority, setPriority, variant = "filter" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const priorities = variant === "filter" 
    ? [
        { value: 'All', label: 'All Priorities',},
        { value: 'High', label: 'High', icon: '🔴' },
        { value: 'Medium', label: 'Medium', icon: '🟡' },
        { value: 'Low', label: 'Low', icon: '🟢' }
      ]
    : [
        { value: '', label: 'Priority', icon: '⚙️' },
        { value: 'High', label: 'High', icon: '🔴' },
        { value: 'Medium', label: 'Medium', icon: '🟡' },
        { value: 'Low', label: 'Low', icon: '🟢' }
      ];

  const currentValue = variant === "filter" ? filterPriority : priority;
  const selectedPriority = priorities.find(p => p.value === currentValue);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    if (variant === "filter") {
      setFilterPriority(value);
    } else {
      setPriority(value);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Main dropdown button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md border text-sm font-semibold
          transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
          focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 
          min-w-[140px] justify-between ${
            variant === "filter" 
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-transparent"
              : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-transparent"
          }`}
      >
        <div className="flex items-center gap-2">
          {variant === "filter" && <Filter size={16} />}
          <span className="flex items-center gap-1">
            <span>{selectedPriority?.icon}</span>
            <span className="font-medium">{selectedPriority?.label}</span>
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 
              rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 
              overflow-hidden z-50 min-w-[180px]"
          >
            {priorities.map((priority) => (
              <button
                key={priority.value}
                onClick={() => handleSelect(priority.value)}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 text-sm 
                  transition-all duration-150 hover:bg-gray-50 dark:hover:bg-gray-700
                  ${currentValue === priority.value 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium' 
                    : 'text-gray-700 dark:text-gray-300'
                  }`}
              >
                <span className="text-base">{priority.icon}</span>
                <span className="flex-1">{priority.label}</span>
                {currentValue === priority.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PriorityDropdown;
