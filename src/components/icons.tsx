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
