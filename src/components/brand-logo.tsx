import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  preload?: boolean;
  sizes: string;
};

/**
 * A única representação visual da marca utilizada pelo site.
 * O arquivo tem fundo transparente para funcionar igualmente sobre superfícies
 * claras e escuras sem criar uma caixa branca ao redor do logotipo.
 */
export function BrandLogo({ className, preload = false, sizes }: BrandLogoProps) {
  return (
    <span className={className}>
      <Image
        src="/images/labtech-brand-clean-v3.png"
        alt=""
        width={2087}
        height={753}
        className="brand-logo__image"
        sizes={sizes}
        quality={90}
        preload={preload}
      />
      <svg
        className="brand-logo__tagline"
        viewBox="0 0 1000 120"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <text
          x="0"
          y="91"
          textLength="1000"
          lengthAdjust="spacingAndGlyphs"
        >
          Produtos para laboratórios e hospitais
        </text>
      </svg>
    </span>
  );
}
