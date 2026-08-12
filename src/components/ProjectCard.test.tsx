import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProjectCard from "./ProjectCard";

const sampleProject = {
  name: "Verbalyn",
  tagline: "Microservices real-time chat platform",
  stack: ["Node.js", "React", "Kafka"] as const,
  description: "A test description of the project.",
  githubUrl: "https://github.com/naadaaa/Verbalyn",
};

describe("ProjectCard", () => {
  it("renders the project name and tagline", () => {
    render(<ProjectCard {...sampleProject} />);
    expect(screen.getByText("Verbalyn")).toBeInTheDocument();
    expect(
      screen.getByText("Microservices real-time chat platform")
    ).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<ProjectCard {...sampleProject} />);
    expect(
      screen.getByText("A test description of the project.")
    ).toBeInTheDocument();
  });

  it("renders every stack item as a visible pill", () => {
    render(<ProjectCard {...sampleProject} />);
    for (const tech of sampleProject.stack) {
      expect(screen.getByText(tech)).toBeInTheDocument();
    }
  });

  it("renders a working GitHub link with the correct URL", () => {
    render(<ProjectCard {...sampleProject} />);
    const link = screen.getByRole("link", { name: /view on github/i });
    expect(link).toHaveAttribute("href", sampleProject.githubUrl);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders correctly with an empty stack array", () => {
    render(<ProjectCard {...sampleProject} stack={[]} />);
    expect(screen.getByText("Verbalyn")).toBeInTheDocument();
  });
});