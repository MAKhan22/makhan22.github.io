import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import publicationsData from '../data/publications.json';
import { Publication } from '../utils/types';

const formatStatus = (status: Publication['status']): string => {
  if (status === 'camera-ready') return 'camera ready';
  return status;
};

const formatAuthors = (authors: string[]): string => {
  if (authors.length <= 1) return authors[0] ?? '';
  if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
  return `${authors.slice(0, -1).join(', ')}, and ${authors[authors.length - 1]}`;
};

const TitleLink: React.FC<{ href?: string; children: React.ReactNode; quoted?: boolean }> = ({
  href,
  children,
  quoted = false,
}) => {
  const title = href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-primary dark:text-primary-dark hover:underline"
    >
      {children}
    </a>
  ) : (
    children
  );

  return quoted ? <>"{title}"</> : <>{title}</>;
};

const PublicationCitation: React.FC<{ pub: Publication }> = ({ pub }) => {
  if (!pub.citation) return null;

  const doiUrl = pub.doi ? `https://doi.org/${pub.doi}` : undefined;
  const isIeee = pub.citation.style === 'ieee';
  const authors = pub.citation.authors ?? formatAuthors(pub.authors);

  if (isIeee) {
    return (
      <p className="text-sm text-muted-light dark:text-muted-dark leading-relaxed mb-4">
        {authors}, <TitleLink quoted>{pub.title}</TitleLink>,{' '}
        {pub.citation.proceedings}, {pub.citation.location}, {pub.year}, pp.{' '}
        {pub.citation.pages}
        {doiUrl && (
          <>
            , doi:{' '}
            <a
              href={doiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary dark:text-primary-dark hover:underline break-all"
            >
              {pub.doi}
            </a>
          </>
        )}
        .
      </p>
    );
  }

  return (
    <p className="text-sm text-muted-light dark:text-muted-dark leading-relaxed mb-4">
      {authors}. {pub.year}. <TitleLink>{pub.title}</TitleLink>. In{' '}
      <em className="italic text-text-light dark:text-text-dark">{pub.citation.proceedings}</em>
      {pub.citation.pages ? `, pages ${pub.citation.pages}` : ''}
      {pub.citation.location ? `, ${pub.citation.location}` : ''}. {pub.citation.publisher}.
      {doiUrl && (
        <>
          {' '}
          <a
            href={doiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary dark:text-primary-dark hover:underline break-all"
          >
            {doiUrl}
          </a>
        </>
      )}
    </p>
  );
};

const PublicationCard: React.FC<{ pub: Publication; index: number }> = ({ pub, index }) => (
  <motion.div
    key={`${pub.title}-${index}`}
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 },
    }}
    className="bg-white dark:bg-surface-dark border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:shadow-lg hover:border-primary/50 dark:hover:border-primary-dark/50 transition-all duration-200"
  >
    <div className="flex items-start justify-between mb-3">
      <h3 className="text-xl font-semibold text-text-light dark:text-text-dark flex-1 pr-4">
        {pub.link || pub.doi ? (
          <a
            href={pub.link ?? `https://doi.org/${pub.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary dark:hover:text-primary-dark hover:underline"
          >
            {pub.title}
          </a>
        ) : (
          pub.title
        )}
      </h3>
      <Badge variant="default">{pub.type}</Badge>
    </div>

    {pub.citation ? (
      <PublicationCitation pub={pub} />
    ) : (
      <>
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
      </>
    )}

    <div className="flex items-center gap-3 flex-wrap">
      <Badge variant="secondary">{formatStatus(pub.status)}</Badge>
    </div>
  </motion.div>
);

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

  const published = publications.filter((pub) => pub.status === 'published');
  const forthcoming = publications.filter((pub) => pub.status !== 'published');

  const groupByYear = (items: Publication[]) =>
    items.reduce((acc, pub) => {
      if (!acc[pub.year]) {
        acc[pub.year] = [];
      }
      acc[pub.year].push(pub);
      return acc;
    }, {} as Record<number, Publication[]>);

  const renderSection = (title: string, items: Publication[]) => {
    if (items.length === 0) return null;

    const byYear = groupByYear(items);
    const years = Object.keys(byYear)
      .map(Number)
      .sort((a, b) => b - a);

    return (
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="mb-12"
      >
        <motion.h2
          variants={item}
          className="text-2xl font-bold text-text-light dark:text-text-dark mb-6"
        >
          {title}
        </motion.h2>

        {years.map((year) => (
          <div key={`${title}-${year}`} className="mb-8">
            <motion.h3
              variants={item}
              className="text-xl font-semibold text-text-light dark:text-text-dark mb-4 sticky top-16 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm py-2 z-10"
            >
              {year}
            </motion.h3>
            <motion.div variants={container} className="space-y-6">
              {byYear[year].map((pub, index) => (
                <PublicationCard key={`${pub.title}-${index}`} pub={pub} index={index} />
              ))}
            </motion.div>
          </div>
        ))}
      </motion.section>
    );
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
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

        {publications.length > 0 ? (
          <>
            {renderSection('Published', published)}
            {renderSection('Forthcoming', forthcoming)}
          </>
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
                {published.length}
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
