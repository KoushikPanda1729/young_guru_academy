import { PolicyType } from "@/hooks/useAction";

export function slugToPolicyType(slug: string): PolicyType {
  const s = slug.trim().toLowerCase();

  if (["terms", "terms-of-service", "tos"].includes(s)) return "TERMS";
  if (["privacy", "privacy-policy", "data-privacy"].includes(s)) return "PRIVACY";
  if (["refund", "refund-policy", "returns"].includes(s)) return "REFUND";
  if (["cookie", "cookies", "cookie-policy"].includes(s)) return "COOKIE";

  return "OTHERS";
}
