"use client";

import { useEffect } from "react";

export default function GeoCapture() {
  useEffect(() => {
    const key = "geo_captured";
    if (sessionStorage.getItem(key)) return;
    fetch("/api/me/geo", { method: "POST" }).catch(() => {});
    sessionStorage.setItem(key, "1");
  }, []);
  return null;
}
