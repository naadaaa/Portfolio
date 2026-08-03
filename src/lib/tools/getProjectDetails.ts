import { tool } from "ai";
import { z } from "zod";

// Small, structured "database" of my real projects. In a bigger app this
// would be a real query, but the tool contract (schema in, schema out)
// stays identical either way — that's the point of defining it explicitly.
const PROJECTS = {
  verbalyn: {
    name: "Verbalyn",
    tagline: "Microservices real-time chat platform",
    stack: ["Node.js", "React", "MongoDB", "Redis", "Kafka", "Kong", "Docker"],
    description:
      "A 5-service microservices chat platform behind a Kong API gateway, " +
      "with Kafka event streaming, Redis session caching, and a " +
      "Prometheus/Grafana monitoring stack.",
    githubUrl: "https://github.com/naadaaa/Verbalyn",
  },
  clipsphere: {
    name: "ClipSphere",
    tagline: "Short-video social platform",
    stack: ["Next.js", "Express.js", "MongoDB", "Socket.io", "Stripe", "Docker"],
    description:
      "A TikTok-style video platform with real-time likes/follows/tips via " +
      "Socket.io, JWT/RBAC-secured APIs, and Stripe-based creator payments.",
    githubUrl: "https://github.com/naadaaa/ClipSphere",
  },
  "ghost protocol": {
    name: "Ghost Protocol",
    tagline: "Ephemeral messaging platform",
    stack: ["Next.js", "Express.js", "MongoDB", "Redis", "Firebase", "Twilio"],
    description:
      "A privacy-focused messenger with Redis-TTL self-destructing messages, " +
      "Firebase-backed Google OAuth, and Twilio-based MFA.",
    githubUrl: "https://github.com/naadaaa/ghost-protocol",
  },
  flightdock: {
    name: "FlightDock",
    tagline: "Flight booking system",
    stack: ["React", "Node.js", "Express.js", "MongoDB", "JWT"],
    description:
      "A full-stack flight booking platform with JWT auth, seat-availability " +
      "validation, and reservation history.",
    githubUrl: "https://github.com/nadaaZC/FlightDock",
  },
  readly: {
    name: "Readly",
    tagline: "Book search app",
    stack: ["React", "TypeScript", "Vite", "Firebase Auth", "Google Books API"],
    description:
      "A small book-search app with Firebase email/password auth and " +
      "localStorage-based favorites, built to practice AI-assisted " +
      "development end to end.",
    githubUrl: "https://github.com/naadaaa/readly",
  },
  playground: {
    name: "Accessible Components Playground",
    tagline: "Hand-built ARIA-compliant components",
    stack: ["React", "TypeScript"],
    description:
      "A modal, tabs, and disclosure built from scratch against the W3C " +
      "ARIA Authoring Practices, then compared against shadcn/Radix's " +
      "implementations to find real gaps (portal rendering, " +
      "aria-describedby wiring, vertical orientation support).",
    githubUrl: "https://github.com/naadaaa/Playground",
  },
  portfolio: {
    name: "This Portfolio",
    tagline: "The site you're looking at right now",
    stack: ["Next.js", "TypeScript", "AI SDK", "Gemini"],
    description:
      "Built with Next.js on Vercel, including this AI chat feature itself " +
      "— a streaming route handler with tool calls, grounded in real " +
      "project data instead of guessing.",
    githubUrl: "https://github.com/naadaaa/Portfolio",
  },
} as const;

export const getProjectDetails = tool({
  description:
    "Look up structured details about one of Nada's real projects — stack, " +
    "description, and GitHub link. Use this whenever the user asks about a " +
    "specific named project: Verbalyn, ClipSphere, Ghost Protocol, " +
    "FlightDock, Readly, the Accessible Components Playground, or this " +
    "portfolio site itself.",

  inputSchema: z.object({
    projectName: z
      .string()
      .describe(
        "The project name as mentioned by the user, e.g. 'Verbalyn' or 'ClipSphere'."
      ),
  }),

  execute: async ({ projectName }) => {
    const query = projectName.trim().toLowerCase();

    // Exact match first, then fall back to substring matching in either
    // direction so phrases like "the accessibility playground" still find
    // the "playground" entry, and "clip" alone still finds "clipsphere".
    let project: (typeof PROJECTS)[keyof typeof PROJECTS] | undefined =
      PROJECTS[query as keyof typeof PROJECTS];

    if (!project) {
      const match = Object.entries(PROJECTS).find(
        ([key, value]) =>
          query.includes(key) ||
          key.includes(query) ||
          value.name.toLowerCase().includes(query) ||
          query.includes(value.name.toLowerCase())
      );
      project = match?.[1];
    }

    if (!project) {
      // Thrown errors surface to the client as an "output-error" tool
      // part instead of crashing the request — this is the designed
      // error path the assignment asks for.
      throw new Error(
        `No project found matching "${projectName}". Known projects: ` +
          Object.values(PROJECTS)
            .map((p) => p.name)
            .join(", ")
      );
    }

    return project;
  },
});