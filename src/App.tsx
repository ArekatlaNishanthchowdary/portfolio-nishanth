import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ExternalLink, ChevronDown, Terminal, Download, Trophy, Briefcase, FlaskConical } from 'lucide-react';

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

const TECH_STACK = [
  { category: 'Languages', items: ['Python', 'C++', 'JavaScript', 'TypeScript'] },
  { category: 'AI & ML', items: ['PyTorch', 'TensorFlow', 'OpenCV', 'YOLO', 'Hugging Face', 'SAM'] },
  { category: 'LLMs & GenAI', items: ['Ollama', 'Unsloth', 'vLLM', 'RAG', 'LangChain', 'LlamaIndex'] },
  { category: 'Backend & Cloud', items: ['FastAPI', 'Node.js', 'Docker', 'Linux', 'Vercel', 'AWS'] },
  { category: 'Databases', items: ['PostgreSQL', 'MongoDB', 'SQLite', 'Redis', 'Vector DBs'] },
  { category: 'Tools', items: ['Git', 'CUDA', 'TensorRT', 'WSL', 'Conda'] }
];

const EXPERIENCE = [
  { role: 'AI Developer Intern', company: 'Viswam.AI, IIIT Hyderabad', date: '2023 - Present', desc: 'Worked on quantization, Unsloth fine-tuning, SAM, VLLMs, and custom model development. Bridged the gap between theoretical research and scalable inference architectures.' },
  { role: 'Robotics Club Group Lead', company: 'Student Mentor', date: '2022 - Present', desc: 'Led a team of engineering students in designing autonomous robotic systems. Mentored juniors in computer vision and path-planning algorithms.' }
];

const ACHIEVEMENTS = [
  '6× Hackathon Winner & Finalist across national AI/ML competitions.',
  'Gold Medal — SRM 10th Research Day for innovative deep learning research.',
  'Silver Medal — SRM 9th Research Day for computer vision applications.'
];

const PROJECTS = [
  { title: 'KTP Multi-Agent Coding Factory', desc: 'Multi-agent coding system using KTP-based task delegation between specialized agents.', problem: 'Writing boilerplate and integrating complex systems manually is extremely time-consuming and error-prone.', solution: 'Engineered an orchestrator that delegates tasks to backend, frontend, DB, tester, and integrator agents operating in parallel.', tags: ['PyTorch', 'LangChain', 'Python', 'Docker'], metrics: 'Reduced code scaffolding time by 85%.', color: 'from-blue-500 to-cyan-400' },
  { title: 'IP & MAC Masking SaaS', desc: 'VPN-like Network System managing secure, masked infrastructure.', problem: 'Need for a lightweight, highly secure network masking solution without the overhead of traditional VPN protocols.', solution: 'Built a full-stack networking SaaS with Linux server orchestration and custom Windows client routing.', tags: ['C++', 'Linux', 'Networking', 'Node.js'], metrics: 'Sub-10ms latency overhead.', color: 'from-purple-500 to-pink-400' },
  { title: 'LLM Fine-Tuning Engine', desc: 'Custom model development utilizing Unsloth and quantization.', problem: 'Running 7B+ parameter models locally requires excessive VRAM and computational power.', solution: 'Implemented 4-bit quantization pipelines and LoRA fine-tuning using Unsloth to deploy custom models on consumer GPUs.', tags: ['Unsloth', 'CUDA', 'Hugging Face', 'vLLM'], metrics: 'Achieved 4x faster inference.', color: 'from-emerald-500 to-teal-400' },
  { title: 'Multimodal Vision System', desc: 'Real-time object detection and segmentation engine.', problem: 'Standard bounding boxes lack the pixel-perfect precision required for complex visual reasoning tasks.', solution: 'Combined YOLOv8 for rapid object localization with SAM (Segment Anything Model) for zero-shot masking.', tags: ['OpenCV', 'YOLO', 'SAM', 'PyTorch'], metrics: '94% mAP at 30 FPS inference.', color: 'from-orange-500 to-red-400' }
];

const LOGS = [
  { title: 'How I built a multi-agent coding workflow', type: 'Architecture' },
  { title: 'Fine-tuning LLMs with Unsloth on Consumer GPUs', type: 'Experiment' },
  { title: 'Building a VPN-like SaaS from scratch', type: 'Build Log' },
  { title: 'Object detection using YOLO and OpenCV', type: 'Tutorial' }
];

