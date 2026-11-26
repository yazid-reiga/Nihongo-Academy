"use client";

import { useEffect } from "react";

export function ScrollToHash() {
  useEffect(() => {
    const scrollToHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest?.("a");
      const href = anchor?.getAttribute("href");
      if (!href?.startsWith("/#") || window.location.pathname !== "/") return;
      const target = document.getElementById(href.slice(2));
      if (!target) return;
      event.preventDefault();
      window.history.pushState(null, "", href);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const timer = window.setTimeout(scrollToHash, 150);
    window.addEventListener("hashchange", scrollToHash);
    document.addEventListener("click", onClick, true);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", scrollToHash);
      document.removeEventListener("click", onClick, true);
    };
  }, []);
  return null;
}
