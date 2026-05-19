import { AppShell } from '@/components/layout/app-shell';

export function StaticPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <article className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
        <h1 className="text-3xl font-bold text-stone-900">{title}</h1>
        <div className="prose prose-stone mt-6 max-w-none text-stone-700">{children}</div>
      </article>
    </AppShell>
  );
}
