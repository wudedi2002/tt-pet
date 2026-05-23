/* 宠物之家 · 通用脚本 */

function initCarousel(container, options = {}) {
  const { autoplay = true, interval = 5000 } = options;
  const track = container.querySelector(".carousel-track");
  const slides = container.querySelectorAll(".carousel-slide");
  const dotsContainer = container.querySelector(".carousel-dots");
  const prevBtn = container.querySelector(".carousel-prev");
  const nextBtn = container.querySelector(".carousel-next");

  if (!track || slides.length === 0) return;

  let current = 0;
  let timer = null;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    if (dotsContainer) {
      dotsContainer.querySelectorAll("button").forEach((dot, i) => {
        dot.classList.toggle("active", i === current);
      });
    }
  }

  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", `第 ${i + 1} 张`);
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        goTo(i);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  prevBtn?.addEventListener("click", () => {
    goTo(current - 1);
    resetAutoplay();
  });

  nextBtn?.addEventListener("click", () => {
    goTo(current + 1);
    resetAutoplay();
  });

  function startAutoplay() {
    if (!autoplay) return;
    timer = setInterval(() => goTo(current + 1), interval);
  }

  function resetAutoplay() {
    clearInterval(timer);
    startAutoplay();
  }

  container.addEventListener("mouseenter", () => clearInterval(timer));
  container.addEventListener("mouseleave", startAutoplay);

  startAutoplay();
}

function initHeader() {
  const header = document.querySelector(".site-header");
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 20);
  });

  menuBtn?.addEventListener("click", () => {
    navLinks?.classList.toggle("open");
  });
}

function initCareTabs() {
  const tabs = document.querySelectorAll(".care-tab");
  const panels = document.querySelectorAll(".care-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(target)?.classList.add("active");
    });
  });
}

function initShopCategories() {
  const buttons = document.querySelectorAll("[data-category]");
  const products = document.querySelectorAll(".product-card");
  const titleEl = document.querySelector(".shop-category-title");
  const countEl = document.querySelector(".shop-product-count");

  const categoryNames = {
    all: "全部商品",
    food: "宠物粮食",
    toy: "玩具娱乐",
    bed: "窝垫寝具",
    clean: "清洁护理",
    travel: "出行装备",
    health: "健康保健",
  };

  function filterCategory(cat) {
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.category === cat);
    });

    let visible = 0;
    products.forEach((card) => {
      const match = cat === "all" || card.dataset.category === cat;
      card.classList.toggle("hidden", !match);
      if (match) visible++;
    });

    if (titleEl) titleEl.textContent = categoryNames[cat] || "商品";
    if (countEl) countEl.textContent = `共 ${visible} 件`;
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => filterCategory(btn.dataset.category));
  });

  filterCategory("all");
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function initAddToCart() {
  document.querySelectorAll(".add-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const name = btn.closest(".product-card")?.querySelector("h4")?.textContent;
      showToast(name ? `已加入购物车：${name}` : "已加入购物车 🛒");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  document.querySelectorAll(".carousel").forEach((el) => initCarousel(el));
  initCareTabs();
  initShopCategories();
  initAddToCart();
});
