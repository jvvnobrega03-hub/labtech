"use client";

import { type RefObject, useEffect, useRef } from "react";
import { gsap } from "gsap";

const OPENING_VIDEO_SRC = "/videos/labtech-logo-opening.mp4";
const SAFETY_FALLBACK_MS = 10_000;

type AuroraHeroOpeningProps = {
  stageRef: RefObject<HTMLElement | null>;
  onComplete: () => void;
};

export function AuroraHeroOpening({
  stageRef,
  onComplete,
}: AuroraHeroOpeningProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    const stage = stageRef.current;
    if (!root || !video || !stage) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const saveData = Boolean(connection?.saveData);
    let fallbackTimer: number | undefined;

    completedRef.current = false;

    const context = gsap.context(() => {
      const finishOpening = () => {
        if (completedRef.current) return;
        completedRef.current = true;
        if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);

        onComplete();
        gsap.to(root, {
          autoAlpha: 0,
          duration: 0.55,
          ease: "power2.inOut",
          pointerEvents: "none",
          onComplete: () => gsap.set(root, { display: "none" }),
        });
      };

      if (reducedMotion || saveData) {
        onComplete();
        gsap.set(root, { display: "none" });
        return;
      }

      const attemptPlayback = () => {
        if (video.error || video.ended || !video.paused) return;
        video.muted = true;
        void video.play().catch(() => {
          /* Um gesto posterior fará uma nova tentativa. */
        });
      };

      try {
        video.currentTime = 0;
      } catch {
        /* Começa no primeiro quadro disponível. */
      }

      video.addEventListener("ended", finishOpening);
      video.addEventListener("error", finishOpening);
      root.addEventListener("pointerdown", attemptPlayback, { passive: true });
      root.addEventListener("keydown", attemptPlayback);
      fallbackTimer = window.setTimeout(finishOpening, SAFETY_FALLBACK_MS);
      attemptPlayback();

      return () => {
        video.removeEventListener("ended", finishOpening);
        video.removeEventListener("error", finishOpening);
        root.removeEventListener("pointerdown", attemptPlayback);
        root.removeEventListener("keydown", attemptPlayback);
      };
    }, root);

    return () => {
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      context.revert();
    };
  }, [onComplete, stageRef]);

  return (
    <div
      ref={rootRef}
      className="aurora-hero-animations-4"
      role="status"
      aria-label="Apresentação da marca Labtech"
    >
      <div className="aurora-hero-animations-4__loader">
        <video
          ref={videoRef}
          className="aurora-hero-animations-4__video"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload nofullscreen noremoteplayback"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={OPENING_VIDEO_SRC} type="video/mp4" />
        </video>
      </div>

      <noscript>
        <style>{`.aurora-hero-animations-4{display:none}`}</style>
      </noscript>
    </div>
  );
}
