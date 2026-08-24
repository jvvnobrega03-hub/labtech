"use client";

import Image from "next/image";
import Link from "next/link";
import {
  createContext,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { BrandLogo } from "@/components/brand-logo";
import { CloseIcon } from "@/components/icons";
import { siteConfig } from "@/lib/config";

const DEFAULT_EASE = "power4.inOut";
const IMAGE_SCALES = [0.81, 0.84, 0.87, 0.9] as const;
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

type AuroraNavigationContextValue = {
  isOpen: boolean;
  openMenu: () => void;
};

const AuroraNavigationContext = createContext<AuroraNavigationContextValue | null>(null);

export function useAuroraNavigation() {
  const context = useContext(AuroraNavigationContext);
  if (!context) throw new Error("useAuroraNavigation deve ser usado dentro de AuroraNavigationShell.");
  return context;
}

function getHeroTarget(root: HTMLElement): HTMLElement | null {
  return root.querySelector<HTMLElement>(
    ".cinematic-hero, .page-hero, #conteudo > :first-child",
  );
}

export function AuroraNavigationShell({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuImageRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isOpenRef = useRef(false);
  const isTransitioningRef = useRef(false);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const preservedScrollRef = useRef(0);
  const rootStyleRef = useRef<Partial<CSSStyleDeclaration> | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const lockContainer = useCallback(() => {
    const root = rootRef.current;
    if (!root || rootStyleRef.current) return;

    preservedScrollRef.current = window.scrollY;
    rootStyleRef.current = {
      position: root.style.position,
      top: root.style.top,
      right: root.style.right,
      left: root.style.left,
      width: root.style.width,
    };
    root.style.position = "fixed";
    root.style.top = `${-preservedScrollRef.current}px`;
    root.style.right = "0";
    root.style.left = "0";
    root.style.width = "100%";
  }, []);

  const unlockContainer = useCallback(() => {
    const root = rootRef.current;
    const previous = rootStyleRef.current;
    if (!root || !previous) return;

    root.style.position = previous.position ?? "";
    root.style.top = previous.top ?? "";
    root.style.right = previous.right ?? "";
    root.style.left = previous.left ?? "";
    root.style.width = previous.width ?? "";
    rootStyleRef.current = null;
    window.scrollTo(0, preservedScrollRef.current);
  }, []);

  const closeMenu = useCallback(() => {
    const root = rootRef.current;
    const surface = surfaceRef.current;
    const menu = menuRef.current;
    if (!root || !surface || !menu || !isOpenRef.current || isTransitioningRef.current) return;

    const hero = getHeroTarget(root);
    const menuItems = menu.querySelector<HTMLElement>("[data-aurora-menu-items]");
    const menuLogo = menu.querySelector<HTMLElement>("[data-aurora-menu-logo]");
    const menuLinks = menu.querySelectorAll<HTMLElement>("[data-aurora-menu-link]");
    const menuSubItems = menu.querySelectorAll<HTMLElement>("[data-aurora-menu-sub-item]");
    const layeredImages = menu.querySelectorAll<HTMLElement>("[data-aurora-layer]:not([data-aurora-layer='1'])");

    isTransitioningRef.current = true;

    gsap.to(menu, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      pointerEvents: "none",
      duration: 1.25,
      ease: DEFAULT_EASE,
    });

    if (menuItems) {
      gsap.to(menuItems, {
        top: "-300px",
        opacity: 0,
        duration: 1.25,
        ease: DEFAULT_EASE,
      });
    }

    gsap.to(hero ?? surface, {
      top: "0%",
      opacity: 1,
      duration: 1.25,
      ease: DEFAULT_EASE,
      onComplete: () => {
        gsap.set(menu, {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        });
        if (menuLogo) gsap.set(menuLogo, { y: 50 });
        gsap.set(menuLinks, { y: 40 });
        gsap.set(menuSubItems, { y: 12 });
        if (menuItems) gsap.set(menuItems, { opacity: 1, top: "0px" });
        gsap.set(layeredImages, { top: "150%" });

        isOpenRef.current = false;
        isTransitioningRef.current = false;
        setIsOpen(false);
        menu.setAttribute("aria-hidden", "true");
        surface.inert = false;
        unlockContainer();

        const previousFocus = previousFocusRef.current;
        if (previousFocus?.isConnected) previousFocus.focus();
      },
    });
  }, [unlockContainer]);

  const openMenu = useCallback(() => {
    const root = rootRef.current;
    const surface = surfaceRef.current;
    const menu = menuRef.current;
    if (!root || !surface || !menu || isOpenRef.current || isTransitioningRef.current) return;

    const hero = getHeroTarget(root);
    const menuLogo = menu.querySelector<HTMLElement>("[data-aurora-menu-logo]");
    const menuLinks = menu.querySelectorAll<HTMLElement>("[data-aurora-menu-link]");
    const menuSubItems = menu.querySelectorAll<HTMLElement>("[data-aurora-menu-sub-item]");
    const layeredImages = menu.querySelectorAll<HTMLElement>("[data-aurora-layer]:not([data-aurora-layer='1'])");

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    isTransitioningRef.current = true;
    setIsOpen(true);
    menu.setAttribute("aria-hidden", "false");
    lockContainer();
    surface.inert = true;

    gsap.to(menu, {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
      pointerEvents: "all",
      duration: 1.25,
      ease: DEFAULT_EASE,
    });

    gsap.to(hero ?? surface, {
      top: "-50%",
      opacity: 0,
      duration: 1.25,
      ease: DEFAULT_EASE,
    });

    if (menuLogo) {
      gsap.to(menuLogo, {
        y: 0,
        duration: 1,
        delay: 0.75,
        ease: "power3.out",
      });
    }

    gsap.to(menuLinks, {
      y: 0,
      duration: 1,
      stagger: 0.075,
      delay: 1,
      ease: "power3.out",
    });

    gsap.to(menuSubItems, {
      y: 0,
      duration: 0.75,
      stagger: 0.05,
      delay: 1,
      ease: "power3.out",
    });

    gsap.to(layeredImages, {
      top: "50%",
      duration: 1.25,
      ease: DEFAULT_EASE,
      stagger: 0.1,
      delay: 0.25,
      onComplete: () => {
        gsap.set(hero ?? surface, { top: "50%" });
        isOpenRef.current = true;
        isTransitioningRef.current = false;
        closeButtonRef.current?.focus();
      },
    });
  }, [lockContainer]);

  useEffect(() => {
    const root = rootRef.current;
    const surface = surfaceRef.current;
    const menu = menuRef.current;
    const menuImage = menuImageRef.current;
    if (!root || !surface || !menu || !menuImage) return;
    const activeMenu = menu;

    const menuLogo = menu.querySelector<HTMLElement>("[data-aurora-menu-logo]");
    const menuLinks = menu.querySelectorAll<HTMLElement>("[data-aurora-menu-link]");
    const menuSubItems = menu.querySelectorAll<HTMLElement>("[data-aurora-menu-sub-item]");
    const images = menu.querySelectorAll<HTMLElement>("[data-aurora-layer]");
    const layeredImages = menu.querySelectorAll<HTMLElement>("[data-aurora-layer]:not([data-aurora-layer='1'])");
    let mouse = { x: 0, y: 0 };
    let cx = menu.clientWidth / 2;
    let cy = menu.clientHeight / 2;

    if (menuLogo) gsap.set(menuLogo, { y: 50 });
    gsap.set(menuLinks, { y: 40 });
    gsap.set(menuSubItems, { y: 12 });
    gsap.set(layeredImages, { top: "150%" });

    function update() {
      const dx = mouse.x - cx;
      const dy = mouse.y - cy;
      const tiltX = (dy / cy) * 20;
      const tiltY = (dx / cx) * 20;

      gsap.to(menuImage, {
        duration: 2,
        transform: `rotate3d(${tiltX}, ${tiltY}, 0, 15deg)`,
        ease: "power3.out",
      });

      images.forEach((image, index) => {
        const parallaxX = -(dx * (index + 1)) / 100;
        const parallaxY = -(dy * (index + 1)) / 100;
        const transform = `translate(calc(-50% + ${parallaxX}px), calc(-50% + ${parallaxY}px)) scale(${IMAGE_SCALES[index]})`;

        gsap.to(image, {
          duration: 2,
          transform,
          ease: "power3.out",
        });
      });
    }

    function handleMouseMove(event: MouseEvent) {
      if (!isOpenRef.current || !window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
      mouse = { x: event.clientX, y: event.clientY };
      update();
    }

    function handleResize() {
      cx = activeMenu.clientWidth / 2;
      cy = activeMenu.clientHeight / 2;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpenRef.current) {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !isOpenRef.current) return;
      const focusable = Array.from(activeMenu.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        .filter((element) => element.getClientRects().length > 0);
      if (focusable.length === 0) {
        event.preventDefault();
        activeMenu.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    root.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      root.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", handleKeyDown);
      gsap.killTweensOf([menu, menuImage, surface, ...images, menuLogo, ...menuLinks, ...menuSubItems].filter(Boolean));
      surface.inert = false;
      unlockContainer();
    };
  }, [closeMenu, unlockContainer]);

  const handleMenuLinkClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!isOpenRef.current) event.preventDefault();
    else closeMenu();
  };

  return (
    <AuroraNavigationContext.Provider value={{ isOpen, openMenu }}>
      <div ref={rootRef} className="aurora-navigation-menus-17">
        <div ref={surfaceRef} className="aurora-navigation-menus-17__surface">
          {children}
        </div>

        <div
          ref={menuRef}
          id="aurora-navigation-menu"
          className="aurora-navigation-menus-17__menu"
          role="dialog"
          aria-modal="true"
          aria-labelledby="aurora-navigation-title"
          aria-hidden={!isOpen}
          inert={!isOpen}
          tabIndex={-1}
        >
          <div className="aurora-navigation-menus-17__menu-nav">
            <p id="aurora-navigation-title" className="aurora-navigation-menus-17__menu-caption">
              Navegação principal
            </p>
            <button
              ref={closeButtonRef}
              type="button"
              className="aurora-navigation-menus-17__menu-close"
              onClick={closeMenu}
              aria-label="Fechar menu"
            >
              <span>Fechar</span>
              <CloseIcon />
            </button>
          </div>

          <div ref={menuImageRef} className="aurora-navigation-menus-17__menu-image" aria-hidden="true">
            {[1, 2, 3, 4].map((layer) => (
              <Image
                key={layer}
                data-aurora-layer={layer}
                className={`aurora-navigation-menus-17__image-layer aurora-navigation-menus-17__image-layer--${layer}`}
                src="/images/centrifuge-film-poster.webp"
                alt=""
                width={1920}
                height={1080}
                sizes="(max-width: 900px) 0px, 70vw"
              />
            ))}
            <div className="aurora-navigation-menus-17__image-shade" />
            <p className="aurora-navigation-menus-17__image-label">Precisão em movimento</p>
          </div>

          <div className="aurora-navigation-menus-17__menu-items" data-aurora-menu-items>
            <Link href="/" className="aurora-navigation-menus-17__menu-logo" onClick={handleMenuLinkClick}>
              <span data-aurora-menu-logo className="aurora-navigation-menus-17__menu-logo-inner">
                <BrandLogo
                  className="aurora-navigation-menus-17__menu-brand-image"
                  sizes="(max-width: 500px) 164px, 232px"
                />
              </span>
            </Link>

            <nav className="aurora-navigation-menus-17__menu-links" aria-label="Navegação expandida">
              {siteConfig.navigation.map((item, index) => (
                <div key={item.href} className="aurora-navigation-menus-17__menu-link-mask">
                  <p data-aurora-menu-link className="aurora-navigation-menus-17__menu-link">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <Link href={item.href} onClick={handleMenuLinkClick}>{item.label}</Link>
                  </p>
                </div>
              ))}
            </nav>

            <div className="aurora-navigation-menus-17__menu-footer">
              <div className="aurora-navigation-menus-17__menu-sub-column">
                <div className="aurora-navigation-menus-17__menu-sub-mask">
                  <p data-aurora-menu-sub-item>Atendimento especializado</p>
                </div>
                <div className="aurora-navigation-menus-17__menu-sub-mask">
                  <p data-aurora-menu-sub-item>Produtos laboratoriais</p>
                </div>
                <div className="aurora-navigation-menus-17__menu-sub-mask">
                  <p data-aurora-menu-sub-item>Produtos hospitalares</p>
                </div>
              </div>
              <div className="aurora-navigation-menus-17__menu-sub-column">
                <div className="aurora-navigation-menus-17__menu-sub-mask">
                  <p data-aurora-menu-sub-item><a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a></p>
                </div>
                <div className="aurora-navigation-menus-17__menu-sub-mask">
                  <p data-aurora-menu-sub-item><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p>
                </div>
                <div className="aurora-navigation-menus-17__menu-sub-mask">
                  <p data-aurora-menu-sub-item>
                    <a href={siteConfig.whatsapp} target="_blank" rel="noreferrer">WhatsApp comercial</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuroraNavigationContext.Provider>
  );
}
