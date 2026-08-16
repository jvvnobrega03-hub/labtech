"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const INTRO_VIDEO_SRC = "/videos/centrifuge-intro.mp4";
const ROBOT_LOOP_MP4_SRC = "/videos/centrifuge-robot-loop.mp4";
const ROBOT_LOOP_WEBM_SRC = "/videos/centrifuge-robot-loop.webm";
const POSTER_SRC = "/images/centrifuge-poster.webp";
const INTRO_FALLBACK_MS = 9_000;
const CROSSFADE_LEAD_SECONDS = 0.48;

export function CinematicCentrifugeHero() {
  const rootRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const robotVideoRef = useRef<HTMLVideoElement>(null);
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
  const transitionRequestedRef = useRef(false);
  const robotReadyRef = useRef(false);
  const robotFailedRef = useRef(false);
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const visual = visualRef.current;
    const introVideo = introVideoRef.current;
    const robotVideo = robotVideoRef.current;
    if (!root || !visual || !introVideo || !robotVideo) return;

    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousOverscroll = body.style.overscrollBehavior;
    const preservedScrollY = window.scrollY;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const revealTargets = [eyebrowRef.current, headingRef.current, descriptionRef.current, ctasRef.current, trustRef.current].filter(Boolean) as HTMLElement[];
    const temporarilyInert = Array.from(document.querySelectorAll<HTMLElement>(
      "body > .skip-link, body > header, body > footer, #conteudo > :not(.cinematic-hero)",
    )).filter((element) => !element.inert);

    let scrollLocked = true;
    let fallbackTimer: number | undefined;
    let forcedTransitionTimer: number | undefined;
    let animationFrame: number | undefined;
    let media: ReturnType<typeof gsap.matchMedia> | undefined;

    transitionStartedRef.current = false;
    transitionRequestedRef.current = false;
    robotReadyRef.current = robotVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;
    robotFailedRef.current = false;

    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    body.classList.add("cinematic-intro-active");
    temporarilyInert.forEach((element) => { element.inert = true; });

    const unlockScroll = () => {
      if (!scrollLocked) return;
      scrollLocked = false;
      body.style.overflow = previousOverflow;
      body.style.overscrollBehavior = previousOverscroll;
      body.classList.remove("cinematic-intro-active");
      temporarilyInert.forEach((element) => { element.inert = false; });
      if (Math.abs(window.scrollY - preservedScrollY) > 1) window.scrollTo(0, preservedScrollY);
    };

    const attemptPlayback = () => {
      const target = transitionRequestedRef.current ? robotVideo : introVideo;
      if (target.error || !target.paused) return;
      target.muted = true;
      void target.play().catch(() => { /* Um gesto posterior fará uma nova tentativa. */ });
    };

    const context = gsap.context(() => {
      const startRobotLoop = () => {
        if (robotFailedRef.current) return;
        robotVideo.muted = true;
        try { robotVideo.currentTime = 0; } catch { /* Usa o primeiro frame decodificado. */ }
        void robotVideo.play().catch(() => { /* O poster permanece funcional. */ });
      };

      const beginTransition = (force = false) => {
        transitionRequestedRef.current = true;
        startRobotLoop();
        if (transitionStartedRef.current) return;
        if (!force && !robotReadyRef.current && !robotFailedRef.current) {
          if (forcedTransitionTimer === undefined) forcedTransitionTimer = window.setTimeout(() => beginTransition(true), 650);
          return;
        }

        transitionStartedRef.current = true;
        if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
        if (forcedTransitionTimer !== undefined) window.clearTimeout(forcedTransitionTimer);

        gsap.timeline({
          defaults: { overwrite: "auto" },
          onComplete: () => {
            introVideo.pause();
            unlockScroll();
            setIntroFinished(true);
          },
        })
          .to(loaderInterfaceRef.current, { autoAlpha: 0, y: -12, duration: 0.3, ease: "power2.out" }, 0)
          .to(flashRef.current, { opacity: 0.4, duration: 0.18, ease: "power2.out" }, 0.06)
          .to(robotVideo, { autoAlpha: robotFailedRef.current ? 0 : 1, duration: 0.46, ease: "power2.inOut" }, 0.1)
          .to(introVideo, { autoAlpha: 0, scale: 1.012, duration: 0.48, ease: "power2.inOut" }, 0.12)
          .to(loaderRef.current, { autoAlpha: 0, pointerEvents: "none", duration: 0.46, ease: "power2.inOut" }, 0.24)
          .to(flashRef.current, { opacity: 0, duration: 0.58, ease: "power2.out" }, 0.3)
          .fromTo(eyebrowRef.current, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.55)
          .fromTo(headingRef.current, { autoAlpha: 0, y: 38 }, { autoAlpha: 1, y: 0, duration: 0.82, ease: "power4.out" }, 0.65)
          .fromTo(descriptionRef.current, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.82)
          .fromTo(ctasRef.current, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.66, ease: "power3.out" }, 0.96)
          .fromTo(trustRef.current, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.66, ease: "power3.out" }, 1.08);
      };

      const updateIntro = () => {
        if (transitionStartedRef.current) return;
        const duration = introVideo.duration;
        if (!Number.isFinite(duration) || duration <= 0) return;
        const ratio = Math.min(1, Math.max(0, introVideo.currentTime / duration));
        if (progressRef.current) gsap.set(progressRef.current, { scaleX: ratio, transformOrigin: "left center" });
        if (duration - introVideo.currentTime <= CROSSFADE_LEAD_SECONDS) beginTransition();
      };

      const watchIntroFrames = () => {
        updateIntro();
        animationFrame = window.requestAnimationFrame(watchIntroFrames);
      };

      const handleRobotReady = () => {
        robotReadyRef.current = true;
        if (transitionRequestedRef.current) beginTransition();
      };
      const handleRobotError = () => {
        robotFailedRef.current = true;
        gsap.set(robotVideo, { autoAlpha: 0 });
        if (transitionRequestedRef.current) beginTransition(true);
      };
      const handleIntroError = () => beginTransition(true);

      if (reduceMotion.matches) {
        introVideo.pause();
        robotVideo.pause();
        gsap.set([introVideo, robotVideo], { display: "none" });
        gsap.set(visual, { autoAlpha: 1, scale: 1, clearProps: "transform" });
        gsap.set(revealTargets, { autoAlpha: 1, y: 0, clearProps: "transform" });
        gsap.set(loaderRef.current, { display: "none" });
        unlockScroll();
        setIntroFinished(true);
        return;
      }

      gsap.set(visual, { autoAlpha: 1, scale: 1.012 });
      gsap.set(introVideo, { autoAlpha: 1 });
      gsap.set(robotVideo, { autoAlpha: 0 });
      gsap.set(revealTargets, { autoAlpha: 0, y: 36 });
      gsap.fromTo(loaderInterfaceRef.current, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.82, delay: 0.15, ease: "power3.out" });

      try { introVideo.currentTime = 0; } catch { /* Começa no primeiro frame disponível. */ }
      void introVideo.play().catch(() => { /* A primeira interação tenta novamente. */ });

      introVideo.addEventListener("timeupdate", updateIntro);
      introVideo.addEventListener("ended", handleIntroError);
      introVideo.addEventListener("error", handleIntroError);
      robotVideo.addEventListener("loadeddata", handleRobotReady);
      robotVideo.addEventListener("canplay", handleRobotReady);
      robotVideo.addEventListener("error", handleRobotError);
      root.addEventListener("pointerdown", attemptPlayback, { passive: true });
      root.addEventListener("keydown", attemptPlayback);
      watchIntroFrames();
      fallbackTimer = window.setTimeout(() => beginTransition(true), INTRO_FALLBACK_MS);

      media = gsap.matchMedia();
      media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const moveX = gsap.quickTo(visual, "x", { duration: 1.2, ease: "power3.out" });
        const moveY = gsap.quickTo(visual, "y", { duration: 1.2, ease: "power3.out" });
        const rotateX = gsap.quickTo(visual, "rotationX", { duration: 1.2, ease: "power3.out" });
        const rotateY = gsap.quickTo(visual, "rotationY", { duration: 1.2, ease: "power3.out" });
        const handlePointerMove = (event: PointerEvent) => {
          const bounds = root.getBoundingClientRect();
          const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
          const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
          moveX(x * 8); moveY(y * 6); rotateY(x * 2.2); rotateX(y * -1.4);
        };
        const resetDepth = () => { moveX(0); moveY(0); rotateX(0); rotateY(0); };
        root.addEventListener("pointermove", handlePointerMove, { passive: true });
        root.addEventListener("pointerleave", resetDepth);
        return () => {
          root.removeEventListener("pointermove", handlePointerMove);
          root.removeEventListener("pointerleave", resetDepth);
        };
      });

      return () => {
        introVideo.removeEventListener("timeupdate", updateIntro);
        introVideo.removeEventListener("ended", handleIntroError);
        introVideo.removeEventListener("error", handleIntroError);
        robotVideo.removeEventListener("loadeddata", handleRobotReady);
        robotVideo.removeEventListener("canplay", handleRobotReady);
        robotVideo.removeEventListener("error", handleRobotError);
        root.removeEventListener("pointerdown", attemptPlayback);
        root.removeEventListener("keydown", attemptPlayback);
      };
    }, root);

    return () => {
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      if (forcedTransitionTimer !== undefined) window.clearTimeout(forcedTransitionTimer);
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame);
      media?.revert();
      context.revert();
      unlockScroll();
    };
  }, []);

  return (
    <section ref={rootRef} className="cinematic-hero" aria-label="Tecnologia laboratorial de alta precisão">
      <div ref={visualRef} className="cinematic-hero__visual" aria-hidden="true">
        <div className="cinematic-hero__fallback" />
        <video ref={introVideoRef} className="cinematic-hero__video cinematic-hero__video--intro" autoPlay muted playsInline preload="auto" poster={POSTER_SRC} aria-hidden="true" tabIndex={-1}>
          <source src={INTRO_VIDEO_SRC} type="video/mp4" />
        </video>
        <video ref={robotVideoRef} className="cinematic-hero__video cinematic-hero__video--robot" muted loop playsInline preload="auto" poster={POSTER_SRC} aria-hidden="true" tabIndex={-1}>
          <source src={ROBOT_LOOP_WEBM_SRC} type="video/webm" />
          <source src={ROBOT_LOOP_MP4_SRC} type="video/mp4" />
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
          <p ref={eyebrowRef} className="cinematic-hero__eyebrow"><span aria-hidden="true" />Tecnologia para a saúde</p>
          <h1 ref={headingRef} className="cinematic-hero__title">Precisão que <span>transforma o futuro</span> da saúde.</h1>
          <p ref={descriptionRef} className="cinematic-hero__description">Equipamentos e soluções hospitalares, laboratoriais e clínicas desenvolvidos para profissionais que não abrem mão de precisão, qualidade e confiança.</p>
          <div ref={ctasRef} className="cinematic-hero__actions">
            <a className="cinematic-button cinematic-button--primary" href="#produtos" tabIndex={introFinished ? undefined : -1}><span>Explorar produtos</span><span className="cinematic-button__arrow" aria-hidden="true">→</span></a>
            <a className="cinematic-button cinematic-button--secondary" href="#contato" tabIndex={introFinished ? undefined : -1}>Falar com especialista</a>
          </div>
          <div ref={trustRef} className="cinematic-hero__trust" aria-label="Diferenciais Labtech">
            <div><strong>Precisão</strong><span>Tecnologia confiável</span></div>
            <div><strong>Qualidade</strong><span>Soluções profissionais</span></div>
            <div><strong>Inovação</strong><span>Saúde em evolução</span></div>
          </div>
        </div>
      </div>

      <div className="cinematic-hero__scroll" aria-hidden="true"><span>Explore</span><i><b /></i></div>

      {!introFinished && (
        <div ref={loaderRef} className="cinematic-loader" role="status" aria-live="polite" aria-label="Inicializando experiência Labtech">
          <div className="cinematic-loader__vignette" aria-hidden="true" />
          <div className="cinematic-loader__scan" aria-hidden="true" />
          <div className="cinematic-loader__grain" aria-hidden="true" />
          <div ref={loaderInterfaceRef} className="cinematic-loader__interface">
            <div className="cinematic-loader__status"><span aria-hidden="true" />SISTEMA LABORATORIAL</div>
            <div className="cinematic-loader__copy"><p>Inicializando experiência</p><span>PRECISÃO / TECNOLOGIA / SAÚDE</span></div>
          </div>
          <div className="cinematic-loader__progress" aria-hidden="true"><span ref={progressRef} /></div>
        </div>
      )}
    </section>
  );
}

export default CinematicCentrifugeHero;
