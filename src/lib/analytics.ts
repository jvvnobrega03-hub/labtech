export type AnalyticsEventName =
  | "search_product"
  | "view_category"
  | "view_product"
  | "add_to_quote"
  | "remove_from_quote"
  | "begin_quote"
  | "submit_quote"
  | "quote_success"
  | "whatsapp_click"
  | "contact_submit";

export type AnalyticsEventData = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: AnalyticsEventName, data: AnalyticsEventData = {}): void {
  if (typeof window === "undefined") return;

  const detail = { name, data };
  window.dispatchEvent(new CustomEvent("labtech:analytics", { detail }));

  const analyticsWindow = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  analyticsWindow.dataLayer?.push({ event: name, ...data });
}
