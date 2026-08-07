export const TECH_STACK = [
  { category: 'Languages', items: ['Python', 'C++', 'JavaScript', 'TypeScript'] },
  { category: 'AI & ML', items: ['PyTorch', 'TensorFlow', 'OpenCV', 'YOLO', 'Hugging Face', 'SAM'] },
  { category: 'LLMs & GenAI', items: ['Ollama', 'Unsloth', 'vLLM', 'RAG', 'LangChain', 'LlamaIndex'] },
  { category: 'Backend & Cloud', items: ['FastAPI', 'Node.js', 'Docker', 'Linux', 'Vercel', 'AWS'] },
  { category: 'Databases', items: ['PostgreSQL', 'MongoDB', 'SQLite', 'Redis', 'Vector DBs'] },
  { category: 'Tools', items: ['Git', 'CUDA', 'TensorRT', 'WSL', 'Conda'] },
];

export const EXPERIENCE = [
  {
    role: 'AI Developer Intern',
    company: 'Viswam.AI, IIIT Hyderabad',
    date: 'Apr 2025 – Jul 2025',
    desc: 'Worked hands-on with SAM, Quantization, and Unsloth fine-tuning. Built a custom parameter-efficient fine-tuned model and gained deep exposure to VLLMs for image comprehension tasks.',
  },
  {
    role: 'Robotics Club Group Lead',
    company: 'Amrita Vishwa Vidyapeetham',
    date: 'Jan 2025 – Present',
    desc: 'Led the Robotics Club fostering innovation at the intersection of robotics and AI. Mentored juniors in computer vision and path-planning algorithms.',
  },
];

export const ACHIEVEMENTS = [
  { title: 'Gold Medal', event: '10th Research Day, SRM University (2026)', detail: '"Quantum Enhanced Wafer Failure Prediction using QSVM and QRF on 4 and 8 Qubits"' },
  { title: 'Silver Medal', event: '9th Research Day, SRM University (2025)', detail: '"Emergency Vehicle Detection and Traffic Management using YOLOv8x"' },
  { title: '6× Hackathon Winner', event: 'National AI/ML Competitions', detail: 'Winner & Finalist across multiple national-level competitions.' },
];

export const CERTIFICATIONS = [
  { title: 'OCI 2025 Certified Generative AI Professional', issuer: 'Oracle', date: 'May 2025', id: '101666956OCI25GENAIPRO' },
  { title: 'OCI 2025 AI Foundations Associate', issuer: 'Oracle', date: 'May 2025', id: '101666956OCI25AICFA' },
  { title: 'REST API Intermediate', issuer: 'HackerRank', date: 'Jun 2025', id: '53aca2a32f9f' },
  { title: 'Joy of Computing with Python', issuer: 'NPTEL', date: 'Dec 2024', id: 'NPTEL24CS113S755802494' },
];

export const PROJECTS = [
  {
    title: "Senpai's PDF Workshop",
    year: '2026',
    desc: 'Local-first PDF toolkit with 46 operations across a PySide6 desktop app and CLI, generated from a single operation registry.',
    problem: 'Web-based PDF tools upload your document just to merge, split, or watermark it.',
    solution: 'Each operation is one @register-decorated function; the CLI, GUI, and forms all generate from that registry.',
    tags: ['Python', 'PySide6', 'pypdf', 'pikepdf', 'CLI'],
    metrics: '46 operations · 100 tests passing · zero interface code per tool',
    accent: '#06b6d4',
    github: 'https://github.com/ArekatlaNishanthchowdary/senpais-pdf-workshop',
  },
  {
    title: 'Project Hollow',
    year: '2025',
    desc: 'Autonomous Windows OS agent with closed-loop verification and O(1) hierarchical memory.',
    problem: 'LLM agents crash on long tasks — open-loop failures and unbounded context growth.',
    solution: 'A "Memory Janitor" compresses logs into summaries live, grounded via Accessibility API + vision.',
    tags: ['Llama 3.2/4', 'Groq', 'ChromaDB', 'Neo4j', 'Moondream', 'Python'],
    metrics: '78% task completion · Memory stays flat indefinitely',
    accent: '#8b5cf6',
    github: 'https://github.com/ArekatlaNishanthchowdary',
  },
  {
    title: 'Smart Traffic System',
    year: '2024',
    desc: 'Real-time vehicle detection and adaptive traffic control using deep learning.',
    problem: 'Static traffic signals delay emergency vehicles — no real-time road awareness.',
    solution: 'YOLOv8 + OpenCV pipeline with frame-wise tracking and GPU-optimized inference.',
    tags: ['YOLOv8', 'OpenCV', 'Python', 'IoT', 'NumPy'],
    metrics: '35% faster emergency response',
    accent: '#f97316',
    github: 'https://github.com/ArekatlaNishanthchowdary',
  },
  {
    title: 'WARP',
    year: '2025',
    desc: 'AI-powered environmental damage assessment generating automated government reports.',
    problem: 'Manual damage assessment is slow and inconsistent, delaying intervention.',
    solution: 'Gemini API analyzes images in a Flask + Firebase pipeline that auto-generates reports.',
    tags: ['Gemini API', 'Firebase', 'Flask', 'Python'],
    metrics: 'Full pipeline: image → structured report',
    accent: '#10b981',
    github: 'https://github.com/ArekatlaNishanthchowdary',
  },
];
