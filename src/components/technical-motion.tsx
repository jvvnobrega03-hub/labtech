"use client";

import { useEffect, useRef } from "react";
import "./technical-motion.css";

/** Enhances the existing section without adding a layout wrapper. */
export function TechnicalMotion({ footer = false }: { footer?: boolean }) {
  const decoration = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const surface = decoration.current?.parentElement;
    if (!surface || !("IntersectionObserver" in window)) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mouse = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    let visible = false;
    let tracking = false;
    let frame: number | undefined;
    let pointerX = 0;
    let pointerY = 0;

    const resetPointer = () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      delete surface.dataset.technicalPointer;
      surface.style.removeProperty("--technical-x");
      surface.style.removeProperty("--technical-y");
    };

    const movePointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (frame !== undefined) return;
      frame = requestAnimationFrame(() => {
        frame = undefined;
        const bounds = surface.getBoundingClientRect();
        const x = Math.max(0, Math.min(bounds.width, pointerX - bounds.left));
        const y = Math.max(0, Math.min(bounds.height, pointerY - bounds.top));
        surface.style.setProperty("--technical-x", `${((x / bounds.width - .5) * 12).toFixed(2)}px`);
        surface.style.setProperty("--technical-y", `${((y / bounds.height - .5) * 12).toFixed(2)}px`);
        decoration.current?.style.setProperty("--halo-x", `${x}px`);
        decoration.current?.style.setProperty("--halo-y", `${y}px`);
        surface.dataset.technicalPointer = "true";
      });
    };

    const sync = () => {
      const active = visible && !document.hidden && !reduced.matches;
      surface.dataset.technicalActive = String(active);
      const canTrack = active && !footer && mouse.matches && navigator.maxTouchPoints === 0;
      if (canTrack === tracking) return;
      tracking = canTrack;
      if (tracking) {
        surface.addEventListener("pointermove", movePointer, { passive: true });
        surface.addEventListener("pointerleave", resetPointer);
      } else {
        surface.removeEventListener("pointermove", movePointer);
        surface.removeEventListener("pointerleave", resetPointer);
        resetPointer();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(surface);
    reduced.addEventListener("change", sync);
    mouse.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      mouse.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      surface.removeEventListener("pointermove", movePointer);
      surface.removeEventListener("pointerleave", resetPointer);
      resetPointer();
      delete surface.dataset.technicalActive;
    };
  }, [footer]);

  return (
    <div ref={decoration} className="technical-decoration" aria-hidden="true">
      {footer ? <i className="technical-energy" /> : <>
        <i className="technical-halo" />
        <i className="technical-scanner" />
      </>}
    </div>
  );
}

/** The final, accessible value is present in server HTML; only its visual twin counts. */
export function TechnicalCounter({ value }: { value: number }) {
  const visual = useRef<HTMLElement>(null);
  const seen = useRef(false);

  useEffect(() => {
    const element = visual.current;
    if (!element || seen.current || !("IntersectionObserver" in window)) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | undefined;
    let stopped = false;

    const finish = () => {
      stopped = true;
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      element.textContent = String(value);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || document.hidden) return;
      seen.current = true;
      observer.disconnect();
      if (reduced.matches) return;

      stopped = false;
      element.textContent = "0";
      const count = () => {
        if (stopped) return;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / 1200, 1);
          const next = String(Math.round(value * (1 - (1 - progress) ** 3)));
          if (element.textContent !== next) element.textContent = next;
          if (progress < 1) frame = requestAnimationFrame(tick);
          else frame = undefined;
        };
        frame = requestAnimationFrame(tick);
      };
      // Let the auxiliary panel finish entering before starting its numbers.
      const entrance = element.closest("[data-technical-enter]")?.getAnimations() ?? [];
      if (entrance.length) void Promise.allSettled(entrance.map((animation) => animation.finished)).then(count);
      else count();
    }, { threshold: .6 });

    const onPreference = () => { if (reduced.matches) finish(); };
    const onVisibility = () => {
      if (document.hidden && seen.current) finish();
      else if (!document.hidden && !seen.current) {
        observer.unobserve(element);
        observer.observe(element);
      }
    };
    observer.observe(element);
    reduced.addEventListener("change", onPreference);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      finish();
      observer.disconnect();
      reduced.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [value]);

  return <><i ref={visual} className="technical-counter" aria-hidden="true">{value}</i><i className="sr-only">{value}</i></>;
}
