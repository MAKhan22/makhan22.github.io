import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, BookOpen, Code } from 'lucide-react';
import { Experience } from '../utils/types';

interface ExperienceCardProps {
  experience: Experience;
  index: number;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, index }) => {
  const icons = {
    work: Briefcase,
    internship: Code,
    research: BookOpen,
    teaching: GraduationCap,
  };

  const Icon = icons[experience.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-8 pb-8 group"
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-zinc-300 dark:bg-zinc-700 group-last:hidden" />
      
      {/* Timeline dot */}
      <div className="absolute left-0 top-1.5 -ml-[5px] w-3 h-3 rounded-full bg-primary dark:bg-primary-dark ring-4 ring-white dark:ring-background-dark" />
      
      {/* Icon */}
      <div className="absolute left-0 top-0 -ml-10 mt-1">
        <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary-dark/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary dark:text-primary-dark" />
        </div>
      </div>

      {/* Content */}
      <div>
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">
            {experience.role}
          </h3>
          <span className="text-sm text-muted-light dark:text-muted-dark whitespace-nowrap ml-4">
            {experience.period}
          </span>
        </div>
        <p className="text-primary dark:text-primary-dark font-medium mb-2">
          {experience.organization}
        </p>
        <div className="text-muted-light dark:text-muted-dark">
          {experience.description
            .split('\n')
            .flatMap((line) =>
              line.split(/(?<=\.)\s+/).map((s) => s.trim()).filter(Boolean)
            )
            .map((sentence, idx) => {
              const parts = sentence.split(/(\*\*.*?\*\*)/g);
              return (
                <p key={idx} className="leading-relaxed">
                  {parts.map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={i} className="font-semibold text-text-light dark:text-text-dark">{part.slice(2, -2)}</strong>;
                    }
                    return <span key={i}>{part}</span>;
                  })}
                </p>
              );
            })}
        </div>
      </div>
    </motion.div>
  );
};
