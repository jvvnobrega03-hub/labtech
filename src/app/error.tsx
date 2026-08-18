"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="shell grid min-h-[65vh] place-items-center py-20 text-center">
      <div>
        <p className="eyebrow">Não foi possível concluir</p>
        <h1 className="display mt-4 text-3xl md:text-4xl">Ocorreu uma falha ao carregar esta página.</h1>
        <p className="mx-auto mt-5 max-w-lg leading-7 text-slate-600">Tente novamente. Se o problema continuar, use os canais de contato da Labtech.</p>
        <button type="button" className="button button-primary mt-8" onClick={reset}>Tentar novamente</button>
      </div>
    </section>
  );
}
