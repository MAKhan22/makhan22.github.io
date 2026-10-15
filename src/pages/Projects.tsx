import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from '../components/ProjectCard';
import { TagFilter } from '../components/TagFilter';
import { YearFilter } from '../components/YearFilter';
import {
  filterProjects,
  getAllTags,
  getAllYears,
  getTagCount,
  getYearCount,
} from '../utils/filters';
import projectsData from '../data/projects.json';
import { Project } from '../utils/types';

export const Projects: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const projects = projectsData as Project[];

  const allTags = useMemo(() => getAllTags(projects), [projects]);
  const allYears = useMemo(() => getAllYears(projects), [projects]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allTags.forEach((tag) => {
      counts[tag] = getTagCount(projects, tag);
    });
    return counts;
  }, [allTags, projects]);

  const yearCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    allYears.forEach((year) => {
      counts[year] = getYearCount(projects, year);
    });
    return counts;
  }, [allYears, projects]);

  const filteredProjects = useMemo(
    () => filterProjects(projects, selectedTags, selectedYears),
    [projects, selectedTags, selectedYears]
  );

  const sortedProjects = useMemo(
    () =>
      [...filteredProjects].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.year - a.year;
      }),
    [filteredProjects]
  );

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleYearToggle = (year: number) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const handleClearAll = () => {
    setSelectedTags([]);
    setSelectedYears([]);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const hasActiveFilters = selectedTags.length > 0 || selectedYears.length > 0;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark mb-4">
            Projects
          </h1>
          <p className="text-lg text-muted-light dark:text-muted-dark max-w-2xl">
            A collection of my personal projects, experiments, and contributions. Built with various technologies to solve real-world problems.
          </p>
        </motion.div>

        <YearFilter
          years={allYears}
          selectedYears={selectedYears}
          onYearToggle={handleYearToggle}
          onClearYears={() => setSelectedYears([])}
          projectCounts={yearCounts}
        />

        <TagFilter
          tags={allTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClearAll={() => setSelectedTags([])}
          projectCounts={tagCounts}
        />

        {sortedProjects.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl text-muted-light dark:text-muted-dark">
              No projects found with the selected filters.
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearAll}
                className="mt-4 text-primary dark:text-primary-dark hover:underline"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center text-sm text-muted-light dark:text-muted-dark"
        >
          Showing {sortedProjects.length} of {projects.length} projects
        </motion.div>
      </div>
    </div>
  );
};
