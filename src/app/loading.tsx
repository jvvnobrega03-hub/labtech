export default function Loading() {
  return <div className="shell min-h-[55vh] py-20" role="status" aria-live="polite"><div className="h-3 w-28 animate-pulse rounded bg-sky-100" /><div className="mt-5 h-12 max-w-2xl animate-pulse rounded-xl bg-sky-50" /><div className="mt-4 h-5 max-w-xl animate-pulse rounded bg-slate-100" /><span className="sr-only">Carregando conteúdo</span></div>;
}
