"use client";

import Image from "next/image";
import { type RefObject, useEffect, useRef } from "react";
import { gsap } from "gsap";

const OPENING_LOGO_SRC = "/images/labtech-opening-logo-transparent.png";
const SAFETY_FALLBACK_MS = 6_000;

type AuroraHeroOpeningProps = {
  stageRef: RefObject<HTMLElement | null>;
};

export function AuroraHeroOpening({ stageRef }: AuroraHeroOpeningProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const halfTopRef = useRef<HTMLSpanElement>(null);
  const halfBottomRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const loader = loaderRef.current;
    const halfTop = halfTopRef.current;
    const halfBottom = halfBottomRef.current;
    const logo = logoRef.current;

    if (!root || !loader || !halfTop || !halfBottom || !logo) return;
    if (!stage) {
      gsap.set(root, { display: "none" });
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let fallbackTimer: number | undefined;

    const context = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(stage, { clearProps: "transform,willChange" });
        gsap.set(root, { display: "none" });
        return;
      }

      gsap.set(logo, { opacity: 0, letterSpacing: "0.3em" });
      gsap.set(stage, { scale: 1.15, willChange: "transform" });

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .to(logo, {
          opacity: 1,
          duration: 0.6,
          delay: 0.3,
        })
        .to(
          logo,
          {
            letterSpacing: "0.05em",
            duration: 0.7,
            ease: "power3.inOut",
          },
          "+=0.3",
        )
        .to(
          halfTop,
          {
            yPercent: -100,
            duration: 1.3,
            ease: "power3.inOut",
          },
          "+=0.2",
        )
        .to(
          halfBottom,
          {
            yPercent: 100,
            duration: 1.3,
            ease: "power3.inOut",
          },
          "<",
        )
        .to(
          logo,
          {
            opacity: 0,
            scale: 0.96,
            duration: 0.5,
            ease: "power2.in",
          },
          "<0.15",
        )
        .to(
          stage,
          {
            scale: 1,
            duration: 1.4,
            ease: "expo.out",
          },
          "<",
        )
        .set(loader, { display: "none" }, "+=0.05")
        .set(stage, { clearProps: "transform,willChange" })
        .set(root, { display: "none" })
        .call(() => {
          if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
        });

      fallbackTimer = window.setTimeout(() => {
        gsap.set(stage, { clearProps: "transform,willChange" });
        gsap.set(root, { display: "none" });
      }, SAFETY_FALLBACK_MS);
    }, root);

    return () => {
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      context.revert();
    };
  }, [stageRef]);

  return (
    <div ref={rootRef} className="aurora-hero-animations-4">
      <div
        ref={loaderRef}
        className="aurora-hero-animations-4__loader"
        aria-hidden="true"
      >
        <span
          ref={halfTopRef}
          className="aurora-hero-animations-4__half aurora-hero-animations-4__half--top"
        />
        <span
          ref={halfBottomRef}
          className="aurora-hero-animations-4__half aurora-hero-animations-4__half--bottom"
        />

        <div className="aurora-hero-animations-4__logo">
          <Image
            ref={logoRef}
            src={OPENING_LOGO_SRC}
            alt=""
            width={1898}
            height={829}
            sizes="(max-width: 600px) 92vw, (max-width: 1200px) 76vw, 980px"
            quality={90}
            preload
            draggable={false}
          />
        </div>
      </div>

      <noscript>
        <style>{`.aurora-hero-animations-4{display:none}`}</style>
      </noscript>
    </div>
  );
}
