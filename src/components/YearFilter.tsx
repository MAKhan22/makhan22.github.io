import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface YearFilterProps {
  years: number[];
  selectedYears: number[];
  onYearToggle: (year: number) => void;
  onClearYears: () => void;
  projectCounts?: Record<number, number>;
}

export const YearFilter: React.FC<YearFilterProps> = ({
  years,
  selectedYears,
  onYearToggle,
  onClearYears,
  projectCounts = {},
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">
          Filter by Year
        </h3>
        {selectedYears.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearYears}
            className="text-muted-light dark:text-muted-dark"
          >
            <X className="w-4 h-4 mr-1" />
            Clear years
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {years.map((year) => {
          const isSelected = selectedYears.includes(year);
          const count = projectCounts[year] || 0;

          return (
            <motion.button
              key={year}
              onClick={() => onYearToggle(year)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                isSelected
                  ? 'bg-primary text-white dark:bg-primary-dark shadow-md border-primary dark:border-primary-dark'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 border-zinc-300 dark:border-zinc-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {year}
              {count > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-white/20' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                >
                  {count}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
