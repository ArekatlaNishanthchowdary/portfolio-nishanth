import "./About.scss";
import Button from "../Button/Button";

const aboutMeData = {
  one: {
    name: "Nishanth (Arekatla Nishanth Chowdary)",
    imageUrl: `${import.meta.env.BASE_URL}images/about/about-1.jpeg`,
    portfolioLink: "https://arekatlanishanthchowdary.github.io/portfolio-nishanth/",
    githubLink: "https://github.com/ArekatlaNishanthchowdary",
    content: [
      {
        header: "About Me",
        paragraphs: [
          "Hey there👋! Welcome to my Minecraft folio! My name is Nishanth (Arekatla Nishanth Chowdary). I'm an AI Developer and Systems Engineer currently pursuing B.Tech CSE (AI) at Amrita Vishwa Vidyapeetham, Hyderabad.",
          "I have a deep passion for building practical, high-performance systems — from autonomous computer-use agents and local-first RAG pipelines to fine-tuning large language models and computer vision pipelines.",
          "When I'm not training models or architecting software, I lead the Robotics Club at Amrita, mentor juniors in computer vision and path planning, compete in AI hackathons (6× winner/finalist), and explore emerging research.",
        ],
      },
      {
        header: "What Drives Me",
        paragraphs: [
          " - Local-First & Privacy: Software should belong to the user. I love building tools like Ask-My-Docs and Senpai's PDF Workshop that deliver full power locally with zero cloud dependencies or telemetry.",
          " - Systems & Efficiency: Deep curiosity for hardware acceleration — optimizing models with CUDA, TensorRT, Unsloth, and quantization for real-world low latency.",
          " - Collaborative Growth: Leading club initiatives, open-source contributions, and working with talented peers across challenging engineering problems.",
          " - First-Principles Engineering: Whether it's quantum-enhanced wafer failure prediction or hierarchical transformers for IIoT intrusion detection, I enjoy tackling complex problems from the ground up.",
        ],
      },
    ],
  },
};

const About = () => {
  const data = aboutMeData["one"];

  if (!data) {
    return <div>Data not found</div>;
  }

  return (
    <div className="data-container">
      <div className="image-wrapper">
        <img src={data.imageUrl} alt={data.name} className="data-image" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
        <Button href={data.portfolioLink} type={"link"}>
          🌐 View My Primary Portfolio
        </Button>
        <Button href={data.githubLink} type={"link"}>
          ⭐ Visit My GitHub Profile
        </Button>
      </div>

      {data.content.map((section, index) => (
        <div key={index} className="data-section">
          <h2 className="about-section-header">{section.header}</h2>
          {section.paragraphs.map((paragraph, pIndex) => (
            <p key={`${index}-${pIndex}`} className="section-paragraph">
              {paragraph}
            </p>
          ))}
        </div>
      ))}

      <div className="image-wrapper-two">
        <img
          src={`${import.meta.env.BASE_URL}images/about/about-2.jpeg`}
          alt="Nishanth"
          className="data-image-two"
        />
      </div>
      <p className="section-paragraph">
        - - Building, Exploring & Creating - -
      </p>

      <div className="image-wrapper-3">
        <img
          src={`${import.meta.env.BASE_URL}images/about/about-3.jpeg`}
          alt="Nishanth Portrait"
          className="data-image-portrait"
        />
      </div>
      <p className="section-paragraph">- - Nishanth Chowdary - -</p>

      <div className="image-wrapper-two">
        <img
          src={`${import.meta.env.BASE_URL}images/about/about-4.jpeg`}
          alt="Nishanth"
          className="data-image-two"
        />
      </div>
      <p className="section-paragraph">- - Moments & Milestones - -</p>
    </div>
  );
};

export default About;
