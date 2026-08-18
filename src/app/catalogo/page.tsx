import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import styles from "./catalog-maintenance.module.css";

export const metadata: Metadata = {
  ...pageMetadata(
    "Catálogo em manutenção",
    "O catálogo digital da Labtech está temporariamente em atualização. Nossa equipe permanece disponível para atendimento e solicitações de orçamento.",
    "/catalogo",
  ),
  robots: {
    index: false,
    follow: true,
    noarchive: true,
  },
};

const serviceStatus = [
  { label: "Portal institucional", value: "Online", available: true },
  { label: "Catálogo de produtos", value: "Em atualização", available: false },
  { label: "Atendimento comercial", value: "Disponível", available: true },
] as const;

export default function CatalogMaintenancePage() {
  return (
    <section className={styles.maintenance} aria-labelledby="catalog-maintenance-title">
      <div className={styles.ambient} aria-hidden="true">
        <span className={styles.orbit} />
        <span className={styles.orbitInner} />
        <span className={styles.signal} />
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>
            <span className={styles.statusDot} aria-hidden="true" />
            Catálogo / Atualização
          </p>

          <h1 id="catalog-maintenance-title" className={styles.title}>
            Catálogo temporariamente em manutenção.
          </h1>

          <p className={styles.description}>
            Estamos preparando uma nova experiência para consulta de produtos e linhas
            Labtech. Durante este período, nossa equipe continua disponível para orientar
            solicitações e orçamentos.
          </p>

          <div className={styles.actions}>
            <Link className={styles.primaryAction} href="/contato">
              Falar com a equipe
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link className={styles.secondaryAction} href="/orcamento">
              Solicitar orçamento
            </Link>
          </div>

          <Link className={styles.backLink} href="/">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m14 6-6 6 6 6" />
            </svg>
            Voltar ao início
          </Link>
        </div>

        <aside className={styles.statusPanel} aria-label="Status dos serviços Labtech">
          <div className={styles.panelHeader}>
            <span>Status do sistema</span>
            <span className={styles.panelCode}>LT / 01</span>
          </div>

          <div className={styles.statusList}>
            {serviceStatus.map((item) => (
              <div className={styles.statusItem} key={item.label}>
                <span className={styles.statusIcon} data-available={item.available} aria-hidden="true" />
                <div>
                  <span className={styles.statusLabel}>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              </div>
            ))}
          </div>

          <p className={styles.panelNote}>
            O atendimento institucional e o envio de solicitações seguem funcionando normalmente.
          </p>
        </aside>
      </div>
    </section>
  );
}
