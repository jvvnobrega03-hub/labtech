import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ArrowIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M5 12h14M14 7l5 5-5 5" /></svg>;
}
export function FlaskIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M9 3h6M10 3v6l-5 8a2.5 2.5 0 0 0 2.1 4h9.8a2.5 2.5 0 0 0 2.1-4l-5-8V3M8 15h8" /></svg>;
}
export function MenuIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
}
export function CloseIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="m6 6 12 12M18 6 6 18" /></svg>;
}
export function BagIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M6 8h12l1 13H5L6 8ZM9 9V6a3 3 0 0 1 6 0v3" /></svg>;
}
export function SearchIcon(props: IconProps) {
  return <svg {...base} {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
}
export function CheckIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="m5 12 4 4L19 6" /></svg>;
}
export function ChevronIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="m9 18 6-6-6-6" /></svg>;
}
export function TrashIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" /></svg>;
}
export function PhoneIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M8 3 5 4.5c-.8.4-1.1 1.3-.8 2.2 2 5.9 6.7 10.6 12.6 12.6.9.3 1.8 0 2.2-.8l1.5-3-4.5-2-1.5 2c-2.6-1.2-4.8-3.4-6-6l2-1.5L8 3Z" /></svg>;
}
export function MailIcon(props: IconProps) {
  return <svg {...base} {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
}
export function ShieldIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M12 3 20 6v5c0 5-3.4 8.2-8 10-4.6-1.8-8-5-8-10V6l8-3Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></svg>;
}
export function SupportIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M5 13v-2a7 7 0 0 1 14 0v2M5 13H3v5h4v-5H5Zm14 0h2v5h-4v-5h2ZM17 18c0 2-2 3-5 3" /></svg>;
}
export function TruckIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M3 5h11v12H3zM14 9h4l3 4v4h-7V9ZM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /></svg>;
}
export function MicroscopeIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="m10 4 4 4M13 3l2 2-6 6-2-2 6-6ZM9 11a5 5 0 0 0 6 6M6 21h13M15 17v4M5 14h3" /></svg>;
}
export function TubesIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M6 3h5M7 3v10a4 4 0 0 0 8 0V3M14 3h5M15 3v5M7 11h8M4 21h16" /></svg>;
}
export function BoxIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="m4 7 8-4 8 4-8 4-8-4Zm0 0v10l8 4 8-4V7M12 11v10" /></svg>;
}
export function SparkIcon(props: IconProps) {
  return <svg {...base} {...props}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" /><circle cx="12" cy="12" r="3" /></svg>;
}
export function CategoryIcon({ slug, ...props }: IconProps & { slug: string }) {
  if (slug.includes("coleta") || slug.includes("reagentes")) return <TubesIcon {...props} />;
  if (slug.includes("microscopia")) return <MicroscopeIcon {...props} />;
  if (slug.includes("equipamentos") || slug.includes("diagnostico")) return <FlaskIcon {...props} />;
  if (slug.includes("biosseguranca") || slug.includes("hospitalares")) return <ShieldIcon {...props} />;
  if (slug.includes("armazenamento")) return <BoxIcon {...props} />;
  if (slug.includes("microbiologia") || slug.includes("hematologia")) return <SparkIcon {...props} />;
  return <FlaskIcon {...props} />;
}
