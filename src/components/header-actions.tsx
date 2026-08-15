"use client";

import { type ReactNode, useCallback, useRef, useState } from "react";
import Link from "next/link";
import { BagIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { useQuote } from "@/components/quote-context";
import { useModalDialog } from "@/components/use-modal-dialog";
import { siteConfig } from "@/lib/config";

export function HeaderActions({ mobileBrand }: { mobileBrand: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuClose = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const dialogRef = useModalDialog({ isOpen: menuOpen, onClose: closeMenu, initialFocusRef: menuClose });
  const { itemCount, open } = useQuote();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={open}
        className="flex h-11 items-center gap-2 rounded-xl bg-navy px-3.5 text-white shadow-sm transition hover:bg-deep"
        aria-label={`Abrir orçamento com ${itemCount} itens`}
      >
        <BagIcon className="size-5" />
        <span className="hidden text-xs font-extrabold sm:inline">Orçamento ({itemCount})</span>
      </button>
      <button
        type="button"
        className="grid size-11 place-items-center text-ink xl:hidden"
        onClick={() => setMenuOpen(true)}
        aria-label="Abrir menu"
        aria-expanded={menuOpen}
        aria-controls="menu-movel"
      >
        <MenuIcon className="size-6" />
      </button>
      {menuOpen && (
        <div
          ref={dialogRef as React.RefObject<HTMLDivElement | null>}
          id="menu-movel"
          className="fixed inset-0 z-50 min-h-dvh bg-navy p-6 xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="menu-movel-titulo"
          tabIndex={-1}
        >
          <div className="flex items-center justify-between">
            {mobileBrand}
            <h2 id="menu-movel-titulo" className="sr-only">Menu principal</h2>
            <button ref={menuClose} type="button" onClick={closeMenu} className="grid size-11 place-items-center text-white" aria-label="Fechar menu">
              <CloseIcon className="size-7" />
            </button>
          </div>
          <nav className="mt-14 flex flex-col" aria-label="Navegação móvel">
            {siteConfig.navigation.map((item) => (
              <Link key={item.href} href={item.href} onClick={closeMenu} className="border-b border-white/10 py-4 text-xl font-medium text-white">
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                closeMenu();
                open();
              }}
              className="button button-accent mt-8"
            >
              Orçamento ({itemCount})
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
