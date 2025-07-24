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
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg shadow-sm border-2 text-xs font-semibold
          transition-all duration-300 hover:shadow-md focus:outline-none
          min-w-[120px] justify-between transform hover:scale-105 ${
            variant === "filter"
              ? `${currentValue === 'All' ? 'bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-300 border-purple-400 dark:border-purple-400' : 'bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600'}`
              : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-400 dark:border-indigo-700 backdrop-blur-sm"
          }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-1.5">
          {variant === "filter" && (
            <motion.div
              animate={{ rotate: isOpen ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <Filter size={14} />
            </motion.div>
          )}
          <span className="flex items-center gap-1">
            <motion.span
              animate={{ scale: isOpen ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {selectedPriority?.icon}
            </motion.span>
            <span className="font-medium">{selectedPriority?.label}</span>
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        >
          <ChevronDown size={14} />
        </motion.div>
      </motion.button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            className="absolute top-full left-0 mt-2 w-full bg-white/90 dark:bg-gray-800/90 
              rounded-lg shadow-lg border border-purple-200 dark:border-purple-700 
              overflow-hidden z-50 min-w-[140px] backdrop-blur-md"
          >
            {priorities.map((priority, index) => (
              <motion.button
                key={priority.value}
                onClick={() => handleSelect(priority.value)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`w-full px-3 py-2 text-left flex items-center gap-2 text-xs 
                  transition-all duration-200 hover:bg-purple-50 dark:hover:bg-purple-900/20
                  hover:scale-[1.02] transform
                  ${currentValue === priority.value 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium' 
                    : 'text-gray-700 dark:text-gray-300'
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-sm">{priority.icon}</span>
                <span className="flex-1 font-medium">{priority.label}</span>
                {currentValue === priority.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-1.5 h-1.5 bg-purple-500 rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PriorityDropdown;
