import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import publicationsData from '../data/publications.json';
import { Publication } from '../utils/types';

export const Publications: React.FC = () => {
  const publications = publicationsData as Publication[];

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

  // Group by year
  const publicationsByYear = publications.reduce((acc, pub) => {
    if (!acc[pub.year]) {
      acc[pub.year] = [];
    }
    acc[pub.year].push(pub);
    return acc;
  }, {} as Record<number, Publication[]>);

  const years = Object.keys(publicationsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-primary dark:text-primary-dark" />
            <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark">
              Research & Publications
            </h1>
          </div>
          <p className="text-lg text-muted-light dark:text-muted-dark max-w-2xl">
            My research contributions, published papers, and ongoing work in computer science.
          </p>
        </motion.div>

        {/* Publications by Year */}
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
              <motion.div variants={container} className="space-y-6">
                {publicationsByYear[year].map((pub, index) => (
                  <motion.div
                    key={`${pub.title}-${index}`}
                    variants={item}
                    className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:shadow-lg hover:border-primary/50 dark:hover:border-primary-dark/50 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-text-light dark:text-text-dark flex-1 pr-4">
                        {pub.title}
                      </h3>
                      <Badge variant="default">{pub.type}</Badge>
                    </div>

                    <p className="text-sm text-muted-light dark:text-muted-dark mb-2">
                      <span className="font-medium">Authors:</span> {pub.authors.join(', ')}
                    </p>

                    <p className="text-sm text-primary dark:text-primary-dark font-medium mb-3">
                      {pub.venue}
                    </p>

                    {pub.abstract && (
                      <p className="text-sm text-muted-light dark:text-muted-dark mb-4 leading-relaxed">
                        {pub.abstract}
                      </p>
                    )}

                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="secondary">{pub.status}</Badge>
                      {pub.link && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(pub.link, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Paper
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <BookOpen className="w-16 h-16 text-muted-light dark:text-muted-dark mx-auto mb-4" />
            <p className="text-xl text-muted-light dark:text-muted-dark">
              In the process of publishing my papers. Check back soon!
            </p>
          </motion.div>
        )}

        {/* Stats */}
        {publications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-primary dark:text-primary-dark mb-1">
                {publications.length}
              </div>
              <div className="text-sm text-muted-light dark:text-muted-dark">Total</div>
            </div>
            <div className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-primary dark:text-primary-dark mb-1">
                {publications.filter((p) => p.status === 'published').length}
              </div>
              <div className="text-sm text-muted-light dark:text-muted-dark">Published</div>
            </div>
            <div className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-primary dark:text-primary-dark mb-1">
                {publications.filter((p) => p.type === 'conference').length}
              </div>
              <div className="text-sm text-muted-light dark:text-muted-dark">Conference</div>
            </div>
            <div className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-primary dark:text-primary-dark mb-1">
                {publications.filter((p) => p.type === 'journal').length}
              </div>
              <div className="text-sm text-muted-light dark:text-muted-dark">Journal</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
