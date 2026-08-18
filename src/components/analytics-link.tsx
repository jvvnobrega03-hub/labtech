"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics";

type AnalyticsLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: AnalyticsEventName;
  eventData?: Record<string, string | number | boolean | undefined>;
  children: ReactNode;
};

export function AnalyticsLink({ eventName, eventData, children, onClick, ...props }: AnalyticsLinkProps) {
  return <a {...props} onClick={(event) => { trackEvent(eventName, eventData); onClick?.(event); }}>{children}</a>;
}
