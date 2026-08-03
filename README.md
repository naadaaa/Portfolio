This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## AI Chat Tool: `getProjectDetails`

The portfolio's AI chat feature (`/api/chat`) includes one server-side tool
the model can call when a user asks about a specific project.

### Contract

**Name:** `getProjectDetails`

**Input schema (Zod):**
```ts
z.object({
  projectName: z.string().describe(
    "The project name as mentioned by the user, e.g. 'Verbalyn' or 'ClipSphere'."
  ),
})
```

**Return shape (success):**
```ts
{
  name: string;
  tagline: string;
  stack: readonly string[];
  description: string;
  githubUrl: string;
}
```

**Return shape (failure):** throws an `Error` with a message listing the
known project names, which the client renders as a designed error state
(not a crash).

### Known projects
Verbalyn, ClipSphere, Ghost Protocol, FlightDock, Readly, Accessible
Components Playground, This Portfolio.

### Matching behavior
Looks for an exact key match first, then falls back to substring matching
in both directions, so loose phrasing like "the accessibility playground
you built" still resolves to the right entry.

### Client rendering
The tool's four lifecycle states each get a distinct UI treatment in
`PortfolioChat.tsx`:
- `input-streaming` — generic "deciding" indicator, no input yet
- `input-available` — shows the specific project name being looked up
- `output-available` — renders the `ProjectCard` component (not raw JSON)
- `output-error` — a red-bordered error box showing the real error message