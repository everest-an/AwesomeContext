import geoip from "geoip-lite";

export function lookupGeo(ip: string): { country: string | null; city: string | null } {
  if (!ip || ip === "127.0.0.1" || ip === "::1") {
    return { country: null, city: null };
  }
  const geo = geoip.lookup(ip);
  if (!geo) return { country: null, city: null };
  return {
    country: geo.country || null,
    city: geo.city || null,
  };
}