const Navigation = ({ activeSection, scrollTo }: { activeSection: string; scrollTo: (id: string) => void }) => (
  <motion.nav
    initial={{ y: -100, x: '-50%' }}
    animate={{ y: 0, x: '-50%' }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="fixed top-6 left-1/2 z-50 grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-center px-6 py-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 w-[90%] max-w-5xl"
  >
    <div className="flex justify-start">
      <div className="text-white font-bold text-xl tracking-tighter cursor-pointer hover:opacity-80 transition-opacity" onClick={() => scrollTo('home')}>NC.</div>
    </div>
    <div className="hidden md:flex items-center justify-center gap-6">
      {['home', 'experience', 'projects', 'logs', 'contact'].map(i => (
        <button key={i} onClick={() => scrollTo(i)} className={`text-xs font-bold uppercase tracking-widest transition-colors ${activeSection === i ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}>{i}</button>
      ))}
    </div>
    <div className="flex justify-end gap-3">
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => scrollTo('contact')} className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium text-xs hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.5)] whitespace-nowrap">
        Let's Talk
      </motion.button>
    </div>
  </motion.nav>
);

const Hero = ({ scrollTo }: { scrollTo: (id: string) => void }) => (
  <section id="home" className="relative z-10 min-h-screen flex items-center justify-center overflow-hidden pt-20">
    <motion.div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
        <span className="text-sm font-medium text-gray-300">Open to AI Engineering Opportunities</span>
      </motion.div>
      <motion.h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-600" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
        Nishanth<br /><span className="italic font-light">Chowdary</span>
      </motion.h1>
      <motion.p className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 font-light" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}>
        Building intelligent systems, fine-tuning LLMs, and architecting scalable AI infrastructure.
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="flex flex-wrap justify-center gap-4">
        <button onClick={() => scrollTo('projects')} className="group relative px-8 py-4 bg-white text-black font-semibold rounded-full overflow-hidden transition-all hover:scale-105">
          <span className="relative z-10 flex items-center gap-2">View Architectures <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" /></span>
        </button>
        <a href="https://ArekatlaNishanthchowdary.github.io/portfolio-nishanth/resume.pdf" download className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-full hover:bg-white/10 transition-colors flex items-center gap-2 hover:scale-105 duration-300">
          <Download className="w-4 h-4" /> Resume
        </a>
        <div className="flex gap-4">
          <a href="https://github.com/ArekatlaNishanthchowdary" target="_blank" rel="noreferrer" className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white hover:scale-105 transform duration-300"><GithubIcon className="w-6 h-6" /></a>
          <a href="https://www.linkedin.com/in/arekatla-nishanth-chowdary/" target="_blank" rel="noreferrer" className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white hover:scale-105 transform duration-300"><LinkedinIcon className="w-6 h-6" /></a>
        </div>
      </motion.div>
    </motion.div>
  </section>
);

const ExperienceAndSkills = () => (
  <section id="experience" className="py-32 relative z-10 bg-black/60 backdrop-blur-md border-y border-white/5">
    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20">
      <div className="space-y-20">
        <div>
          <h2 className="text-4xl font-extrabold mb-12 flex items-center gap-4 text-white tracking-tighter"><Briefcase className="text-blue-500 w-8 h-8" /> Track Record</h2>
          <div className="space-y-8">
            {EXPERIENCE.map((exp, i) => (
              <div key={i} className="relative pl-10 border-l border-white/10 group">
                <div className="absolute left-[-5px] top-8 w-2.5 h-2.5 rounded-full bg-blue-500" />
                <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                  <h3 className="text-2xl font-bold text-white mb-2">{exp.role}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm mb-6 font-mono">
                    <span className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">{exp.company}</span>
                    <span className="text-gray-600">|</span>
                    <span className="text-gray-400">{exp.date}</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed font-light">{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-extrabold mb-10 flex items-center gap-4 text-white tracking-tighter"><Trophy className="text-purple-500 w-8 h-8" /> Achievements</h2>
          <div className="space-y-4">
            {ACHIEVEMENTS.map((ach, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-5">
                <div className="p-3 rounded-xl bg-black/50 border border-white/10 shrink-0"><Trophy className="w-5 h-5 text-purple-400" /></div>
                <p className="text-gray-300 font-light leading-relaxed pt-1">{ach}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="lg:pl-10">
        <h2 className="text-4xl font-extrabold mb-12 flex items-center gap-4 text-white tracking-tighter"><Terminal className="text-emerald-500 w-8 h-8" /> Engineering Stack</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {TECH_STACK.map((stack, i) => (
            <div key={i} className="p-8 rounded-3xl bg-black/40 border border-white/5 hover:border-emerald-500/30 transition-colors group">
              <h3 className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-6">{stack.category}</h3>
              <div className="flex flex-wrap gap-2">
                {stack.items.map(item => <span key={item} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-sm text-gray-300 font-medium">{item}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const HorizontalProjects = () => {
  const targetRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);

  return (
    <section id="projects" ref={targetRef} className="relative h-[400vh] bg-transparent">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute top-10 left-10 md:left-20 z-20">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white">Featured AI Systems</h2>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4" />
        </div>
        <motion.div style={{ x }} className="flex gap-10 px-10 md:px-20 w-[400vw] items-center mt-12">
          {PROJECTS.map((p, i) => (
            <div key={i} className="w-[85vw] md:w-[70vw] h-[75vh] shrink-0 bg-black/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 flex flex-col relative overflow-hidden group">
              <div className="flex justify-between items-start mb-8 relative z-10">
                <span className="text-7xl font-bold text-white/10 font-mono leading-none">0{i + 1}</span>
              </div>
              <div className="grid lg:grid-cols-12 gap-10 flex-1 relative z-10">
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tighter">{p.title}</h3>
                  <p className="text-xl text-gray-400 font-light mb-8">{p.desc}</p>
                  <div className="flex items-center gap-4 mt-auto">
                    <a href="#" className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold text-sm rounded-full hover:bg-gray-200 transition-colors"><ExternalLink className="w-4 h-4" /> Live Demo</a>
                    <a href="#" className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-bold text-sm rounded-full hover:bg-white/20 transition-colors"><GithubIcon className="w-4 h-4" /> Code</a>
                  </div>
                </div>
                <div className="lg:col-span-7 grid grid-rows-2 gap-4 h-full">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
                    <h4 className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2">Problem</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{p.problem}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
                      <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">Solution</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{p.solution}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
                      <h4 className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-2">Metrics</h4>
                      <p className="text-white text-xl md:text-2xl font-bold tracking-tight">{p.metrics}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const LogsAndExperiments = () => (
  <section id="logs" className="py-32 relative z-10 bg-black/80 backdrop-blur-lg border-y border-white/5">
    <div className="max-w-5xl mx-auto px-6">
      <h2 className="text-4xl font-bold mb-16 flex items-center gap-3 text-white"><FlaskConical className="text-orange-500" /> Research & Build Logs</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {LOGS.map((log, i) => (
          <a key={i} href="#" className="group block p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all">
            <span className="inline-block px-3 py-1 bg-white/10 rounded-md text-xs font-mono text-gray-400 mb-4 uppercase tracking-widest">{log.type}</span>
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">{log.title}</h3>
            <div className="mt-6 flex items-center text-sm font-medium text-gray-500 group-hover:text-white transition-colors">Read Log <ExternalLink className="w-4 h-4 ml-2" /></div>
          </a>
        ))}
      </div>
    </div>
  </section>
);

const Contact = () => (
  <section id="contact" className="py-32 relative z-10 bg-black flex flex-col items-center justify-center min-h-[80vh]">
    <div className="text-center relative z-20">
      <h2 className="text-[8vw] font-extrabold tracking-tighter leading-none mb-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">INITIATE CONNECTION</h2>
      <a href="mailto:nishanthchowdary1234@gmail.com" className="px-10 py-5 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
        nishanthchowdary1234@gmail.com
      </a>
    </div>
    <div className="absolute bottom-10 w-full px-10 flex flex-col md:flex-row justify-between items-center text-gray-600 text-xs font-bold uppercase tracking-widest gap-4">
      <p>© {new Date().getFullYear()} NISHANTH CHOWDARY.</p>
      <div className="flex gap-8">
        <a href="https://github.com/ArekatlaNishanthchowdary" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
        <a href="https://www.linkedin.com/in/arekatla-nishanth-chowdary/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
      </div>
    </div>
  </section>
);

export default function App() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/@studio-freight/lenis@1.0.33/dist/lenis.min.js';
    s.onload = () => {
      const lenis = new (window as any).Lenis({ lerp: 0.03, smoothWheel: true, wheelMultiplier: 0.8 });
      const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    };
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    const sections = ['home', 'experience', 'projects', 'logs', 'contact'];
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(entry.target.id); });
      },
      { threshold: 0.3 }
    );
    sections.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 50, mass: 0.1 });

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-x-clip">
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-emerald-500 origin-left z-50" style={{ scaleX }} />
      <Navigation activeSection={activeSection} scrollTo={scrollTo} />
      <main>
        <Hero scrollTo={scrollTo} />
        <ExperienceAndSkills />
        <HorizontalProjects />
        <LogsAndExperiments />
        <Contact />
      </main>
    </div>
  );
}
