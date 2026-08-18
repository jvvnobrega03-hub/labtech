"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTOR = [
  "#conteudo [data-motion-reveal]",
  "#conteudo article",
  "#conteudo .product-card",
  "#conteudo .category-tile",
  "#conteudo form:not([role='search'])",
  "#conteudo .page-hero .shell > *",
  "#conteudo .prose-lab > *",
  "#conteudo section.shell > *",
  "#conteudo section > .shell > *",
  "#conteudo ul.grid > li",
  "#conteudo ul[class*='space-y-'] > li",
  "footer .shell > *",
].join(",");

const HOVER_SELECTOR = [
  "article:not(.prose-lab)",
  ".product-card",
  ".category-tile",
  "[data-motion-hover]",
].join(",");

const EXCLUDED_SELECTOR = [
  ".cinematic-hero",
  ".cinematic-loader",
  "[aria-hidden='true']",
  "[hidden]",
].join(",");

function isRenderable(element: HTMLElement) {
  if (!element.isConnected || element.closest(EXCLUDED_SELECTOR)) return false;

  const style = window.getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden") return false;

  const bounds = element.getBoundingClientRect();
  return bounds.width > 0 && bounds.height > 0;
}

function isAlreadyVisible(element: HTMLElement) {
  const bounds = element.getBoundingClientRect();
  return bounds.bottom > 0 && bounds.top < window.innerHeight;
}

function collectTargets() {
  const candidates = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR))
    .filter(isRenderable);
  const candidateSet = new Set(candidates);

  return candidates.filter((element) => {
    if (element.hasAttribute("data-motion-reveal")) return true;

    return !Array.from(element.querySelectorAll<HTMLElement>(REVEAL_SELECTOR))
      .some((descendant) => candidateSet.has(descendant));
  });
}

export function MotionSystem() {
  const pathname = usePathname();

  useEffect(() => {
    const content = document.querySelector<HTMLElement>("#conteudo");
    if (!content) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const processed = new WeakSet<HTMLElement>();
    let scheduledFrame: number | undefined;
    let hydrationFrame: number | undefined;
    let hydrationSafetyFrame: number | undefined;
    let started = false;

    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;
          element.dataset.motionAnimated = "true";
          element.dataset.motionState = "visible";
          element.dataset.motionSeen = "true";

          const finishReveal = () => {
            delete element.dataset.motionAnimated;
            element.removeEventListener("transitioncancel", finishReveal);
          };

          element.addEventListener("transitionend", finishReveal, { once: true });
          element.addEventListener("transitioncancel", finishReveal, { once: true });
          observer?.unobserve(element);
        });
      }, {
        root: null,
        rootMargin: "0px 0px 8% 0px",
        threshold: 0.08,
      })
      : null;

    const revealWithoutMotion = (element: HTMLElement) => {
      element.dataset.motionState = "visible";
      element.dataset.motionSeen = "true";
      delete element.dataset.motionAnimated;
      observer?.unobserve(element);
    };

    const prepareTargets = () => {
      const targets = collectTargets();
      const groups = new Map<HTMLElement, HTMLElement[]>();

      targets.forEach((element) => {
        const parent = element.parentElement;
        if (!parent) return;
        const group = groups.get(parent) ?? [];
        group.push(element);
        groups.set(parent, group);
      });

      targets.forEach((element) => {
        if (processed.has(element)) return;
        processed.add(element);

        element.dataset.motionReveal = "true";
        if (element.matches(HOVER_SELECTOR)) element.dataset.motionHover = "true";

        const group = element.parentElement ? groups.get(element.parentElement) ?? [] : [];
        const staggerIndex = Math.max(0, group.indexOf(element));
        element.style.setProperty("--motion-stagger", `${Math.min(staggerIndex, 7) * 55}ms`);

        if (element.dataset.motionSeen === "true" || reducedMotion.matches || !observer) {
          revealWithoutMotion(element);
          return;
        }

        if (isAlreadyVisible(element)) {
          revealWithoutMotion(element);
          return;
        }

        element.dataset.motionState = "pending";
        observer.observe(element);
      });
    };

    const schedulePreparation = () => {
      if (scheduledFrame !== undefined) return;
      scheduledFrame = window.requestAnimationFrame(() => {
        scheduledFrame = undefined;
        prepareTargets();
      });
    };

    const handleMotionPreference = () => {
      if (!reducedMotion.matches) return;
      document.querySelectorAll<HTMLElement>("[data-motion-state='pending']")
        .forEach(revealWithoutMotion);
      observer?.disconnect();
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      const pendingTarget = target?.closest<HTMLElement>("[data-motion-state='pending']");
      if (pendingTarget) revealWithoutMotion(pendingTarget);
    };

    const mutationObserver = new MutationObserver(schedulePreparation);

    const start = () => {
      if (started) return;
      started = true;
      hydrationFrame = window.requestAnimationFrame(() => {
        hydrationSafetyFrame = window.requestAnimationFrame(() => {
          prepareTargets();
          mutationObserver.observe(content, { childList: true, subtree: true });
          content.addEventListener("focusin", handleFocusIn);
          reducedMotion.addEventListener("change", handleMotionPreference);
        });
      });
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      if (scheduledFrame !== undefined) window.cancelAnimationFrame(scheduledFrame);
      if (hydrationFrame !== undefined) window.cancelAnimationFrame(hydrationFrame);
      if (hydrationSafetyFrame !== undefined) window.cancelAnimationFrame(hydrationSafetyFrame);
      window.removeEventListener("load", start);
      mutationObserver.disconnect();
      observer?.disconnect();
      content.removeEventListener("focusin", handleFocusIn);
      reducedMotion.removeEventListener("change", handleMotionPreference);
    };
  }, [pathname]);

  return null;
}
