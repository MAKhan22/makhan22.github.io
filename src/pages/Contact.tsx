import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Github, Linkedin } from 'lucide-react';
import { GoogleScholarIcon, OrcidIcon } from '../components/icons/SocialIcons';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import profileData from '../data/profile.json';

export const Contact: React.FC = () => {
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

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: profileData.email,
      link: `mailto:${profileData.email}`,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: profileData.location,
      link: null,
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'MAKhan22',
      link: profileData.links.github,
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'musab-ahmed-khan',
      link: profileData.links.linkedin,
    },
    ...(profileData.links.orcid
      ? [{
          icon: OrcidIcon,
          label: 'ORCID',
          value: '0009-0002-8075-8243',
          link: profileData.links.orcid,
        }]
      : []),
    ...(profileData.links.googleScholar
      ? [{
          icon: GoogleScholarIcon,
          label: 'Google Scholar',
          value: 'Musab Ahmed Khan',
          link: profileData.links.googleScholar,
        }]
      : []),
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="mb-16 text-center"
        >
          <motion.div variants={item} className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 dark:bg-blue-600/10 mb-6">
            <Mail className="w-8 h-8 text-primary dark:text-blue-500" />
          </motion.div>
          <motion.h1
            variants={item}
            className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            variants={item}
            className="text-lg text-muted-light dark:text-muted-dark max-w-2xl mx-auto"
          >
            I'm always open to discussing new projects, opportunities, or collaborations. Feel free to reach out!
          </motion.p>
        </motion.div>

        {/* Contact Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-6 text-center">
            Contact Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                {info.link ? (
                  <a
                    href={info.link}
                    target={info.link.startsWith('http') ? '_blank' : undefined}
                    rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="block"
                  >
                    <Card className="h-full hover:shadow-lg hover:border-primary/50 dark:hover:border-blue-500/50 transition-all duration-300 group cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-blue-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <info.icon className="w-6 h-6 text-primary dark:text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-light dark:text-muted-dark mb-1">
                              {info.label}
                            </p>
                            <p className="font-medium text-text-light dark:text-text-dark">
                              {info.value}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                ) : (
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-blue-600/10 flex items-center justify-center">
                          <info.icon className="w-6 h-6 text-primary dark:text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-light dark:text-muted-dark mb-1">
                            {info.label}
                          </p>
                          <p className="font-medium text-text-light dark:text-text-dark">
                            {info.value}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact CTA */}
          <p className="text-lg text-muted-light dark:text-muted-dark max-w-2xl mx-auto text-center">
            Whether you have a project in mind, a question, or just want to say hi, I'd love to hear from you!
          </p>
      </div>
    </div>
  );
};
