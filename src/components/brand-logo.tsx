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
    <Image
      src="/images/labtech-brand-transparent.webp"
      alt=""
      width={1274}
      height={486}
      className={className}
      sizes={sizes}
      preload={preload}
    />
  );
}
