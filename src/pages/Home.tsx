import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, GraduationCap, Award, TrendingUp, BookOpen, Code, Mail, ExternalLink, Github, Linkedin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ExperienceCard } from '../components/ExperienceCard';
import { useScrollFade } from '../hooks/useScrollFade';
import profileData from '../data/profile.json';
import experienceData from '../data/experience.json';
import projectsData from '../data/projects.json';
import certificatesData from '../data/certificates.json';
import awardsData from '../data/awards.json';
import { Experience } from '../utils/types';

// Scroll fade wrapper component
const ScrollFadeItem: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const { ref, opacity, scale } = useScrollFade();
  
  return (
    <motion.div 
      ref={ref}
      style={{ opacity, scale }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Hero scroll animations
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 0.8], [1, 1.15]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
  };

  // Get featured projects and all experiences
  const featuredProjects = projectsData.filter(p => p.featured).slice(0, 3);
  const experiences = experienceData as Experience[];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden will-change-transform"
      >
        {/* Subtle background gradient blurs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 dark:bg-primary-dark/15 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/15 dark:bg-blue-500/15 rounded-full blur-3xl opacity-60"></div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          {/* Greeting */}
          <motion.p
            variants={item}
            className="text-primary dark:text-blue-500 font-medium mb-4"
          >
            Hi, I'm
          </motion.p>

          {/* Name with subtle glow effect */}
          <motion.h1
            variants={item}
            className="text-5xl md:text-7xl font-bold text-text-light dark:text-text-dark mb-4"
            style={{
              textShadow: '0 0 30px rgba(37, 99, 235, 0.2), 0 0 60px rgba(37, 99, 235, 0.08)',
            }}
          >
            {profileData.name}
          </motion.h1>

          {/* Title */}
          <motion.h2
            variants={item}
            className="text-2xl md:text-3xl font-semibold text-muted-light dark:text-muted-dark mb-6"
          >
            {profileData.title}
          </motion.h2>

          {/* Bio */}
          <motion.p
            variants={item}
            className="text-lg text-muted-light dark:text-muted-dark max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            {profileData.bio}
          </motion.p>

          {/* Location */}
          <motion.p
            variants={item}
            className="text-sm text-muted-light dark:text-muted-dark mb-8"
          >
            📍 {profileData.location}
          </motion.p>

          {/* Social Links & CV */}
          <motion.div
            variants={item}
            className="flex gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(profileData.links.github, '_blank')}
              className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-primary/10 dark:hover:bg-blue-500/10 border border-zinc-200 dark:border-zinc-700 hover:border-primary/50 dark:hover:border-blue-500/50 flex items-center justify-center transition-all shadow-md hover:shadow-lg"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6 text-text-light dark:text-text-dark" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(profileData.links.linkedin, '_blank')}
              className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-primary/10 dark:hover:bg-blue-500/10 border border-zinc-200 dark:border-zinc-700 hover:border-primary/50 dark:hover:border-blue-500/50 flex items-center justify-center transition-all shadow-md hover:shadow-lg"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6 text-text-light dark:text-text-dark" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(`mailto:${profileData.email}`, '_blank')}
              className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-primary/10 dark:hover:bg-blue-500/10 border border-zinc-200 dark:border-zinc-700 hover:border-primary/50 dark:hover:border-blue-500/50 flex items-center justify-center transition-all shadow-md hover:shadow-lg"
              aria-label="Email"
            >
              <Mail className="w-6 h-6 text-text-light dark:text-text-dark" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('/cv/Musab_Ahmed_Khan_CV.pdf', '_blank')}
              className="w-14 h-14 rounded-full bg-primary dark:bg-blue-600 hover:bg-primary/90 dark:hover:bg-blue-500 border border-primary dark:border-blue-500 flex items-center justify-center transition-all shadow-md hover:shadow-lg shadow-primary/20 dark:shadow-blue-500/20"
              aria-label="Download CV"
            >
              <span className="text-white font-semibold text-sm">CV</span>
            </motion.button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 1.5, duration: 1.5, repeat: Infinity }}
            className="mt-16"
          >
            <div className="text-muted-light dark:text-muted-dark text-sm">
              Scroll to explore
              <div className="w-0.5 h-12 bg-gradient-to-b from-primary dark:from-blue-500 to-transparent mx-auto mt-2"></div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section 
        id="about" 
        className="py-16 px-4 relative -my-16 mb-8"
      >
        <div 
          className="absolute inset-0 bg-zinc-50 dark:bg-zinc-900/50 -z-10" 
          style={{ 
            maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
          }}
        ></div>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
          className="max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <ScrollFadeItem>
              <motion.div variants={fadeInUp} className="text-center">
                <div className="text-4xl font-bold text-primary dark:text-blue-500 mb-2">9+</div>
                <div className="text-sm text-muted-light dark:text-muted-dark">Projects</div>
              </motion.div>
            </ScrollFadeItem>
            <ScrollFadeItem>
              <motion.div variants={fadeInUp} className="text-center">
                <div className="text-4xl font-bold text-primary dark:text-blue-500 mb-2">0</div>
                <div className="text-sm text-muted-light dark:text-muted-dark">Research Papers</div>
              </motion.div>
            </ScrollFadeItem>
            <ScrollFadeItem>
              <motion.div variants={fadeInUp} className="text-center">
                <div className="text-4xl font-bold text-primary dark:text-blue-500 mb-2">9</div>
                <div className="text-sm text-muted-light dark:text-muted-dark">Certifications</div>
              </motion.div>
            </ScrollFadeItem>
            <ScrollFadeItem>
              <motion.div variants={fadeInUp} className="text-center">
                <div className="text-4xl font-bold text-primary dark:text-blue-500 mb-2">12</div>
                <div className="text-sm text-muted-light dark:text-muted-dark">Awards</div>
              </motion.div>
            </ScrollFadeItem>
          </div>
        </motion.div>
      </section>

      {/* Experience & Education Timeline Section */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          <ScrollFadeItem>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-4 text-center"
            >
              Experience & Education
            </motion.h2>
          </ScrollFadeItem>
          <ScrollFadeItem>
            <motion.p
              variants={fadeInUp}
              className="text-muted-light dark:text-muted-dark text-center mb-12 max-w-2xl mx-auto"
            >
              My professional journey and academic background
            </motion.p>
          </ScrollFadeItem>

          <div className="space-y-0 pl-10 relative">
            {experiences.map((experience, index) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Skills & Certifications + Featured Projects Combined Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-900/50 -z-10" style={{ 
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 2%, black 98%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 2%, black 98%, transparent 100%)'
        }}></div>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
          className="max-w-6xl mx-auto"
        >
          <ScrollFadeItem>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-4 text-center"
            >
              Skills & Certifications
            </motion.h2>
          </ScrollFadeItem>
          <ScrollFadeItem>
            <motion.p
              variants={fadeInUp}
              className="text-muted-light dark:text-muted-dark text-center mb-12 max-w-2xl mx-auto"
            >
              Technical expertise and professional certifications
            </motion.p>
          </ScrollFadeItem>

          {/* Technical Skills */}
          <motion.div variants={fadeInUp} className="mb-12">
            <ScrollFadeItem>
              <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-6 text-center">
                Technical Skills
              </h3>
            </ScrollFadeItem>
            <div className="grid md:grid-cols-3 gap-6">
              <ScrollFadeItem>
                <Card key="programming-dev" className="hover:shadow-lg hover:border-primary/50 dark:hover:border-blue-500/50 transition-all duration-300 will-change-transform">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-blue-600/10 flex items-center justify-center mb-3">
                    <Code className="w-6 h-6 text-primary dark:text-blue-500" />
                  </div>
                  <CardTitle className="text-lg">Programming & Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'R', 'C++', 'Java', 'SQL', 'JavaScript', 'TypeScript', 'Verilog', 'React', 'Express.js', 'Android Studio'].map(skill => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </ScrollFadeItem>

              <ScrollFadeItem>
              <Card key="ml-ai" className="hover:shadow-lg hover:border-primary/50 dark:hover:border-blue-500/50 transition-all duration-300 will-change-transform">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-blue-600/10 flex items-center justify-center mb-3">
                    <GraduationCap className="w-6 h-6 text-primary dark:text-blue-500" />
                  </div>
                  <CardTitle className="text-lg">Machine Learning & AI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['PyTorch', 'TensorFlow', 'Pandas', 'NumPy', 'Scikit-learn', 'NetworkX', 'cuGraph',  'Transformers', 'AI Agents', 'LLMs', 'NLP', 'Computer Vision', 'Deep Learning', 'BERT', 'DeBERTa'].map(skill => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </ScrollFadeItem>

              <ScrollFadeItem>
              <Card key="data-cloud" className="hover:shadow-lg hover:border-primary/50 dark:hover:border-blue-500/50 transition-all duration-300 will-change-transform">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-blue-600/10 flex items-center justify-center mb-3">
                    <TrendingUp className="w-6 h-6 text-primary dark:text-blue-500" />
                  </div>
                  <CardTitle className="text-lg">Data & Cloud</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['PostgreSQL', 'PostGIS', 'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'Docker', 'Kubernetes'].map(skill => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </ScrollFadeItem>
            </div>
          </motion.div>

          {/* Languages */}
          <motion.div variants={fadeInUp} className="mb-12">
            <ScrollFadeItem>
              <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-4 text-center">
                Languages
              </h3>
            </ScrollFadeItem>
            <div className="flex flex-wrap justify-center gap-3 items-start">
              <div className="group relative inline-block">
                <Badge variant="secondary" className="px-4 py-1.5 text-sm">
                  English <span className="text-xs text-muted-light dark:text-muted-dark ml-1">(Professional)</span>
                </Badge>
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 max-h-0 group-hover:max-h-16 overflow-hidden transition-all duration-200 z-10">
                  <div className="rounded-full min-w-[18rem] px-5 py-1 text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-md text-center">
                    My name is Musab Ahmed Khan.
                  </div>
                </div>
              </div>
              <div className="group relative inline-block">
                <Badge variant="secondary" className="px-4 py-1.5 text-sm">
                  Hindi <span className="text-xs text-muted-light dark:text-muted-dark ml-1">(Native)</span>
                </Badge>
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 max-h-0 group-hover:max-h-16 overflow-hidden transition-all duration-200 z-10">
                  <div className="rounded-full min-w-[18rem] px-5 py-1 text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-md text-center" lang="hi">
                    मेरा नाम मुसाब अहमद खान है।
                  </div>
                </div>
              </div>
              <div className="group relative inline-block">
                <Badge variant="secondary" className="px-4 py-1.5 text-sm">
                  Urdu <span className="text-xs text-muted-light dark:text-muted-dark ml-1">(Native)</span>
                </Badge>
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 max-h-0 group-hover:max-h-16 overflow-hidden transition-all duration-200 z-10">
                  <div className="rounded-full min-w-[18rem] px-5 py-1 text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-md text-center" lang="ur" style={{ fontFamily: "'Noto Nastaliq Urdu', 'Urdu Typesetting', serif" }}>
                    میرا نام مصعب احمد خان ہے۔
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div variants={fadeInUp}>
            <ScrollFadeItem>
              <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-6 text-center">
                Professional Certifications
              </h3>
            </ScrollFadeItem>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificatesData.map((cert) => (
                <ScrollFadeItem key={`scroll-${cert.id}`}>
                  <Card key={cert.id} className="h-full hover:shadow-lg hover:border-primary/50 dark:hover:border-blue-500/50 transition-all duration-300 group will-change-transform overflow-hidden relative">
                  {/* Platform Watermark - diagonal word with smooth end fade */}
                  {cert.platform && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                      <span
                        className="text-6xl font-black uppercase select-none text-zinc-500/10 dark:text-zinc-200/11 group-hover:text-zinc-500/18 dark:group-hover:text-zinc-50/20 transition-colors duration-300"
                        style={{
                          fontFamily: "'Anton', 'Impact', 'Arial Black', sans-serif",
                          fontWeight: 900,
                          letterSpacing: '0.12em',
                          transform: 'rotate(-32deg) scale(1.2)',
                          // Smooth diagonal fade: each letter gets slightly lighter towards the right,
                          // with a stronger falloff near the tail while still leaving the last letter readable on hover.
                          WebkitMaskImage: 'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.18) 80%, rgba(0,0,0,0.02) 100%)',
                          maskImage: 'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.18) 80%, rgba(0,0,0,0.02) 100%)'
                        }}
                      >
                        {cert.platform}
                      </span>
                    </div>
                  )}
                  <CardContent className="p-4 relative z-10">
                    <div className="flex flex-col">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-blue-600/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Award className="w-5 h-5 text-primary dark:text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-text-light dark:text-text-dark mb-1 line-clamp-2">
                            {cert.title}
                          </h4>
                          <p className="text-primary dark:text-blue-500 font-medium text-xs">
                            {cert.issuer}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">{cert.year}</Badge>
                        {cert.link && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(cert.link, '_blank')}
                            className="text-xs h-7 px-3 gap-1 hover:bg-primary/10 dark:hover:bg-blue-500/10"
                          >
                            View
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </ScrollFadeItem>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Featured Projects Section */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
          className="max-w-6xl mx-auto mt-20"
        >
          <div className="flex items-center justify-between mb-12">
            <ScrollFadeItem>
              <div>
                <motion.h2
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-2"
                >
                  Featured Projects
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  className="text-muted-light dark:text-muted-dark"
                >
                  Showcasing recent work and contributions
                </motion.p>
              </div>
            </ScrollFadeItem>
            <ScrollFadeItem>
              <motion.div variants={fadeInUp}>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/projects')}
                  className="hidden md:flex"
                >
                  View All Projects
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </ScrollFadeItem>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <ScrollFadeItem key={`scroll-${project.id}`}>
                <motion.div
                  key={project.id}
                  variants={fadeInUp}
                  transition={{ delay: index * 0.15 }}
                  className="will-change-transform"
                >
                <Card className="h-full hover:shadow-xl hover:border-primary/50 dark:hover:border-blue-500/50 transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-blue-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-5 h-5 text-primary dark:text-blue-500" />
                      </div>
                      <Badge variant="default" className="text-xs">
                        {project.year}
                      </Badge>
                    </div>
                    <CardTitle className="group-hover:text-primary dark:group-hover:text-blue-500 transition-colors line-clamp-2">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => navigate('/projects')}
                    >
                      Learn More
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
              </ScrollFadeItem>
            ))}
          </div>

          {/* Mobile View All Button */}
          <motion.div variants={fadeInUp} className="text-center mt-8 md:hidden">
            <Button
              variant="outline"
              onClick={() => navigate('/projects')}
            >
              View All Projects
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Quick Links / CTA Section */}
      <section id="about-end" className="py-20 px-4 max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
          className="text-center"
        >
          <ScrollFadeItem>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark mb-4"
            >
              Want to know more?
            </motion.h2>
          </ScrollFadeItem>
          <ScrollFadeItem>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-light dark:text-muted-dark mb-12 max-w-2xl mx-auto"
            >
              Explore my academic achievements, research publications, and professional journey
            </motion.p>
          </ScrollFadeItem>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Publications Card */}
            <ScrollFadeItem>
              <motion.button
                key="publications-card"
                variants={fadeInUp}
                onClick={() => navigate('/publications')}
                className="group bg-gradient-to-br from-blue-100/60 to-blue-200/60 dark:from-blue-900/30 dark:to-blue-950/30 border-2 border-blue-300/50 dark:border-blue-700/50 rounded-xl p-6 text-left hover:border-primary dark:hover:border-blue-500 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-blue-500/10 transition-all duration-300 will-change-transform"
              >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/20 dark:bg-blue-600/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary dark:text-blue-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-primary dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                Research & Publications
              </h3>
              <p className="text-sm text-muted-light dark:text-muted-dark mb-3">
                View my published papers and research work
              </p>
              <Badge variant="default" className="bg-primary/20 dark:bg-blue-600/20 text-primary dark:text-blue-400 border-primary/30 dark:border-blue-500/30">
                0 papers
              </Badge>
            </motion.button>
            </ScrollFadeItem>

            {/* Awards Card */}
            <ScrollFadeItem>
              <motion.button
                key="awards-card"
                variants={fadeInUp}
                onClick={() => navigate('/awards')}
                className="group bg-gradient-to-br from-blue-100/60 to-blue-200/60 dark:from-blue-900/30 dark:to-blue-950/30 border-2 border-blue-300/50 dark:border-blue-700/50 rounded-xl p-6 text-left hover:border-primary dark:hover:border-blue-500 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-blue-500/10 transition-all duration-300 will-change-transform"
              >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/20 dark:bg-blue-600/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary dark:text-blue-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-primary dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                Awards & Recognition
              </h3>
              <p className="text-sm text-muted-light dark:text-muted-dark mb-3">
                Honors, scholarships, and achievements
              </p>
              <Badge variant="default" className="bg-primary/20 dark:bg-blue-600/20 text-primary dark:text-blue-400 border-primary/30 dark:border-blue-500/30">
                {awardsData.length} awards
              </Badge>
            </motion.button>
            </ScrollFadeItem>

            {/* Contact Card */}
            <ScrollFadeItem>
              <motion.button
                key="contact-card"
                variants={fadeInUp}
                onClick={() => navigate('/contact')}
                className="group bg-gradient-to-br from-blue-100/60 to-blue-200/60 dark:from-blue-900/30 dark:to-blue-950/30 border-2 border-blue-300/50 dark:border-blue-700/50 rounded-xl p-6 text-left hover:border-primary dark:hover:border-blue-500 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-blue-500/10 transition-all duration-300 will-change-transform"
              >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/20 dark:bg-blue-600/20 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary dark:text-blue-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-primary dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                Contact Me
              </h3>
              <p className="text-sm text-muted-light dark:text-muted-dark mb-3">
                Get in touch for opportunities and collaborations
              </p>
              <Badge variant="default" className="bg-primary/20 dark:bg-blue-600/20 text-primary dark:text-blue-400 border-primary/30 dark:border-blue-500/30">
                Let's connect
              </Badge>
            </motion.button>
            </ScrollFadeItem>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
