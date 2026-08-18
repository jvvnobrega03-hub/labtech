"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useAuroraNavigation } from "@/components/aurora-navigation";
import { BagIcon, MenuIcon } from "@/components/icons";
import { useQuote } from "@/components/quote-context";

export function HeaderActions(props: { mobileBrand?: ReactNode } = {}) {
  void props.mobileBrand;
  const { isOpen: menuOpen, openMenu } = useAuroraNavigation();
  const { itemCount, open } = useQuote();

  return (
    <div className="site-header__actions flex shrink-0 items-center gap-2">
      <Link href="/orcamento" className="header-request-button hidden h-11 items-center px-3 text-[.69rem] font-extrabold text-teal-800 transition hover:text-deep 2xl:inline-flex">
        Solicitar orçamento
      </Link>
      <button
        type="button"
        onClick={open}
        className="header-quote-button flex h-11 items-center gap-2 rounded-xl bg-navy px-3.5 text-white shadow-sm transition hover:bg-deep"
        aria-label={`Abrir orçamento com ${itemCount} itens`}
      >
        <BagIcon className="size-5" />
        <span className="hidden text-xs font-extrabold sm:inline">Minha cotação ({itemCount})</span>
      </button>
      <button
        type="button"
        className="header-menu-button aurora-navigation-menus-17__menu-open inline-flex h-11 items-center justify-center gap-2 rounded-xl px-3 text-ink"
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
