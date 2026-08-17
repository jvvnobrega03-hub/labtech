"use client";

import { type ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function AdaptiveHeader({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;

    const hero = document.querySelector<HTMLElement>(".cinematic-hero");
    if (!hero || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setSolid(!entry.isIntersecting),
      { rootMargin: "0px 0px -82% 0px", threshold: 0 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  return <header className={`site-header${solid ? " site-header--solid" : ""}`}>{children}</header>;
}
