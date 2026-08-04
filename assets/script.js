const WHATSAPP_NUMBER = "60129732778";

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const currentPage = document.body.dataset.page;
  const activeNav = document.querySelector(`[data-nav="${currentPage}"]`);
  if (activeNav) activeNav.classList.add("active");

  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "×" : "☰";
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      });
    });
  }

  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  const cards = [...document.querySelectorAll(".product-card")];
  const filterButtons = [...document.querySelectorAll(".filter-btn")];
  const searchInput = document.getElementById("productSearch");
  const noResults = document.getElementById("noResults");

  let activeCategory = "all";
  let searchTerm = "";

  const applyProductFilters = () => {
    let visibleCount = 0;

    cards.forEach((card) => {
      const category = card.dataset.category || "";
      const searchableText = `${card.dataset.name || ""} ${card.textContent}`.toLowerCase();
      const categoryMatch = activeCategory === "all" || category === activeCategory;
      const searchMatch = searchableText.includes(searchTerm);

      const shouldShow = categoryMatch && searchMatch;
      card.hidden = !shouldShow;
      if (shouldShow) visibleCount += 1;
    });

    if (noResults) {
      noResults.classList.toggle("show", visibleCount === 0);
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.filter || "all";
      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      applyProductFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchTerm = searchInput.value.trim().toLowerCase();
      applyProductFilters();
    });
  }

  const categoryFromUrl = new URLSearchParams(window.location.search).get("category");
  if (categoryFromUrl && cards.length) {
    const matchingButton = filterButtons.find(
      (button) => button.dataset.filter === categoryFromUrl
    );

    if (matchingButton) {
      activeCategory = categoryFromUrl;
      filterButtons.forEach((item) => item.classList.remove("active"));
      matchingButton.classList.add("active");
      applyProductFilters();
    }
  }

  document.querySelectorAll(".enquire-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const product = button.dataset.product || "a product";
      const message = `Hi FORTUNE 16, I would like to enquire about ${product}. Please share the price, packing quantity and stock availability.`;
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener"
      );
    });
  });

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("name")?.value.trim() || "";
      const company = document.getElementById("company")?.value.trim() || "-";
      const phone = document.getElementById("phone")?.value.trim() || "";
      const category = document.getElementById("category")?.value || "";
      const message = document.getElementById("message")?.value.trim() || "";

      const whatsappMessage = [
        "Hi FORTUNE 16, I would like to request a quotation.",
        "",
        `Name: ${name}`,
        `Company: ${company}`,
        `Phone: ${phone}`,
        `Category: ${category}`,
        `Products / Sizes: ${message}`,
      ].join("\n");

      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`,
        "_blank",
        "noopener"
      );
    });
  }
});
