import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Star } from 'lucide-react';
import { Project } from '../utils/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { getTagBorderColor } from '../utils/filters';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const statusColors = {
    completed: 'text-green-600 dark:text-green-400',
    'in-progress': 'text-yellow-600 dark:text-yellow-400',
    archived: 'text-zinc-500 dark:text-zinc-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full flex flex-col hover:shadow-lg hover:border-primary/50 dark:hover:border-primary-dark/50 group relative">
        {/* Project Image */}
        {project.image && (
          <div className="relative overflow-hidden rounded-t-xl -m-6 mb-4 h-48 bg-zinc-100 dark:bg-zinc-800">
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onError={(e) => {
                // Fallback to gradient if image fails to load
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Featured Badge */}
            {project.featured && (
              <div className="absolute top-3 right-3">
                <Badge variant="default" className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Featured
                </Badge>
              </div>
            )}
          </div>
        )}

        <CardHeader className="relative pt-4">
          {/* Status Badge - Top right of writable area */}
          <div className="absolute top-4 -right-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-md ${statusColors[project.status]} bg-zinc-100 dark:bg-zinc-800`}>
              {project.status === 'in-progress' ? 'In Progress' : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
          <CardTitle className="group-hover:text-primary dark:group-hover:text-primary-dark transition-colors pr-20">
            {project.title}
          </CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>

        <CardContent className="flex-1">
          {/* Tags (filterable) */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary"
                className={`bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border ${getTagBorderColor(tag)}`}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter>
          <div className="flex gap-2 w-full">
            {project.links.github ? (
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={() => window.open(project.links.github, '_blank')}
              >
                <Github className="w-4 h-4 mr-2" />
                Code
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                disabled
              >
                <Github className="w-4 h-4 mr-2" />
                Private Repo
              </Button>
            )}
            {project.links.demo && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => window.open(project.links.demo, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Demo
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
