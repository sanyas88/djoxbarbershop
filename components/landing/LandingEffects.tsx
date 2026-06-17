"use client";

import { useEffect } from "react";

export function LandingEffects() {
  useEffect(() => {
    document.body.classList.add("reveal-on");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      document.body.classList.remove("reveal-on");
    };
  }, []);

  return null;
}
