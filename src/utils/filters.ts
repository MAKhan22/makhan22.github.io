import { Project } from './types';

export const filterProjects = (
  projects: Project[],
  selectedTags: string[]
): Project[] => {
  if (selectedTags.length === 0) return projects;
  return projects.filter(project =>
    project.tags.some(tag => selectedTags.includes(tag))
  );
};

export const getAllTags = (projects: Project[]): string[] => {
  const excludedTags = ['Framer Motion', 'FastAPI'];
  const tags = projects.flatMap(project => project.tags)
    .filter(tag => !excludedTags.includes(tag));
  return Array.from(new Set(tags)).sort();
};

export const getTagCount = (projects: Project[], tag: string): number => {
  return projects.filter(project => project.tags.includes(tag)).length;
};

// Categorize tags for color coding
export const getTagCategory = (tag: string): 'language' | 'tech-stack' | 'libraries' | 'cs-field' | 'other' => {
  const programmingLanguages = [
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C', 'C++', 'R', 'Bash', 
    'Verilog', 'SQL', 'HTML', 'CSS', 'Swift', 'Kotlin', 'Go', 'Rust', 'PHP'
  ];
  
  const techStack = [
    // Frontend frameworks
    'React', 'React Native', 'Tailwind CSS',
    // Backend frameworks
    'Node.js', 'Express', 'Express.js',
    // Databases
    'MongoDB', 'MySQL', 'PostgreSQL', 'Firebase',
    // Mobile development tools
    'Flutter', 'Android Studio', 'Expo CLI',
    // Build tools & DevOps
    'Vite', 'Gradle', 'Docker', 'Kubernetes'
  ];
  
  const libraries = [
    // ML/DL libraries
    'PyTorch', 'TensorFlow', 'Keras', 'Scikit-learn',
    // Data science libraries
    'Pandas', 'NumPy', 'NetworkX', 'cuGraph', 'OpenCV',
    // Other libraries
    'Spring Boot', 'PostGIS', 'OpenStreetMap'
  ];
  
  const csFields = [
    'Deep Learning', 'Machine Learning', 'NLP', 'Computer Vision', 
    'Network Science', 'Data Science', 'Spatial Analysis', 'Spatial Data Science',
    'Medical AI', 'Sentiment Analysis', 'Data Analysis',
    'Web Development', 'Mobile Development'
  ];
  
  if (programmingLanguages.includes(tag)) return 'language';
  if (techStack.includes(tag)) return 'tech-stack';
  if (libraries.includes(tag)) return 'libraries';
  if (csFields.includes(tag)) return 'cs-field';
  return 'other';
};

export const getTagBorderColor = (tag: string): string => {
  const category = getTagCategory(tag);
  const colors = {
    'language': '!border-blue-600/80 dark:!border-blue-400/75',
    'tech-stack': '!border-purple-600/80 dark:!border-purple-400/75',
    'libraries': '!border-yellow-600/80 dark:!border-yellow-400/75',
    'cs-field': '!border-green-600/80 dark:!border-green-400/75',
    'other': '!border-red-600/80 dark:!border-red-400/75'
  };
  return colors[category];
};

export const getCategoryColor = (category: 'language' | 'tech-stack' | 'libraries' | 'cs-field' | 'other'): string => {
  const colors = {
    'language': 'text-blue-600/80 dark:text-blue-400/75 border-blue-600/75 dark:border-blue-400/70',
    'tech-stack': 'text-purple-600/80 dark:text-purple-400/75 border-purple-600/75 dark:border-purple-400/70',
    'libraries': 'text-yellow-600/80 dark:text-yellow-400/75 border-yellow-600/75 dark:border-yellow-400/70',
    'cs-field': 'text-green-600/80 dark:text-green-400/75 border-green-600/75 dark:border-green-400/70',
    'other': 'text-red-600/80 dark:text-red-400/75 border-red-600/75 dark:border-red-400/70'
  };
  return colors[category];
};

export const getCategoryLabel = (category: 'language' | 'tech-stack' | 'libraries' | 'cs-field' | 'other'): string => {
  const labels = {
    'language': 'Programming Languages',
    'tech-stack': 'Tech Stack',
    'libraries': 'Libraries',
    'cs-field': 'CS Fields',
    'other': 'Other'
  };
  return labels[category];
};

export const groupTagsByCategory = (tags: string[]): Record<'language' | 'tech-stack' | 'libraries' | 'cs-field' | 'other', string[]> => {
  const grouped: Record<'language' | 'tech-stack' | 'libraries' | 'cs-field' | 'other', string[]> = {
    'language': [],
    'tech-stack': [],
    'libraries': [],
    'cs-field': [],
    'other': []
  };
  
  tags.forEach(tag => {
    const category = getTagCategory(tag);
    grouped[category].push(tag);
  });
  
  // Sort each category
  Object.keys(grouped).forEach(key => {
    grouped[key as keyof typeof grouped].sort();
  });
  
  return grouped;
};
