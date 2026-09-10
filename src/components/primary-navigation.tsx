"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNavigation } from "@/lib/config";

export function PrimaryNavigation() {
  const pathname = usePathname();

  return (
    <nav className="site-header__nav ml-auto hidden shrink-0 items-center gap-1 xl:flex" aria-label="Navegação principal">
      {primaryNavigation.map((item) => {
        const current = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current ? "page" : undefined}
            className={`site-header__nav-link${current ? " site-header__nav-link--active" : ""}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
