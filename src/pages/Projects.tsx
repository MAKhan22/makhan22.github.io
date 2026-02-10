import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from '../components/ProjectCard';
import { TagFilter } from '../components/TagFilter';
import { filterProjects, getAllTags, getTagCount } from '../utils/filters';
import projectsData from '../data/projects.json';
import { Project } from '../utils/types';

export const Projects: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const projects = projectsData as Project[];

  // Get all unique tags
  const allTags = useMemo(() => getAllTags(projects), []);

  // Get project count per tag
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allTags.forEach(tag => {
      counts[tag] = getTagCount(projects, tag);
    });
    return counts;
  }, [allTags]);

  // Filter projects based on selected tags
  const filteredProjects = useMemo(
    () => filterProjects(projects, selectedTags),
    [selectedTags]
  );

  // Sort: featured first, then by year
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
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearAll = () => {
    setSelectedTags([]);
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

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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

        {/* Tag Filter */}
        <TagFilter
          tags={allTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClearAll={handleClearAll}
          projectCounts={tagCounts}
        />

        {/* Projects Grid */}
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
              No projects found with the selected tags.
            </p>
            <button
              onClick={handleClearAll}
              className="mt-4 text-primary dark:text-primary-dark hover:underline"
            >
              Clear filters
            </button>
          </motion.div>
        )}

        {/* Stats */}
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
