import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import profileData from '../data/profile.json';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, url: profileData.links.github, label: 'GitHub' },
    { icon: Linkedin, url: profileData.links.linkedin, label: 'LinkedIn' },
    { icon: Mail, url: `mailto:${profileData.email}`, label: 'Email' },
  ];

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center space-y-6">
          {/* Social Links */}
          <div className="flex space-x-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary-dark transition-all duration-200 hover:scale-110"
                aria-label={link.label}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-muted-light dark:text-muted-dark">
              © {currentYear} {profileData.name}. All rights reserved.
            </p>
            <p className="text-xs text-muted-light dark:text-muted-dark mt-1">
              Built with React & TypeScript
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
