import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown, Download, Trophy, Award, ArrowUpRight, Cpu } from 'lucide-react';
import ParticleField from './components/ParticleField';
import Cursor from './components/Cursor';
import TiltCard from './components/TiltCard';
import MagneticButton from './components/MagneticButton';
import { TextReveal, CharReveal } from './components/TextReveal';
import { TECH_STACK, EXPERIENCE, ACHIEVEMENTS, CERTIFICATIONS, PROJECTS } from './data';

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// ─── Navigation ──────────────────────────────────────────────────────────────
const NAV_ITEMS = ['home', 'experience', 'projects', 'certifications', 'contact'];

const Navigation = ({ activeSection, scrollTo }: { activeSection: string; scrollTo: (id: string) => void }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 transition-all duration-500 ${
        scrolled ? 'bg-black/60 backdrop-blur-xl border-b border-white/5' : ''
      }`}
    >
      <motion.div
        className="text-white font-black text-2xl tracking-tighter cursor-pointer"
        onClick={() => scrollTo('home')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">NC</span>
        <span className="text-white/40">.</span>
      </motion.div>

      <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-2 py-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item}
            onClick={() => scrollTo(item)}
            className={`relative px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 ${
              activeSection === item ? 'text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            {activeSection === item && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 bg-white rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{item}</span>
          </button>
        ))}
      </div>

      <MagneticButton
        onClick={() => scrollTo('contact')}
        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-xs tracking-wider shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-shadow"
      >
        Let's Talk
      </MagneticButton>
    </motion.nav>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = ({ scrollTo }: { scrollTo: (id: string) => void }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <section id="home" className="relative z-10 min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div style={{ y, opacity }} className="relative z-10 max-w-6xl mx-auto px-6 text-center">

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-10"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-sm font-medium text-gray-300 tracking-wide">Open to AI Engineering Opportunities</span>
        </motion.div>

        {/* Main heading */}
        <div className="mb-6 overflow-hidden">
          <motion.h1
            className="text-[clamp(4rem,12vw,10rem)] font-black tracking-[-0.04em] leading-[0.9] text-white"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Nishanth
          </motion.h1>
          <motion.h1
            className="text-[clamp(4rem,12vw,10rem)] font-black tracking-[-0.04em] leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Chowdary
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto mb-12 font-light leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Building intelligent systems · Fine-tuning LLMs · Architecting scalable AI infrastructure
        </motion.p>

        {/* CTA row */}
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <MagneticButton
            onClick={() => scrollTo('projects')}
            className="group flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full text-sm hover:bg-gray-100 transition-colors"
          >
            View Work
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </MagneticButton>

          <MagneticButton
            href="https://ArekatlaNishanthchowdary.github.io/portfolio-nishanth/resume.pdf"
            download
            className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/15 text-white font-bold rounded-full text-sm hover:bg-white/10 transition-colors backdrop-blur-sm"
          >
            <Download className="w-4 h-4" /> Resume
          </MagneticButton>

          <div className="flex gap-3">
            <MagneticButton
              href="https://github.com/ArekatlaNishanthchowdary"
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              <GithubIcon className="w-5 h-5" />
            </MagneticButton>
            <MagneticButton
              href="https://www.linkedin.com/in/arekatla-nishanth-chowdary/"
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              <LinkedinIcon className="w-5 h-5" />
            </MagneticButton>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <span className="text-xs text-gray-600 uppercase tracking-widest font-bold">Scroll</span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent"
            animate={{ scaleY: [0, 1, 0], originY: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

// ─── Section wrapper with reveal ─────────────────────────────────────────────
const SectionReveal = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Experience & Skills ──────────────────────────────────────────────────────
const ExperienceAndSkills = () => (
  <section id="experience" className="py-40 relative z-10">
    <div className="max-w-7xl mx-auto px-6">

      {/* Section label */}
      <SectionReveal>
        <div className="flex items-center gap-4 mb-20">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">Background</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
        </div>
      </SectionReveal>

      <div className="grid lg:grid-cols-2 gap-24">
        {/* Left: Experience + Achievements */}
        <div className="space-y-24">
          {/* Experience */}
          <SectionReveal>
            <h2 className="text-5xl font-black tracking-tighter text-white mb-12">
              <TextReveal>Track Record</TextReveal>
            </h2>
            <div className="space-y-6">
              {EXPERIENCE.map((exp, i) => (
                <TiltCard key={i} intensity={5} className="rounded-2xl">
                  <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-blue-500/30 transition-colors duration-500 group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{exp.role}</h3>
                        <p className="text-blue-400/80 text-sm font-mono mt-1">{exp.company}</p>
                      </div>
                      <span className="text-xs text-gray-600 font-mono bg-white/5 px-3 py-1 rounded-full border border-white/5 shrink-0 ml-4">{exp.date}</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{exp.desc}</p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </SectionReveal>

          {/* Achievements */}
          <SectionReveal>
            <h2 className="text-5xl font-black tracking-tighter text-white mb-12">
              <TextReveal>Achievements</TextReveal>
            </h2>
            <div className="space-y-4">
              {ACHIEVEMENTS.map((ach, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-5 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-purple-500/30 transition-colors duration-500 group"
                >
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 shrink-0 group-hover:bg-purple-500/20 transition-colors">
                    <Trophy className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{ach.title} — <span className="text-gray-400 font-normal">{ach.event}</span></p>
                    <p className="text-gray-500 text-xs mt-1 italic">{ach.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionReveal>
        </div>

        {/* Right: Tech Stack */}
        <SectionReveal>
          <h2 className="text-5xl font-black tracking-tighter text-white mb-12">
            <TextReveal>Engineering Stack</TextReveal>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {TECH_STACK.map((stack, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-emerald-500/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400 opacity-60" />
                  <h3 className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.2em]">{stack.category}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {stack.items.map(item => (
                    <span key={item} className="px-2.5 py-1 bg-white/5 border border-white/[0.07] rounded-md text-xs text-gray-300 font-medium group-hover:border-emerald-500/20 transition-colors">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </div>
  </section>
);

// ─── Projects ─────────────────────────────────────────────────────────────────
const ProjectCard = ({ p, i }: { p: typeof PROJECTS[0]; i: number }) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <TiltCard intensity={8} className="rounded-3xl h-full">
        <div
          className="relative rounded-3xl border border-white/[0.07] overflow-hidden h-full flex flex-col transition-all duration-500 group"
          style={{
            background: hovered
              ? `linear-gradient(135deg, ${p.accent}08 0%, #000 60%)`
              : 'rgba(255,255,255,0.02)',
            borderColor: hovered ? `${p.accent}40` : 'rgba(255,255,255,0.07)',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Glow */}
          <motion.div
            className="absolute top-0 left-0 w-full h-1 rounded-t-3xl"
            style={{ background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)` }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          <div className="p-8 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <span className="text-5xl font-black text-white/[0.06] font-mono leading-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-gray-600 bg-white/5 px-3 py-1 rounded-full border border-white/5">{p.year}</span>
                <MagneticButton
                  href={p.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                </MagneticButton>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-black text-white tracking-tight mb-3 group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300"
              style={{ backgroundImage: `linear-gradient(135deg, #fff, ${p.accent})` }}
            >
              {p.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{p.desc}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {p.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 text-xs font-mono rounded-md border"
                  style={{ color: p.accent, borderColor: `${p.accent}30`, background: `${p.accent}08` }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Problem / Solution */}
            <div className="grid grid-cols-2 gap-3 mb-6 flex-1">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-400/70 mb-2">Problem</p>
                <p className="text-gray-400 text-xs leading-relaxed">{p.problem}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/70 mb-2">Solution</p>
                <p className="text-gray-400 text-xs leading-relaxed">{p.solution}</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
              <p className="text-sm font-bold" style={{ color: p.accent }}>{p.metrics}</p>
              <motion.div animate={{ x: hovered ? 4 : 0 }} transition={{ duration: 0.2 }}>
                <ArrowUpRight className="w-4 h-4 text-gray-600" />
              </motion.div>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
};

const Projects = () => (
  <section id="projects" className="py-40 relative z-10">
    <div className="max-w-7xl mx-auto px-6">
      <SectionReveal>
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">Work</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
        </div>
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white text-center mb-4">
          <CharReveal>Featured Systems</CharReveal>
        </h2>
        <p className="text-center text-gray-500 mb-20 text-sm">AI architectures built from first principles</p>
      </SectionReveal>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {PROJECTS.map((p, i) => <ProjectCard key={i} p={p} i={i} />)}
      </div>
    </div>
  </section>
);

// ─── Certifications ───────────────────────────────────────────────────────────
const Certifications = () => (
  <section id="certifications" className="py-40 relative z-10">
    <div className="max-w-5xl mx-auto px-6">
      <SectionReveal>
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">Credentials</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
        </div>
        <h2 className="text-6xl font-black tracking-tighter text-white text-center mb-20">
          <CharReveal>Certifications</CharReveal>
        </h2>
      </SectionReveal>

      <div className="grid md:grid-cols-2 gap-5">
        {CERTIFICATIONS.map((cert, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4, borderColor: 'rgba(234,179,8,0.3)' }}
            className="p-7 rounded-2xl bg-white/[0.03] border border-white/[0.07] transition-all duration-300 group cursor-default"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/20 shrink-0 group-hover:bg-yellow-400/15 transition-colors">
                <Award className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-base leading-snug mb-3 group-hover:text-yellow-100 transition-colors">{cert.title}</h3>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full text-xs font-mono border border-yellow-400/20">{cert.issuer}</span>
                  <span className="text-gray-500 text-xs">{cert.date}</span>
                </div>
                <p className="text-gray-700 font-mono text-[10px] mt-3 truncate">ID: {cert.id}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Contact ──────────────────────────────────────────────────────────────────
const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20% 0px' });

  return (
    <section id="contact" className="py-40 relative z-10 overflow-hidden">
      {/* Big ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }}
        />
      </div>

      <div ref={ref} className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 mb-8"
        >
          Get in touch
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(3rem,10vw,8rem)] font-black tracking-tighter leading-none mb-12 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-600"
        >
          Let's Build<br />Something
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-20"
        >
          <MagneticButton
            href="mailto:nishanthchowdary1234@gmail.com"
            className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-full text-sm hover:bg-gray-100 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.15)]"
          >
            nishanthchowdary1234@gmail.com
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex justify-center gap-6 mb-20"
        >
          {[
            { href: 'https://github.com/ArekatlaNishanthchowdary', label: 'GitHub', icon: <GithubIcon className="w-5 h-5" /> },
            { href: 'https://www.linkedin.com/in/arekatla-nishanth-chowdary/', label: 'LinkedIn', icon: <LinkedinIcon className="w-5 h-5" /> },
          ].map(({ href, label, icon }) => (
            <MagneticButton
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
            >
              {icon} {label}
            </MagneticButton>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="text-gray-700 text-xs font-mono uppercase tracking-widest"
        >
          © {new Date().getFullYear()} Arekatla Nishanth Chowdary
        </motion.p>
      </div>
    </section>
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [loaded, setLoaded] = useState(false);

  // Smooth scroll via Lenis
  useEffect(() => {
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/@studio-freight/lenis@1.0.33/dist/lenis.min.js';
    s.onload = () => {
      const lenis = new (window as any).Lenis({ lerp: 0.07, smoothWheel: true, wheelMultiplier: 0.9 });
      const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    };
    document.head.appendChild(s);
  }, []);

  // Section observer
  useEffect(() => {
    const sections = ['home', 'experience', 'projects', 'certifications', 'contact'];
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.3 }
    );
    sections.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  // Loading screen
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 600);
    return () => clearTimeout(t);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 50, mass: 0.1 });

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#030303] min-h-screen text-white font-sans overflow-x-clip cursor-none">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[100]"
        style={{ scaleX, background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)' }}
      />

      {/* Loading overlay */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400"
            >
              NC.
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom cursor */}
      <Cursor />

      {/* 3D particle background */}
      <ParticleField />

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />

      <Navigation activeSection={activeSection} scrollTo={scrollTo} />

      <main className="relative z-10">
        <Hero scrollTo={scrollTo} />
        <ExperienceAndSkills />
        <Projects />
        <Certifications />
        <Contact />
      </main>
    </div>
  );
}
