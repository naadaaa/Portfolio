const CASE_STUDIES = [
  {
    slug: "case-study-one",
    title: "Case Study One",
    summary: "Placeholder summary of the first project — problem, approach, outcome.",
  },
  {
    slug: "case-study-two",
    title: "Case Study Two",
    summary: "Placeholder summary of the second project — problem, approach, outcome.",
  },
];

export default function WorkPage() {
  return (
    <section className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Work</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        {CASE_STUDIES.map((study) => (
          <article
            key={study.slug}
            className="rounded-lg border border-neutral-200 p-6"
          >
            <h2 className="text-xl font-semibold">{study.title}</h2>
            <p className="mt-2 text-sm text-neutral-600">{study.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}