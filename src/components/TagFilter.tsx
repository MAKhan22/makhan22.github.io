import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { groupTagsByCategory, getCategoryColor, getCategoryLabel } from '../utils/filters';

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
  projectCounts?: Record<string, number>;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  selectedTags,
  onTagToggle,
  onClearAll,
  projectCounts = {},
}) => {
  const groupedTags = useMemo(() => groupTagsByCategory(tags), [tags]);
  
  const categoryOrder: Array<'language' | 'tech-stack' | 'libraries' | 'cs-field' | 'other'> = [
    'language',
    'tech-stack',
    'libraries',
    'cs-field',
    'other'
  ];

  // State to track which categories are expanded (default all expanded)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categoryOrder)
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">
          Filter by Tags
        </h3>
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-muted-light dark:text-muted-dark"
          >
            <X className="w-4 h-4 mr-1" />
            Clear ({selectedTags.length})
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {categoryOrder.map((category) => {
          const categoryTags = groupedTags[category];
          if (categoryTags.length === 0) return null;

          const categoryColor = getCategoryColor(category);
          const categoryLabel = getCategoryLabel(category);
          const isExpanded = expandedCategories.has(category);

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryOrder.indexOf(category) * 0.1 }}
            >
              <button
                onClick={() => toggleCategory(category)}
                className={`w-full flex items-center justify-between text-sm font-semibold mb-2 pb-1 border-b ${categoryColor} hover:opacity-80 transition-opacity cursor-pointer`}
              >
                <span>{categoryLabel}</span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {categoryTags.map((tag) => {
                        const isSelected = selectedTags.includes(tag);
                        const count = projectCounts[tag] || 0;

                        return (
                          <motion.button
                            key={tag}
                            onClick={() => onTagToggle(tag)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 border ${
                              isSelected
                                ? 'bg-primary text-white dark:bg-primary-dark shadow-md border-primary dark:border-primary-dark'
                                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 border-zinc-300 dark:border-zinc-700'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            {tag}
                            {count > 0 && (
                              <span
                                className={`text-xs px-1 py-0.5 rounded ${
                                  isSelected
                                    ? 'bg-white/20'
                                    : 'bg-zinc-300 dark:bg-zinc-700'
                                }`}
                              >
                                {count}
                              </span>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {selectedTags.length > 0 && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-light dark:text-muted-dark mt-4"
        >
          Showing projects with: {selectedTags.join(', ')}
        </motion.p>
      )}
    </div>
  );
};
