"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { BagIcon, CloseIcon, TrashIcon } from "@/components/icons";
import { useQuote } from "@/components/quote-context";
import { useModalDialog } from "@/components/use-modal-dialog";

export function QuoteDrawer() {
  const { isOpen, close, clear, items, removeItem, updateItem } = useQuote();
  const closeButton = useRef<HTMLButtonElement>(null);
  const dialogRef = useModalDialog({ isOpen, onClose: close, initialFocusRef: closeButton });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" tabIndex={-1} className="absolute inset-0 bg-deep/80 backdrop-blur-sm" onClick={close} aria-label="Fechar cotação" />
      <aside ref={dialogRef as React.RefObject<HTMLElement | null>} className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="drawer-title" tabIndex={-1}>
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div><p className="eyebrow">Seleção atual</p><h2 id="drawer-title" className="mt-1 text-2xl font-semibold text-ink">Minha cotação</h2></div>
          <button ref={closeButton} type="button" onClick={close} className="icon-button" aria-label="Fechar"><CloseIcon className="size-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="grid h-full place-content-center text-center"><BagIcon className="mx-auto size-10 text-slate-300" /><h3 className="mt-4 font-semibold">Nenhum item selecionado</h3><p className="mt-2 text-sm text-slate-500">Explore o catálogo para montar sua cotação.</p><Link href="/catalogo" onClick={close} className="button button-primary mt-6">Ver catálogo</Link></div>
          ) : (
            <>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.productId} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex gap-3">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-slate-100"><Image src={item.image} alt="" fill sizes="64px" className="object-cover" /></div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{item.name}</p>
                        {item.sku && <p className="mt-1 text-xs text-slate-500">Código {item.sku}</p>}
                        <label className="mt-2 block text-xs font-semibold">Quantidade<input className="input mt-1 w-24 py-2" type="number" min="1" max="999" value={item.quantity} onChange={(event) => updateItem(item.productId, { quantity: Number(event.target.value) || 1 })} /></label>
                      </div>
                      <button type="button" onClick={() => removeItem(item.productId)} className="self-start p-2 text-slate-400 hover:text-red-700" aria-label={`Remover ${item.name}`}><TrashIcon className="size-4" /></button>
                    </div>
                    <label className="mt-3 block text-xs font-semibold">Observações<textarea className="input mt-1 min-h-20 py-2 text-sm font-normal" maxLength={500} value={item.notes} onChange={(event) => updateItem(item.productId, { notes: event.target.value })} placeholder="Detalhes para este item" /></label>
                  </li>
                ))}
              </ul>
              <button type="button" className="mt-5 text-sm font-bold text-red-700" onClick={clear}>Limpar cotação</button>
            </>
          )}
        </div>
        {items.length > 0 && <div className="grid gap-2 border-t border-slate-200 p-5 sm:grid-cols-2"><Link href="/catalogo" onClick={close} className="button button-outline">Continuar navegando</Link><Link href="/orcamento" onClick={close} className="button button-primary">Solicitar orçamento</Link></div>}
      </aside>
    </div>
  );
}
