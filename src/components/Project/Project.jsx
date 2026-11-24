import "./Project.scss";

import Button from "../Button/Button";

const projectData = {
  one: {
    name: "Ask My Docs",
    imageUrl: `${import.meta.env.BASE_URL}images/ask-my-docs.png`,
    externalLink: "https://github.com/ArekatlaNishanthchowdary/Ask-My-Docs",
    buttonText: "⭐ View Ask-My-Docs on GitHub",
    content: [
      {
        header: "About the Project",
        paragraphs: [
          "Hybrid-retrieval RAG in a single Go binary — enforced citations, three grounding guards, and a CI-gated eval set. Runs fully local or hosted.",
          "Problem Solved: Most RAG systems confidently answer questions their source documents never actually cover, leading to silent hallucinations.",
          "Architecture: A confidence gate, citation validation, and entailment check refuse to answer rather than hallucinate. Built-in hybrid search combines vector embeddings (Qdrant/Ollama) with BM25 lexical ranking and reranking.",
        ],
      },
      {
        header: "Tech Stack & Benchmarks",
        paragraphs: [
          " - Tech: Go, Qdrant, Ollama, Hybrid Search, Reranking, Vector DB",
          " - Metrics: nDCG@10 0.905 · 100% private, self-hosted, offline capable",
        ],
      },
    ],
  },
  two: {
    name: "unrepack",
    imageUrl: `${import.meta.env.BASE_URL}images/unrepack-wide.png`, // wide shot; the square unrepack.png is for the wall frame
    externalLink: "https://github.com/ArekatlaNishanthchowdary/unrepack",
    buttonText: "⭐ View unrepack on GitHub",
    content: [
      {
        header: "About the Project",
        paragraphs: [
          "Unpacks FreeArc game repacks (DODI, FitGirl) straight into a game folder without running their installer, checking every file's CRC as it goes. Ships as a Windows app and a command-line tool.",
          "Problem Solved: An installer needs room for the repack and the whole game at once. Crusader Kings III's 6.05 GB repack installs to 19.87 GB, so it needs about 26 GB of disk.",
          "Architecture: Each block decodes through a pipeline of stages: the repack's 32-bit CLS plug-ins in a small host process, arc.ini decoders as processes, and Rust ports of FreeArc's built-in decoders as threads. With --free-as-read, the parts of the repack it has already read are zeroed as sparse ranges, so NTFS gives that space back mid-extraction.",
        ],
      },
      {
        header: "Tech Stack & Results",
        paragraphs: [
          " - Tech: Rust, C (32-bit CLS host), egui, NTFS sparse files, Inno Setup script parsing",
          " - Results: Crusader Kings III needs 13.94 GB free instead of 19.99 GB · every file CRC-checked · tested on games up to 152.9 GB unpacked",
        ],
      },
    ],
  },
  three: {
    name: "BitChord (Contributor)",
    imageUrl: `${import.meta.env.BASE_URL}images/bitchord.png`,
    externalLink: "https://github.com/kushagrasinghx/BitChord",
    buttonText: "⭐ View BitChord on GitHub",
    content: [
      {
        header: "About the Project",
        paragraphs: [
          "BitChord - A modern YouTube music client with clean aesthetics inspired by Apple Music.",
          "Contributed to this open-source desktop music application offering seamless playback, curated album aesthetics, and desktop audio integration.",
          "Designed for music enthusiasts who want a native, distraction-free desktop music experience without ads or telemetry bloat.",
        ],
      },
      {
        header: "Tech Stack & Role",
        paragraphs: [
          " - Tech: TypeScript, React, Electron, Web Audio APIs, Tailwind CSS",
          " - Role: Open-source contributor & feature development",
        ],
      },
    ],
  },
  four: {
    name: "HAFT-XAI (IIoT NIDS)",
    imageUrl: `${import.meta.env.BASE_URL}images/haft-xai.png`,
    externalLink: "https://github.com/ArekatlaNishanthchowdary",
    buttonText: "⭐ View on GitHub",
    content: [
      {
        header: "About the Project",
        paragraphs: [
          "Hierarchical Adaptive Feature-Selected Transformer (HAFT) for Explainable Intrusion Detection in Industrial IoT (IIoT).",
          "Capstone research under Dr. Raj Kumar Batchu at Amrita Vishwa Vidyapeetham, evaluated on the real-world CIC-IIoT-2025 dataset.",
          "Architecture: Combines 4-level hierarchical classification (L0 Binary, L1 Category, L2 Technique, L3 Attack) with Hard-Concrete stochastic gating for dynamic feature selection, FT-Transformer with CLS tokens, and Supervised Contrastive Loss (SupCon).",
          "Deployment: Complete real-time edge deployment stack with a live XAI web dashboard, live packet capture stream, and low-latency inference server.",
        ],
      },
      {
        header: "Tech Stack & Benchmarks",
        paragraphs: [
          " - Tech: PyTorch, FT-Transformer, Hard-Concrete Gating, SupCon, Scikit-learn, FastAPI, Chart.js",
          " - Benchmark: 98.6% L0 Accuracy (0.972 MCC) · 98.3% L1 Accuracy (0.986 Macro-F1) on CIC-IIoT-2025",
          " - Academic Guide: Dr. Raj Kumar Batchu, School of Computing, Amrita Vishwa Vidyapeetham, Amaravati",
        ],
      },
    ],
  },
};

const Project = ({ projectID }) => {
  const project = projectData[projectID];

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="project-container">
      <div className="project-image-wrapper">
        <img
          src={project.imageUrl}
          alt={project.name}
          className="project-image"
        />
      </div>

      <Button href={project.externalLink} type={"link"}>
        {project.buttonText || `View ${project.name} on GitHub`}
      </Button>

      {project.content.map((section, index) => (
        <div key={index} className="project-section">
          <h2 className="project-section-header">{section.header}</h2>
          {section.paragraphs.map((paragraph, pIndex) => (
            <p key={`${index}-${pIndex}`} className="section-paragraph">
              {paragraph}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Project;
