document.addEventListener("DOMContentLoaded", () => {
  const fadeTargets = document.querySelectorAll(".fade-target");

  if (!("IntersectionObserver" in window)) {
    // Fallback: if browser doesn't support IO, just show them
    fadeTargets.forEach(el => el.classList.add("fade-in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          // If you only want it to animate once:
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.01 
    }
  );

  fadeTargets.forEach(el => observer.observe(el));
});