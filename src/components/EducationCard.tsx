import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { Education } from '../utils/types';

interface EducationCardProps {
  education: Education;
  index: number;
}

export const EducationCard: React.FC<EducationCardProps> = ({ education, index }) => {
  const period = `${education.startDate} – ${education.endDate}${education.current ? ' (current)' : ''}`;

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

      <div className="absolute left-0 top-0 -ml-10 mt-1">
        <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary-dark/10 flex items-center justify-center">
          <GraduationCap className="w-4 h-4 text-primary dark:text-primary-dark" />
        </div>
      </div>

      <div>
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">
            {education.degree}
          </h3>
          <span className="text-sm text-muted-light dark:text-muted-dark whitespace-nowrap ml-4">
            {period}
          </span>
        </div>
        <p className="text-primary dark:text-primary-dark font-medium mb-2">
          {education.institution}
        </p>
        <p className="text-sm text-muted-light dark:text-muted-dark mb-2">
          {education.location}
        </p>
        <div className="text-sm text-muted-light dark:text-muted-dark space-y-1.5">
          {education.summary && (
            <p className="leading-relaxed">{education.summary}</p>
          )}
          {(education.cgpa || education.grade) && (
            <p className="font-medium text-text-light dark:text-text-dark">
              Grade: {education.cgpa ?? education.grade}
              {education.honors ? ` (${education.honors})` : ''}
            </p>
          )}
          {education.coursework && education.coursework.length > 0 && (
            <p>
              <span>Coursework:</span>{' '}
              {education.coursework.slice(0, 7).join(', ')}
              {education.coursework.length > 7 && `...`}
            </p>
          )}
          {education.activities && education.activities.length > 0 && (
            <p className="mt-1">
              <span>Volunteering:</span>{' '}
              {education.activities.join(', ')}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
