document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  function setMenu(open) {
    if (!navToggle || !navMenu) return;
    navMenu.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-open", open);
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.contains("open");
      setMenu(!isOpen);
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });

    document.addEventListener("click", (e) => {
      if (!navMenu.classList.contains("open")) return;
      const inside = navMenu.contains(e.target) || navToggle.contains(e.target);
      if (!inside) setMenu(false);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const scrollTopBtn = document.getElementById("scroll-top");
  if (scrollTopBtn) {
    const toggleScrollButton = () => {
      if (window.scrollY > 320) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    };

    toggleScrollButton();
    window.addEventListener("scroll", toggleScrollButton);

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    });

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  const form = document.getElementById("contact-form");
  const card = document.getElementById("contact-card");
  const submitBtn = document.getElementById("submit-btn");

  if (form && card && submitBtn) {
    let isSubmitting = false;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (isSubmitting) return;
      isSubmitting = true;

      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.classList.add("loading");
      submitBtn.textContent = "Odesílám";

      try {
        const data = new FormData(form);
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: data
        });

        const result = await response.json();

        if (result.success) {
          card.innerHTML = `
            <div class="form-success">
              <h3>Děkuji, zpráva byla odeslána.</h3>
              <p style="margin:10px 0 0;color:#95a7c2;">
                Ozvu se co nejdříve, obvykle do dvou pracovních dnů.
              </p>
            </div>
          `;
        } else {
          throw new Error(result.message || "Odeslání se nezdařilo.");
        }
      } catch (error) {
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.classList.remove("loading");
        submitBtn.textContent = originalText;
        alert("Nepodařilo se odeslat formulář. Zkuste to prosím znovu.");
        console.error(error);
      }
    });
  }
});
