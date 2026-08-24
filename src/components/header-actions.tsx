"use client";

import { useAuroraNavigation } from "@/components/aurora-navigation";
import { MenuIcon } from "@/components/icons";

export function HeaderActions() {
  const { isOpen: menuOpen, openMenu } = useAuroraNavigation();

  return (
    <div className="site-header__actions flex shrink-0 items-center gap-2">
      <button
        type="button"
        className="header-menu-button aurora-navigation-menus-17__menu-open inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[.05] px-3 text-white hover:border-mint/45 hover:bg-white/10"
        onClick={openMenu}
        aria-label="Abrir menu"
        aria-expanded={menuOpen}
        aria-controls="aurora-navigation-menu"
      >
        <MenuIcon className="size-6" />
        <span className="hidden text-xs font-extrabold sm:inline">Menu</span>
      </button>
    </div>
  );
}
