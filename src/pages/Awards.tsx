import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, GraduationCap, BookOpen, DollarSign, Award as AwardIcon } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import awardsData from '../data/awards.json';
import { Award } from '../utils/types';

export const Awards: React.FC = () => {
  const awards = awardsData as Award[];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const getAwardIcon = (type: string) => {
    switch (type) {
      case 'scholarship':
      case 'grant':
        return DollarSign;
      case 'academic':
        return GraduationCap;
      case 'research':
        return BookOpen;
      case 'competition':
        return Trophy;
      default:
        return AwardIcon;
    }
  };

  const getAwardColor = (type: string) => {
    switch (type) {
      case 'scholarship':
      case 'grant':
        return 'text-green-600 dark:text-green-400 bg-green-600/10 dark:bg-green-400/10';
      case 'academic':
        return 'text-blue-600 dark:text-blue-400 bg-blue-600/10 dark:bg-blue-400/10';
      case 'research':
        return 'text-purple-600 dark:text-purple-400 bg-purple-600/10 dark:bg-purple-400/10';
      case 'competition':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-600/10 dark:bg-yellow-400/10';
      default:
        return 'text-primary dark:text-primary-dark bg-primary/10 dark:bg-primary-dark/10';
    }
  };

  const getAwardTagBorderColor = (type: string) => {
    switch (type) {
      case 'academic':
        return '!border-blue-600/70 dark:!border-blue-400/60';
      case 'scholarship':
      case 'grant':
        return '!border-green-600/70 dark:!border-green-400/60';
      case 'research':
        return '!border-purple-600/70 dark:!border-purple-400/60';
      case 'competition':
        return '!border-yellow-600/70 dark:!border-yellow-400/60';
      default:
        return '!border-zinc-500/60 dark:!border-zinc-400/50';
    }
  };

  const getAwardTypes = (award: Award) => award.types ?? [];

  // Group by year
  const awardsByYear = awards.reduce((acc, award) => {
    if (!acc[award.year]) {
      acc[award.year] = [];
    }
    acc[award.year].push(award);
    return acc;
  }, {} as Record<number, Award[]>);

  const years = Object.keys(awardsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-primary dark:text-primary-dark" />
            <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark">
              Awards & Recognition
            </h1>
          </div>
          <p className="text-lg text-muted-light dark:text-muted-dark max-w-2xl">
            Honors, scholarships, grants, and achievements throughout my academic and professional journey.
          </p>
        </motion.div>

        {/* Awards by Year */}
        {years.length > 0 ? (
          years.map((year) => (
            <motion.section
              key={year}
              variants={container}
              initial="hidden"
              animate="show"
              className="mb-12"
            >
              <motion.h2
                variants={item}
                className="text-2xl font-bold text-text-light dark:text-text-dark mb-6 sticky top-16 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm py-2 z-10"
              >
                {year}
              </motion.h2>
              <motion.div
                variants={container}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {awardsByYear[year].map((award, index) => {
                  const types = getAwardTypes(award);
                  const firstType = types[0] ?? 'academic';
                  const Icon = getAwardIcon(firstType);
                  const colorClass = getAwardColor(firstType);

                  return (
                    <motion.div
                      key={`${award.title}-${index}`}
                      variants={item}
                      className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:shadow-lg hover:border-primary/50 dark:hover:border-primary-dark/50 transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${colorClass} flex-shrink-0`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-1">
                            {award.title}
                          </h3>
                          <p className="text-sm text-primary dark:text-primary-dark font-medium mb-2">
                            {award.issuer}
                          </p>
                          {award.description && (
                            <p className="text-sm text-muted-light dark:text-muted-dark mb-3">
                              {award.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 flex-wrap">
                            {types.map((t) => (
                              <Badge key={t} variant="secondary" className={`capitalize border ${getAwardTagBorderColor(t)}`}>
                                {t}
                              </Badge>
                            ))}
                            {award.amount && (
                              <Badge variant="outline" className="font-semibold">
                                {award.amount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.section>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Trophy className="w-16 h-16 text-muted-light dark:text-muted-dark mx-auto mb-4" />
            <p className="text-xl text-muted-light dark:text-muted-dark">
              No awards yet. Check back soon!
            </p>
          </motion.div>
        )}

        {/* Stats */}
        {awards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4"
          >
            <div className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-primary dark:text-primary-dark mb-1">
                {awards.length}
              </div>
              <div className="text-sm text-muted-light dark:text-muted-dark">Total</div>
            </div>
            <div className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {awards.filter((a) => getAwardTypes(a).includes('academic')).length}
              </div>
              <div className="text-sm text-muted-light dark:text-muted-dark">Academic</div>
            </div>
            <div className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                {awards.filter((a) => getAwardTypes(a).some((t) => t === 'scholarship' || t === 'grant')).length}
              </div>
              <div className="text-sm text-muted-light dark:text-muted-dark">Funding</div>
            </div>
            <div className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {awards.filter((a) => getAwardTypes(a).includes('research')).length}
              </div>
              <div className="text-sm text-muted-light dark:text-muted-dark">Research</div>
            </div>
            <div className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                {awards.filter((a) => getAwardTypes(a).includes('competition')).length}
              </div>
              <div className="text-sm text-muted-light dark:text-muted-dark">Competitions</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
