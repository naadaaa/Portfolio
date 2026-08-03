export interface ProjectCardData {
  name: string;
  tagline: string;
  stack: readonly string[];
  description: string;
  githubUrl: string;
}

type ProjectCardProps = ProjectCardData;

export default function ProjectCard({
  name,
  tagline,
  stack,
  description,
  githubUrl,
}: ProjectCardProps) {
  return (
    <div
      style={{
        border: "1px solid #d8c5cb",
        borderRadius: 10,
        padding: 14,
        background: "#FFFFFF",
        maxWidth: 340,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 16, color: "#A14B65" }}>{name}</h3>
      <p style={{ margin: "2px 0 8px", fontSize: 12, color: "#8a7a80" }}>{tagline}</p>
      <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.5 }}>{description}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        {stack.map((tech) => (
          <span
            key={tech}
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 999,
              background: "#F0E2E7",
              color: "#6b3d4d",
            }}
          >
            {tech}
          </span>
        ))}
      </div>
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: 12, color: "#9B8AC4", fontWeight: 600 }}
      >
        View on GitHub →
      </a>
    </div>
  );
}