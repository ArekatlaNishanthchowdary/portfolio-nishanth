import React from "react";

import "./Info.scss";
import Button from "../Button/Button";

const infoMeData = {
  one: {
    content: [
      {
        header: "👋 About Me",
        paragraphs: [
          "Hey there! I'm *Nishanth (Arekatla Nishanth Chowdary)*, a B.Tech CSE (AI) student at *Amrita Vishwa Vidyapeetham*, Amaravati.",
          "I specialize in building *autonomous agents*, *hybrid RAG pipelines*, *local-first tools*, and *scalable AI infrastructure*. Passionate about combining clean software architecture with real-world machine intelligence.",
        ],
      },
      {
        header: "🚀 Featured Systems & Projects",
        paragraphs: [
          " - *Ask-My-Docs*: Local-first RAG document Q&A assistant in a single Go binary. Powered by Qdrant, Ollama, hybrid retrieval, and strict citation grounding guards (100% private & offline).",
          " - *HAFT-XAI*: Hierarchical FT-Transformer with Hard-Concrete gating for explainable intrusion detection in Industrial IoT (CIC-IIoT-2025), under Dr. Raj Kumar Batchu.",
          " - *unrepack*: Rust app and CLI that unpacks FreeArc game repacks without their installer, freeing the repack's space as it is read.",
          " - *BitChord (Contributor)*: Modern YouTube music client with clean aesthetics inspired by Apple Music.",
          " - *Handsfree / Project Hollow*: Local, open-source autonomous computer-use agent driving desktop and browser tasks with action-level safety guardrails and O(1) hierarchical memory.",
          " - *Smart Traffic System*: Real-time vehicle detection and adaptive traffic control using YOLOv8x and OpenCV.",
        ],
      },
      {
        header: "🛠️ Engineering Stack",
        paragraphs: [
          " - *Languages*: Python, Go, TypeScript, JavaScript, C++, Java",
          " - *AI & ML*: PyTorch, TensorFlow, OpenCV, YOLO, Hugging Face, Segment Anything (SAM)",
          " - *LLMs & GenAI*: Ollama, Unsloth, vLLM, RAG, LangChain, LlamaIndex",
          " - *Backend & Cloud*: FastAPI, Node.js, Docker, Linux, AWS, Vercel",
          " - *Databases*: PostgreSQL, MongoDB, Redis, SQLite, Qdrant / Vector DBs",
          " - *Tools*: Git, CUDA, TensorRT, WSL, Conda",
        ],
      },
      {
        header: "🏆 Honors & Credentials",
        paragraphs: [
          " - *Gold Medal*: 10th Research Day, SRM University ('Quantum Enhanced Wafer Failure Prediction using QSVM & QRF').",
          " - *Silver Medal*: 9th Research Day, SRM University ('Emergency Vehicle Detection & Traffic Management using YOLOv8x').",
          " - *6× Hackathon Winner*: Finalist and winner across multiple national AI/ML competitions.",
          " - *Oracle Certified*: OCI 2025 Generative AI Professional & AI Foundations Associate.",
        ],
      },
      {
        header: "📫 Connect With Me",
        paragraphs: [
          " - *GitHub*: github.com/ArekatlaNishanthchowdary",
          " - *Portfolio*: arekatlanishanthchowdary.github.io/portfolio-nishanth",
          " - *LinkedIn*: linkedin.com/in/arekatla-nishanth-chowdary",
          " - *Email*: nishanthchowdary1234@gmail.com",
        ],
      },
    ],
  },
};

const Info = () => {
  const data = infoMeData["one"];

  if (!data) {
    return <div>Data not found</div>;
  }

  const parseText = (text) => {
    const parts = text.split(/(\*[^*]+\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        const content = part.slice(1, -1);
        return (
          <span key={index} className="yellow-text">
            {content}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <>
      <div className="data-container">
        <Button href="https://github.com/ArekatlaNishanthchowdary" type={"link"}>
          ⭐ Visit My GitHub Profile
        </Button>

        {data.content.map((section, index) => (
          <div key={index} className="data-section">
            <h2 className="info-section-header">{section.header}</h2>
            {section.paragraphs.map((paragraph, pIndex) => (
              <p key={`${index}-${pIndex}`} className="section-paragraph">
                {parseText(paragraph)}
              </p>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default Info;
