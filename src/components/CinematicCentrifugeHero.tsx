"use client";

import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { gsap } from "gsap";

const INTRO_FALLBACK_MS = 11_000;
const HERO_READY_GRACE_MS = 650;

export function CinematicCentrifugeHero() {
  const rootRef = useRef<HTMLElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderVideoRef = useRef<HTMLVideoElement>(null);
  const loaderInterfaceRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const heroVisualRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const transitionStartedRef = useRef(false);
  const finishRequestedRef = useRef(false);
  const heroReadyRef = useRef(false);
  const startTransitionRef = useRef<() => void>(() => undefined);
  const requestTransitionRef = useRef<() => void>(() => undefined);
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousOverscrollBehavior = body.style.overscrollBehavior;
    const preservedScrollY = window.scrollY;
    const temporarilyInert = Array.from(document.querySelectorAll<HTMLElement>(
      "body > .skip-link, body > header, body > footer, #conteudo > :not(.cinematic-hero)",
    )).filter((element) => !element.inert);
    let scrollLocked = true;
    let readinessTimer: number | undefined;
    let fallbackTimer: number | undefined;
    let media: ReturnType<typeof gsap.matchMedia> | undefined;

    transitionStartedRef.current = false;
    finishRequestedRef.current = false;
    heroReadyRef.current = (heroVideoRef.current?.readyState ?? 0) >= HTMLMediaElement.HAVE_CURRENT_DATA;

    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    body.classList.add("cinematic-intro-active");
    temporarilyInert.forEach((element) => {
      element.inert = true;
    });

    const unlockScroll = () => {
      if (!scrollLocked) return;
      scrollLocked = false;
      body.style.overflow = previousOverflow;
      body.style.overscrollBehavior = previousOverscrollBehavior;
      body.classList.remove("cinematic-intro-active");
      temporarilyInert.forEach((element) => {
        element.inert = false;
      });
      if (Math.abs(window.scrollY - preservedScrollY) > 1) {
        window.scrollTo(0, preservedScrollY);
      }
    };

    const context = gsap.context(() => {
      const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
      const revealTargets = [
        eyebrowRef.current,
        headingRef.current,
        descriptionRef.current,
        ctasRef.current,
        trustRef.current,
      ].filter(Boolean) as HTMLElement[];

      if (motionPreference.matches) {
        gsap.set(heroVisualRef.current, { autoAlpha: 1, scale: 1, clearProps: "transform" });
        gsap.set(revealTargets, { autoAlpha: 1, y: 0, clearProps: "transform" });
        heroVideoRef.current?.pause();
        unlockScroll();
        setIntroFinished(true);
        return;
      }

      gsap.set(heroVisualRef.current, { autoAlpha: 0, scale: 1.025 });
      gsap.set(revealTargets, { autoAlpha: 0, y: 36 });

      const startTransition = () => {
        if (transitionStartedRef.current) return;
        transitionStartedRef.current = true;
        if (readinessTimer !== undefined) window.clearTimeout(readinessTimer);
        if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);

        const heroVideo = heroVideoRef.current;
        if (heroVideo) {
          try {
            heroVideo.currentTime = 0;
          } catch {
            // Some browsers block seeking until metadata is available.
          }
          void heroVideo.play().catch(() => {
            gsap.set(heroVideo, { autoAlpha: 0 });
          });
        }

        const timeline = gsap.timeline({ defaults: { overwrite: "auto" } });
        timeline
          .to(loaderInterfaceRef.current, {
            autoAlpha: 0,
            y: -10,
            duration: 0.34,
            ease: "power2.out",
          }, 0)
          .to(flashRef.current, {
            opacity: 0.78,
            duration: 0.3,
            ease: "power2.out",
          }, 0.1)
          .to(heroVisualRef.current, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
          }, 0.15)
          .to(loaderVideoRef.current, {
            scale: 1.035,
            filter: "blur(5px)",
            duration: 0.85,
            ease: "power2.inOut",
          }, 0.28)
          .to(loaderRef.current, {
            autoAlpha: 0,
            pointerEvents: "none",
            duration: 0.72,
            ease: "power2.inOut",
            onComplete: () => {
              unlockScroll();
              setIntroFinished(true);
            },
          }, 0.3)
          .to(flashRef.current, {
            opacity: 0,
            duration: 0.65,
            ease: "power2.out",
          }, 0.42)
          .fromTo(eyebrowRef.current, {
            autoAlpha: 0,
            y: 30,
          }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.64,
            ease: "power3.out",
          }, 0.7)
          .fromTo(headingRef.current, {
            autoAlpha: 0,
            y: 38,
          }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.82,
            ease: "power4.out",
          }, 0.8)
          .fromTo(descriptionRef.current, {
            autoAlpha: 0,
            y: 34,
          }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          }, 0.96)
          .fromTo(ctasRef.current, {
            autoAlpha: 0,
            y: 30,
          }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.68,
            ease: "power3.out",
          }, 1.08)
          .fromTo(trustRef.current, {
            autoAlpha: 0,
            y: 26,
          }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.68,
            ease: "power3.out",
          }, 1.2);
      };

      const requestTransition = () => {
        if (transitionStartedRef.current || finishRequestedRef.current) return;
        finishRequestedRef.current = true;
        const heroVideo = heroVideoRef.current;

        if (heroReadyRef.current || (heroVideo?.readyState ?? 0) >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          startTransition();
          return;
        }

        readinessTimer = window.setTimeout(startTransition, HERO_READY_GRACE_MS);
      };

      startTransitionRef.current = startTransition;
      requestTransitionRef.current = requestTransition;

      const heroVideo = heroVideoRef.current;
      heroVideo?.load();

      const loaderPlayback = loaderVideoRef.current?.play();
      if (loaderPlayback) {
        void loaderPlayback.catch(requestTransition);
      }

      fallbackTimer = window.setTimeout(requestTransition, INTRO_FALLBACK_MS);

      media = gsap.matchMedia();
      media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const visual = heroVisualRef.current;
        if (!visual) return;

        const moveX = gsap.quickTo(visual, "x", { duration: 1.2, ease: "power3.out" });
        const moveY = gsap.quickTo(visual, "y", { duration: 1.2, ease: "power3.out" });
        const rotateX = gsap.quickTo(visual, "rotationX", { duration: 1.2, ease: "power3.out" });
        const rotateY = gsap.quickTo(visual, "rotationY", { duration: 1.2, ease: "power3.out" });

        const handlePointerMove = (event: PointerEvent) => {
          const bounds = root.getBoundingClientRect();
          const normalizedX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
          const normalizedY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
          moveX(normalizedX * 8);
          moveY(normalizedY * 6);
          rotateY(normalizedX * 2.2);
          rotateX(normalizedY * -1.4);
        };

        const resetDepth = () => {
          moveX(0);
          moveY(0);
          rotateX(0);
          rotateY(0);
        };

        root.addEventListener("pointermove", handlePointerMove, { passive: true });
        root.addEventListener("pointerleave", resetDepth);

        return () => {
          root.removeEventListener("pointermove", handlePointerMove);
          root.removeEventListener("pointerleave", resetDepth);
        };
      });
    }, root);

    return () => {
      if (readinessTimer !== undefined) window.clearTimeout(readinessTimer);
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      startTransitionRef.current = () => undefined;
      requestTransitionRef.current = () => undefined;
      media?.revert();
      context.revert();
      unlockScroll();
    };
  }, []);

  const updateProgress = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (!progressRef.current || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const progress = Math.min(1, Math.max(0, video.currentTime / video.duration));
    gsap.set(progressRef.current, { scaleX: progress, transformOrigin: "left center" });
  };

  const markHeroReady = () => {
    heroReadyRef.current = true;
    if (finishRequestedRef.current) startTransitionRef.current();
  };

  const handleHeroError = (event: SyntheticEvent<HTMLVideoElement>) => {
    heroReadyRef.current = true;
    gsap.set(event.currentTarget, { autoAlpha: 0 });
    if (finishRequestedRef.current) startTransitionRef.current();
  };

  return (
    <section ref={rootRef} className="cinematic-hero" aria-label="Tecnologia laboratorial de alta precisão">
      <div ref={heroVisualRef} className="cinematic-hero__visual" aria-hidden="true">
        <video
          ref={heroVideoRef}
          className="cinematic-hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/videos/centrifuge-poster.webp"
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={markHeroReady}
          onLoadedData={markHeroReady}
          onError={handleHeroError}
        >
          <source src="/videos/centrifuge-hero-loop.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="cinematic-hero__gradient" aria-hidden="true" />
      <div className="cinematic-hero__ambient cinematic-hero__ambient--one" aria-hidden="true" />
      <div className="cinematic-hero__ambient cinematic-hero__ambient--two" aria-hidden="true" />
      <div className="cinematic-hero__grid" aria-hidden="true" />
      <div className="cinematic-hero__grain" aria-hidden="true" />
      <div ref={flashRef} className="cinematic-hero__flash" aria-hidden="true" />

      <div className="cinematic-hero__content shell">
        <div className="cinematic-hero__copy">
          <p ref={eyebrowRef} className="cinematic-hero__eyebrow">
            <span aria-hidden="true" />
            Tecnologia para a saúde
          </p>
          <h1 ref={headingRef} className="cinematic-hero__title">
            Precisão que <span>transforma o futuro</span> da saúde.
          </h1>
          <p ref={descriptionRef} className="cinematic-hero__description">
            Equipamentos e soluções hospitalares, laboratoriais e clínicas desenvolvidos para profissionais que não abrem mão de precisão, qualidade e confiança.
          </p>
          <div ref={ctasRef} className="cinematic-hero__actions">
            <a className="cinematic-button cinematic-button--primary" href="#produtos" tabIndex={introFinished ? undefined : -1}>
              <span>Explorar produtos</span>
              <span className="cinematic-button__arrow" aria-hidden="true">→</span>
            </a>
            <a className="cinematic-button cinematic-button--secondary" href="#contato" tabIndex={introFinished ? undefined : -1}>
              Falar com especialista
            </a>
          </div>
          <div ref={trustRef} className="cinematic-hero__trust" aria-label="Diferenciais Labtech">
            <div><strong>Precisão</strong><span>Tecnologia confiável</span></div>
            <div><strong>Qualidade</strong><span>Soluções profissionais</span></div>
            <div><strong>Inovação</strong><span>Saúde em evolução</span></div>
          </div>
        </div>
      </div>

      <div className="cinematic-hero__scroll" aria-hidden="true">
        <span>Explore</span>
        <i><b /></i>
      </div>

      {!introFinished && (
        <div ref={loaderRef} className="cinematic-loader" role="status" aria-live="polite" aria-label="Inicializando experiência Labtech">
          <video
            ref={loaderVideoRef}
            className="cinematic-loader__video"
            autoPlay
            muted
            playsInline
            preload="auto"
            poster="/videos/centrifuge-poster.webp"
            aria-hidden="true"
            tabIndex={-1}
            onLoadedMetadata={updateProgress}
            onTimeUpdate={updateProgress}
            onEnded={() => requestTransitionRef.current()}
            onError={() => requestTransitionRef.current()}
          >
            <source src="/videos/centrifuge-loader.mp4" type="video/mp4" />
          </video>
          <div className="cinematic-loader__vignette" aria-hidden="true" />
          <div className="cinematic-loader__scan" aria-hidden="true" />
          <div className="cinematic-loader__grain" aria-hidden="true" />
          <div ref={loaderInterfaceRef} className="cinematic-loader__interface">
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
  );
}
