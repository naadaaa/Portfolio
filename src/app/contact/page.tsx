export default function ContactPage() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
      <p className="max-w-xl text-neutral-600">
        Interested in working together? Reach out directly.
      </p>
      <a
        href="mailto:you@example.com"
        className="inline-block w-fit rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
      >
        Email me
      </a>
    </section>
  );
}