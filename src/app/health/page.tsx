type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

async function getTodo(): Promise<Todo> {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
    // Always fetch fresh data for this health check
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Health check fetch failed: ${res.status}`);
  }

  return res.json();
}

export default async function HealthPage() {
  const todo = await getTodo();

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Health Check</h1>
      <p className="text-neutral-600">
        Confirms server-side data fetching works in this environment.
      </p>
      <pre className="overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm">
        {JSON.stringify(todo, null, 2)}
      </pre>
      <p className="text-sm text-green-700">
        ✓ Fetch succeeded — data returned from jsonplaceholder.typicode.com
      </p>
    </section>
  );
}