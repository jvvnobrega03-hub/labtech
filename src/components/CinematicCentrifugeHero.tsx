"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { AuroraHeroOpening } from "@/components/AuroraHeroOpening";

const INTRO_VIDEO_SRC = "/videos/centrifuge-film-intro.mp4";
const POSTER_SRC = "/images/centrifuge-film-poster.webp";
const INTRO_FALLBACK_MS = 12_000;
const CONTENT_REVEAL_LEAD_SECONDS = 0.06;

export function CinematicCentrifugeHero() {
  const rootRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderInterfaceRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const transitionStartedRef = useRef(false);
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const visual = visualRef.current;
    const introVideo = introVideoRef.current;
    if (!root || !visual || !introVideo) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const saveData = Boolean(connection?.saveData);
    const revealTargets = [
      eyebrowRef.current,
      headingRef.current,
      descriptionRef.current,
      ctasRef.current,
      trustRef.current,
    ].filter(Boolean) as HTMLElement[];
    let fallbackTimer: number | undefined;

    transitionStartedRef.current = false;

    const attemptPlayback = () => {
      if (introVideo.error || introVideo.ended || !introVideo.paused) return;
      introVideo.muted = true;
      void introVideo.play().catch(() => {
        /* Um gesto posterior fará uma nova tentativa. */
      });
    };

    const context = gsap.context(() => {
      const beginTransition = () => {
        if (transitionStartedRef.current) return;

        transitionStartedRef.current = true;
        if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);

        gsap
          .timeline({
            defaults: { overwrite: "auto" },
            onComplete: () => setIntroFinished(true),
          })
          .to(
            loaderInterfaceRef.current,
            {
              autoAlpha: 0,
              y: -12,
              duration: 0.3,
              ease: "power2.out",
            },
            0,
          )
          .to(
            flashRef.current,
            { opacity: 0.24, duration: 0.18, ease: "power2.out" },
            0.06,
          )
          .to(
            loaderRef.current,
            {
              autoAlpha: 0,
              pointerEvents: "none",
              duration: 0.46,
              ease: "power2.inOut",
            },
            0.24,
          )
          .to(
            flashRef.current,
            { opacity: 0, duration: 0.58, ease: "power2.out" },
            0.3,
          )
          .fromTo(
            eyebrowRef.current,
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" },
            0.55,
          )
          .fromTo(
            headingRef.current,
            { autoAlpha: 0, y: 38 },
            { autoAlpha: 1, y: 0, duration: 0.82, ease: "power4.out" },
            0.65,
          )
          .fromTo(
            descriptionRef.current,
            { autoAlpha: 0, y: 34 },
            { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" },
            0.82,
          )
          .fromTo(
            ctasRef.current,
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.66, ease: "power3.out" },
            0.96,
          )
          .fromTo(
            trustRef.current,
            { autoAlpha: 0, y: 26 },
            { autoAlpha: 1, y: 0, duration: 0.66, ease: "power3.out" },
            1.08,
          );
      };

      const updateIntro = () => {
        if (transitionStartedRef.current) return;
        const duration = introVideo.duration;
        if (!Number.isFinite(duration) || duration <= 0) return;

        const ratio = Math.min(
          1,
          Math.max(0, introVideo.currentTime / duration),
        );
        if (progressRef.current) {
          gsap.set(progressRef.current, {
            scaleX: ratio,
            transformOrigin: "left center",
          });
        }

        if (
          duration - introVideo.currentTime <= CONTENT_REVEAL_LEAD_SECONDS
        ) {
          beginTransition();
        }
      };

      const handleIntroError = () => {
        gsap.set(introVideo, { display: "none" });
        beginTransition();
      };

      if (reduceMotion.matches || saveData) {
        introVideo.pause();
        gsap.set(introVideo, { display: "none" });
        gsap.set(visual, {
          autoAlpha: 1,
          scale: 1,
          clearProps: "transform",
        });
        gsap.set(revealTargets, {
          autoAlpha: 1,
          y: 0,
          clearProps: "transform",
        });
        gsap.set(loaderRef.current, { display: "none" });
        setIntroFinished(true);
        return;
      }

      gsap.set(visual, { autoAlpha: 1 });
      gsap.set(introVideo, { autoAlpha: 1 });
      gsap.set(revealTargets, { autoAlpha: 0, y: 36 });
      gsap.fromTo(
        loaderInterfaceRef.current,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.82,
          delay: 0.15,
          ease: "power3.out",
        },
      );

      try {
        introVideo.currentTime = 0;
      } catch {
        /* Começa no primeiro frame disponível. */
      }
      void introVideo.play().catch(() => {
        /* A primeira interação tenta novamente. */
      });

      introVideo.addEventListener("timeupdate", updateIntro);
      introVideo.addEventListener("ended", beginTransition);
      introVideo.addEventListener("error", handleIntroError);
      root.addEventListener("pointerdown", attemptPlayback, { passive: true });
      root.addEventListener("keydown", attemptPlayback);
      fallbackTimer = window.setTimeout(beginTransition, INTRO_FALLBACK_MS);

      return () => {
        introVideo.removeEventListener("timeupdate", updateIntro);
        introVideo.removeEventListener("ended", beginTransition);
        introVideo.removeEventListener("error", handleIntroError);
        root.removeEventListener("pointerdown", attemptPlayback);
        root.removeEventListener("keydown", attemptPlayback);
      };
    }, root);

    return () => {
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      context.revert();
    };
  }, []);

  return (
    <>
      <AuroraHeroOpening stageRef={rootRef} />
      <section
        ref={rootRef}
        className="cinematic-hero"
        aria-label="Tecnologia laboratorial de alta precisão"
      >
        <div
          ref={visualRef}
          className="cinematic-hero__visual"
          aria-hidden="true"
        >
          <div className="cinematic-hero__fallback" />
          <video
            ref={introVideoRef}
            className="cinematic-hero__video cinematic-hero__video--intro"
            autoPlay
            muted
            playsInline
            preload="auto"
            poster={POSTER_SRC}
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload nofullscreen noremoteplayback"
            draggable={false}
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src={INTRO_VIDEO_SRC} type="video/mp4" />
          </video>
        </div>

        <div className="cinematic-hero__gradient" aria-hidden="true" />
        <div
          className="cinematic-hero__ambient cinematic-hero__ambient--one"
          aria-hidden="true"
        />
        <div
          className="cinematic-hero__ambient cinematic-hero__ambient--two"
          aria-hidden="true"
        />
        <div className="cinematic-hero__grid" aria-hidden="true" />
        <div className="cinematic-hero__grain" aria-hidden="true" />
        <div
          ref={flashRef}
          className="cinematic-hero__flash"
          aria-hidden="true"
        />

        <div className="cinematic-hero__content shell">
          <div className="cinematic-hero__copy">
            <p ref={eyebrowRef} className="cinematic-hero__eyebrow">
              <span aria-hidden="true" />
              Tecnologia para a saúde
            </p>
            <h1 ref={headingRef} className="cinematic-hero__title">
              Precisão que <span>transforma o futuro</span> da saúde.
            </h1>
            <p
              ref={descriptionRef}
              className="cinematic-hero__description"
            >
              Equipamentos e soluções hospitalares, laboratoriais e clínicas
              desenvolvidos para profissionais que não abrem mão de precisão,
              qualidade e confiança.
            </p>
            <div ref={ctasRef} className="cinematic-hero__actions">
              <a
                className="cinematic-button cinematic-button--primary"
                href="#produtos"
              >
                <span>Explorar produtos</span>
                <span className="cinematic-button__arrow" aria-hidden="true">
                  →
                </span>
              </a>
              <a
                className="cinematic-button cinematic-button--secondary"
                href="#contato"
              >
                Falar com especialista
              </a>
            </div>
            <div
              ref={trustRef}
              className="cinematic-hero__trust"
              aria-label="Diferenciais Labtech"
            >
              <div>
                <strong>Precisão</strong>
                <span>Tecnologia confiável</span>
              </div>
              <div>
                <strong>Qualidade</strong>
                <span>Soluções profissionais</span>
              </div>
              <div>
                <strong>Inovação</strong>
                <span>Saúde em evolução</span>
              </div>
            </div>
          </div>
        </div>

        <div className="cinematic-hero__scroll" aria-hidden="true">
          <span>Explore</span>
          <i>
            <b />
          </i>
        </div>

        {!introFinished && (
          <div
            ref={loaderRef}
            className="cinematic-loader"
            role="status"
            aria-live="polite"
            aria-label="Inicializando experiência Labtech"
          >
            <div className="cinematic-loader__vignette" aria-hidden="true" />
            <div className="cinematic-loader__scan" aria-hidden="true" />
            <div className="cinematic-loader__grain" aria-hidden="true" />
            <div
              ref={loaderInterfaceRef}
              className="cinematic-loader__interface"
            >
              <div className="cinematic-loader__status">
                <span aria-hidden="true" />
                SISTEMA LABORATORIAL
              </div>
              <div className="cinematic-loader__copy">
                <p>Inicializando experiência</p>
                <span>PRECISÃO / TECNOLOGIA / SAÚDE</span>
              </div>
            </div>
            <div className="cinematic-loader__progress" aria-hidden="true">
              <span ref={progressRef} />
            </div>
          </div>
        )}
      </section>
      <div className="cinematic-hero-transition" aria-hidden="true" />
    </>
  );
}

export default CinematicCentrifugeHero;
