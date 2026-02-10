export interface Profile {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  links: {
    github: string;
    linkedin: string;
    twitter?: string;
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: 'completed' | 'in-progress' | 'archived';
  year: number;
  image?: string;
  links: {
    github: string;
    demo?: string;
  };
  featured: boolean;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  period: string;
  description: string;
  type: 'research' | 'internship' | 'teaching' | 'work';
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  year: number;
  link?: string;
  image?: string;
  platform?: string;
}

export interface Publication {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: 'conference' | 'journal' | 'preprint' | 'workshop';
  status: 'published' | 'accepted' | 'preprint' | 'under-review';
  link?: string;
  abstract?: string;
}

export type AwardType = 'academic' | 'research' | 'scholarship' | 'grant' | 'competition';

export interface Award {
  title: string;
  issuer: string;
  year: number;
  /** One or more types; use `types` for multiple. */
  types: AwardType[];
  amount?: string;
  description?: string;
}

export interface Workshop {
  title: string;
  organizer: string;
  date: string;
  type: 'workshop' | 'training' | 'seminar' | 'conference';
  role: 'participant' | 'instructor' | 'organizer' | 'speaker';
  description?: string;
  certificate?: string;
}
