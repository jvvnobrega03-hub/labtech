"use client";

import Image from "next/image";
import { useState } from "react";

export function DeferredVideo({ src, poster, title }: { src: string; poster: string; title: string }) {
  const [active, setActive] = useState(false);

  return (
    <div className="deferred-video">
      {active ? (
        <video className="deferred-video__media" controls autoPlay muted playsInline preload="metadata" poster={poster} aria-label={title}>
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <>
          <Image src={poster} alt="Atendimento veterinário em ambiente clínico" fill sizes="(max-width: 1024px) 100vw, 48vw" className="object-cover" />
          <button type="button" className="deferred-video__button" onClick={() => setActive(true)} aria-label={`Reproduzir: ${title}`}>
            <span aria-hidden="true">▶</span>
            <strong>Assistir ao vídeo</strong>
          </button>
        </>
      )}
    </div>
  );
}
