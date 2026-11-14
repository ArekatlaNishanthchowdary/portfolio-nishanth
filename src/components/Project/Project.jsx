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
    name: "Senpai's PDF Workshop",
    imageUrl: `${import.meta.env.BASE_URL}images/senpai.png`,
    externalLink: "https://github.com/ArekatlaNishanthchowdary/senpais-pdf-workshop",
    buttonText: "⭐ View senpais-pdf-workshop on GitHub",
    content: [
      {
        header: "About the Project",
        paragraphs: [
          "Local PDF toolkit with 44+ operations across a PySide6 desktop app and a CLI — both generated from a single operation registry. No upload, no account, no Docker.",
          "Problem Solved: Web-based PDF tools require uploading sensitive documents just to merge, split, reorder, compress, or watermark them.",
          "Architecture: Each PDF operation is one clean @register-decorated function. The CLI parser, GUI layout, and interactive parameter forms all auto-generate from that registry with zero boilerplate.",
        ],
      },
      {
        header: "Tech Stack & Quality",
        paragraphs: [
          " - Tech: Python, PySide6, pypdf, pikepdf, Dynamic CLI Registry",
          " - Metrics: 46 operations · 100 unit tests passing · zero interface code per tool",
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
