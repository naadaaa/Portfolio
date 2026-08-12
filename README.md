# Nada Waleed Abdelsattar — Portfolio

Live: https://nada-abdelsattar.vercel.app

A personal portfolio site with a working AI feature: visitors can ask
questions about my projects and get grounded answers pulled from real
project data via tool calls, not generic AI guesses.

## Setup & Run

```
git clone https://github.com/naadaaa/Portfolio.git
cd Portfolio
npm install
```

Create `.env.local` in the root:
```
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
```
(Get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey))

```
npm run dev
```

Open `http://localhost:3000`.

To run tests:
```
npm test
```

## Architecture

- **`src/app/`** — Next.js App Router pages: Home (hero + chat), Work
  (case studies), About, Contact, plus the `/api/chat` route handler.
- **`src/components/`** — `Nav`, `PortfolioChat` (the chat UI), `ProjectCard`
  (renders tool results).
- **`src/lib/ai-config.ts`** — model choice and system prompt, kept in one
  file so it's the single source of truth for how the AI is grounded.
- **`src/lib/tools/getProjectDetails.ts`** — the one server-side tool the
  model can call, with a Zod input schema and a typed return shape.
- **`src/app/error.tsx`** — route-level error boundary.

## AI Integration

The chat feature uses the Vercel AI SDK's `streamText` with Google's
Gemini model, calling one custom tool: `getProjectDetails`. The model
decides on its own whether a user's question requires looking up a
specific project, rather than always answering from general text alone.
The tool returns structured data (name, stack, description, GitHub link),
which renders as a real `ProjectCard` component, not a JSON dump. Four
distinct lifecycle states are rendered separately: deciding what to look
up, looking it up, showing the result, and a designed error state if the
project isn't found.

This isn't a decorative chatbot: it's the actual mechanism a hiring
manager would use to get a specific answer fast, grounded in my real
background instead of scrolling through case studies hoping to find it.

## Known Limitations & Future Improvements

- The chat's project data is hardcoded in `getProjectDetails.ts` rather
  than pulled from a real database; adding a new project means editing
  code, not a CMS.
- No automated end-to-end test covers the full chat flow yet, only the
  `ProjectCard` component in isolation.
- Mobile Safari has been manually tested on a real device once; no
  automated cross-browser testing is in place.
- The mid-stream stall-detection timeout (8 seconds) was chosen somewhat
  arbitrarily and hasn't been tuned against real user patience data.

## Testing

Unit tests cover `ProjectCard.tsx`: renders name/tagline, description,
every stack item, a working GitHub link with correct attributes, and
correct behavior with an empty stack array. Run with `npm test`.

## Performance & Accessibility

Lighthouse (mobile): Performance 85, Accessibility 95, Best Practices 100,
SEO 100. The initial performance run scored 74 due to the AI SDK chat
bundle loading and blocking the main thread on every page visit, even
before the chat was used; fixed by lazy-loading the component with
`next/dynamic`, deferring that JavaScript until the chat section actually
renders.

## Deployment

Deployed on Vercel, connected to the `main` branch of this repo — every
push triggers an automatic redeploy. Environment variable
`GOOGLE_GENERATIVE_AI_API_KEY` is set in Vercel's project settings, not
committed to the repo.