/* Tiệm Bánh Phương Lý — interactions (Backend-connected) */

const API_BASE = 'http://localhost:3000';

/* ---------- State ---------- */
let PRODUCTS = [];
let cart = JSON.parse(localStorage.getItem("pl-cart") || "[]");
let activeFilter = "all";

/* ---------- DOM ---------- */
const productGrid = document.getElementById("productGrid");
const bestSellerGrid = document.getElementById("bestSellerGrid");
const pageViews = document.querySelectorAll(".page-view");
const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const toast = document.getElementById("toast");
const modalOverlay = document.getElementById("modalOverlay");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");
const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const orderForm = document.getElementById("orderForm");

const formatPrice = (n) =>
  Number(n).toLocaleString("vi-VN") + "đ";

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getProductImageUrl(product) {
  if (!product?.image) return "";
  if (/^https?:\/\//i.test(product.image)) return product.image;
  return `${API_BASE}${product.image.startsWith("/") ? "" : "/"}${product.image}`;
}

function getProductMediaMarkup(product, className = "product-image") {
  const imageUrl = getProductImageUrl(product);
  if (imageUrl) {
    return `<img class="${className}" src="${imageUrl}" alt="${escapeHtml(product.name || "Sản phẩm")}" />`;
  }
  return `<span class="emoji">${product?.emoji || "🍰"}</span>`;
}

function getCategoryLabel(product) {
  const slug = product?.cat || "";
  const map = {
    cream: "Kem tươi",
    birthday: "Sinh nhật",
    cupcake: "Cupcake",
    cookie: "Cookie",
    gift: "Quà tặng"
  };
  return map[slug] || "Bánh đặc biệt";
}

/* ---------- Load products from API ---------- */
async function loadProducts() {
  try {
    const res = await fetch(`${API_BASE}/api/products`);
    const data = await res.json();
    if (data && data.products) {
      PRODUCTS = data.products.map(p => ({
        id: p.product_id,
        name: p.name,
        desc: p.description || '',
        price: p.price,
        cat: p.category_slug || 'cream',
        emoji: p.emoji || '🍰',
        badge: p.badge || '',
        tags: p.tags || [],
        detail: p.detail || p.description || '',
        image: p.image || null
      }));
    }
  } catch (err) {
    console.warn('Không thể kết nối backend, dùng dữ liệu mẫu.', err);
    // Fallback data
    PRODUCTS = [
      { id: "strawberry-dream", name: "Strawberry Dream", desc: "Bánh kem dâu tươi, cốt bông lan mềm, kem cheese nhẹ — best-seller trên @lybi1993.", price: 350000, cat: "cream", emoji: "🍓", badge: "Best-seller", tags: ["Kem tươi", "Dâu", "18cm"], detail: "Lớp bông lan vanilla thrice-sifted, kem whipping + cream cheese, dâu tươi theo mùa." },
      { id: "chocolate-cloud", name: "Chocolate Cloud", desc: "Socola Bỉ đậm vị, mousse nhẹ như mây, phủ cacao và vàng lá.", price: 420000, cat: "cream", emoji: "🍫", badge: "Premium", tags: ["Socola Bỉ", "Mousse", "20cm"], detail: "Cốt chocolate moist, mousse dark chocolate 70%, ganache bóng." },
      { id: "sakura-bloom", name: "Sakura Bloom", desc: "Tone hồng sakura, hoa kem handmade, chữ custom theo yêu cầu.", price: 480000, cat: "birthday", emoji: "🌸", badge: "Custom", tags: ["Sinh nhật", "Hoa kem", "Custom"], detail: "Bánh sinh nhật thiết kế theo moodboard." },
      { id: "lemon-soft", name: "Lemon Soft Cake", desc: "Chanh vàng tươi, curd chua dịu, kem mascarpone thanh.", price: 320000, cat: "cream", emoji: "🍋", badge: "Fresh", tags: ["Chanh", "Thanh nhẹ", "16cm"], detail: "Không ngọt gắt — lemon curd nhà làm, cốt genoise." },
      { id: "cupcake-set", name: "Cupcake Set 6", desc: "Set 6 cupcake mix vị: vani, socola, dâu, matcha — hộp quà xinh.", price: 189000, cat: "cupcake", emoji: "🧁", badge: "Set quà", tags: ["6 cái", "Mix vị", "Hộp đẹp"], detail: "Lý tưởng làm quà, tiệc nhỏ, họp team." },
      { id: "cupcake-12", name: "Cupcake Party 12", desc: "12 cupcake đầy màu sắc — perfect cho birthday party & baby shower.", price: 320000, cat: "cupcake", emoji: "🎉", badge: "Party", tags: ["12 cái", "Party", "Theme"], detail: "Chọn theme: pastel, rainbow, animal, flower." },
      { id: "cookie-box", name: "Cookie Box Signature", desc: "Hộp 12 cookies: butter, matcha, chocolate chip, sablé hoa.", price: 165000, cat: "cookie", emoji: "🍪", badge: "Crunchy", tags: ["12 cái", "Mix", "Giòn"], detail: "Nướng mỗi sáng. Bảo quản 7 ngày." },
      { id: "gift-set-love", name: "Set Quà Ngọt Love", desc: "Mini cake + cookies + thiệp viết tay — gói nơ lụa pastel.", price: 399000, cat: "gift", emoji: "🎀", badge: "Gift", tags: ["Combo", "Thiệp", "Nơ lụa"], detail: "Combo perfect tặng crush / người thương." },
      { id: "two-tier-dream", name: "Two-Tier Dream", desc: "Bánh 2 tầng hoành tráng, decor hoa kem & cherry — event lớn.", price: 890000, cat: "birthday", emoji: "🎂", badge: "Luxury", tags: ["2 tầng", "Event", "Custom"], detail: "Đặt trước 2–3 ngày." }
    ];
  }
  renderProducts();
  renderBestSellerProducts();
}

/* ---------- Render products ---------- */
function renderProducts() {
  const list =
    activeFilter === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.cat === activeFilter);

  productGrid.innerHTML = list
    .map(
      (p) => `
    <article class="product-card" data-id="${p.id}" data-cat="${p.cat}">
      <div class="product-thumb">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
        ${getProductMediaMarkup(p)}
      </div>
      <div class="product-body">
        <div class="product-topline">
          <span class="product-category">${escapeHtml(getCategoryLabel(p))}</span>
        </div>
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.desc)}</p>
        <div class="product-tags">
          ${(p.tags || []).slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
        </div>
        <div class="product-meta">
          <div class="price-wrap">
            <span class="price">${formatPrice(p.price)}</span>
            <span class="meta-caption">Giao theo yêu cầu</span>
          </div>
          <div class="product-actions">
            <button class="view-btn" data-view="${p.id}">Chi tiết</button>
            <button class="add-btn" data-add="${p.id}">+ Thêm</button>
          </div>
        </div>
      </div>
    </article>
  `
    )
    .join("");

  if (!list.length) {
    productGrid.innerHTML = `
      <p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:3rem">
        Chưa có bánh trong danh mục này — thử “Tất cả” nhé!
      </p>`;
  }
}

function renderBestSellerProducts() {
  const bestSellers = PRODUCTS.filter(p => p.badge === 'Best-seller' || p.badge === 'Premium' || p.badge === 'Custom');
  const list = bestSellers.length > 0 ? bestSellers : PRODUCTS.slice(0, 4);

  bestSellerGrid.innerHTML = list
    .map(
      (p) => `
    <article class="product-card" data-id="${p.id}" data-cat="${p.cat}">
      <div class="product-thumb">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
        ${getProductMediaMarkup(p)}
      </div>
      <div class="product-body">
        <div class="product-topline">
          <span class="product-category">${escapeHtml(getCategoryLabel(p))}</span>
        </div>
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.desc)}</p>
        <div class="product-tags">
          ${(p.tags || []).slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
        </div>
        <div class="product-meta">
          <div class="price-wrap">
            <span class="price">${formatPrice(p.price)}</span>
            <span class="meta-caption">Giao theo yêu cầu</span>
          </div>
          <div class="product-actions">
            <button class="view-btn" data-view="${p.id}">Chi tiết</button>
            <button class="add-btn" data-add="${p.id}">+ Thêm</button>
          </div>
        </div>
      </div>
    </article>
  `
    )
    .join("");

  if (!list.length) {
    bestSellerGrid.innerHTML = `
      <p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:3rem">
        Chưa có sản phẩm Best Seller.
      </p>`;
  }
}

/* ---------- Cart ---------- */
function saveCart() {
  localStorage.setItem("pl-cart", JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  cartCount.textContent = count;

  const total = cart.reduce((s, i) => {
    const p = PRODUCTS.find((x) => x.id === i.id);
    return s + (p ? p.price * i.qty : 0);
  }, 0);
  cartTotal.textContent = formatPrice(total);

  if (!cart.length) {
    cartItems.innerHTML = `<div class="cart-empty">Giỏ còn trống — chọn bánh yêu thích nhé 🧁</div>`;
    return;
  }

  cartItems.innerHTML = cart
    .map((item) => {
      const p = PRODUCTS.find((x) => x.id === item.id);
      if (!p) return "";
      return `
      <div class="cart-item" data-id="${p.id}">
        <div class="cart-item-emoji">${getProductMediaMarkup(p, "cart-item-image")}</div>
        <div class="cart-item-info">
          <strong>${p.name}</strong>
          <span>${formatPrice(p.price)}</span>
        </div>
        <div class="qty-controls">
          <button data-dec="${p.id}" aria-label="Giảm">−</button>
          <span>${item.qty}</span>
          <button data-inc="${p.id}" aria-label="Tăng">+</button>
        </div>
        <button class="remove-item" data-remove="${p.id}" aria-label="Xóa">×</button>
      </div>`;
    })
    .join("");
}

function addToCart(id, qty = 1) {
  const existing = cart.find((i) => i.id === id);
  if (existing) existing.qty += qty;
  else cart.push({ id, qty });
  saveCart();
  const p = PRODUCTS.find((x) => x.id === id);
  showToast(`Đã thêm ${p?.emoji || ""} ${p?.name || "bánh"} vào giỏ`);
}

function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
  saveCart();
}

function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCart();
  showToast("Đã xóa khỏi giỏ");
}

function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* ---------- Modal ---------- */
function openModal(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  modalBody.innerHTML = `
    <div class="modal-layout">
      <div class="modal-hero">${getProductMediaMarkup(p, "modal-image")}</div>
      <div class="modal-content">
        <div class="modal-head">
          <span class="product-category">${escapeHtml(getCategoryLabel(p))}</span>
          ${p.badge ? `<span class="product-pill">${escapeHtml(p.badge)}</span>` : ""}
        </div>
        <h3>${escapeHtml(p.name)}</h3>
        <div class="modal-price-row">
          <span class="price">${formatPrice(p.price)}</span>
          <span class="meta-caption">Bánh handmade • giao theo yêu cầu</span>
        </div>
        <p>${escapeHtml(p.detail || p.desc)}</p>
        <div class="modal-tags">
          ${(p.tags || []).map((t) => `<span>${escapeHtml(t)}</span>`).join("")}
        </div>
        <button class="btn btn-primary full" data-add-modal="${p.id}">Thêm vào giỏ bánh</button>
      </div>
    </div>
  `;
  modalOverlay.classList.add("open");
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.classList.remove("open");
  modal.classList.remove("open");
  if (!cartDrawer.classList.contains("open")) {
    document.body.style.overflow = "";
  }
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ---------- Events ---------- */
document.querySelectorAll(".cat-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".cat-chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    activeFilter = chip.dataset.filter;
    renderProducts();
  });
});

productGrid.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  const view = e.target.closest("[data-view]");
  if (add) addToCart(add.dataset.add);
  if (view) openModal(view.dataset.view);
});

bestSellerGrid.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  const view = e.target.closest("[data-view]");
  if (add) addToCart(add.dataset.add);
  if (view) openModal(view.dataset.view);
});

cartItems.addEventListener("click", (e) => {
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  const rem = e.target.closest("[data-remove]");
  if (inc) changeQty(inc.dataset.inc, 1);
  if (dec) changeQty(dec.dataset.dec, -1);
  if (rem) removeFromCart(rem.dataset.remove);
});

modalBody.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add-modal]");
  if (btn) {
    addToCart(btn.dataset.addModal);
    closeModal();
  }
});

cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartDrawer);
cartOverlay.addEventListener("click", closeCartDrawer);
modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);

checkoutBtn.addEventListener("click", () => {
  closeCartDrawer();
  if (cart.length) {
    const names = cart
      .map((i) => {
        const p = PRODUCTS.find((x) => x.id === i.id);
        return p ? `${p.name} x${i.qty}` : "";
      })
      .filter(Boolean)
      .join(", ");
    const note = orderForm.querySelector('[name="note"]');
    if (note && !note.value) {
      note.value = `Đơn từ giỏ: ${names}`;
    }
    showToast("Điền form để hoàn tất đặt bánh ✨");
  }
});

/* Mobile nav */
/* Close any expanded dropdown/submenu. Without this, a leftover .submenu.open
   keeps visibility:visible even when #nav is hidden, blocking taps on content. */
function closeAllNavDropdowns() {
  document.querySelectorAll(".nav-dropdown.open").forEach((dropdown) => {
    dropdown.classList.remove("open");
    const submenu = dropdown.querySelector(".submenu");
    if (submenu) submenu.classList.remove("open");
  });
}

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
  menuToggle.classList.toggle("open");
  if (!nav.classList.contains("open")) {
    closeAllNavDropdowns();
  }
});

const logoLink = document.querySelector(".logo");
if (logoLink) {
  logoLink.addEventListener("click", (event) => {
    event.preventDefault();
    resetPageView();
    nav.classList.remove("open");
    menuToggle.classList.remove("open");
    closeAllNavDropdowns();
    window.history.replaceState(null, "", "#home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

nav.querySelectorAll(".nav-dropdown > .dropdown-toggle").forEach((toggle) => {
  toggle.addEventListener("click", (event) => {
    const isMobile = window.matchMedia("(max-width: 980px)").matches || nav.classList.contains("open");
    if (isMobile) {
      event.preventDefault();
      const dropdown = toggle.closest(".nav-dropdown");
      const submenu = dropdown.querySelector(".submenu");
      const isOpen = dropdown.classList.toggle("open");
      submenu?.classList.toggle("open", isOpen);
      document.querySelectorAll(".nav-dropdown").forEach((other) => {
        if (other !== dropdown) {
          other.classList.remove("open");
          other.querySelector(".submenu")?.classList.remove("open");
        }
      });
    }
  });
});

function resetPageView() {
  pageViews.forEach((section) => section.classList.remove("active"));
  document.body.classList.remove("page-view-open");
}

function showPageView(pageId) {
  const target = document.getElementById(pageId);
  if (!target) return;
  pageViews.forEach((section) => section.classList.toggle("active", section.id === pageId));
  document.body.classList.add("page-view-open");
  window.history.replaceState(null, "", `#${pageId}`);
  target.scrollIntoView({ behavior: "smooth" });
}

nav.querySelectorAll("a").forEach((a) => {
  if (a.classList.contains("dropdown-toggle")) return;
  a.addEventListener("click", (e) => {
    const page = a.dataset.page;
    if (page) {
      e.preventDefault();
      if (page === "home") {
        resetPageView();
      } else {
        showPageView(page);
      }
    } else {
      resetPageView();
    }
    nav.classList.remove("open");
    menuToggle.classList.remove("open");
    closeAllNavDropdowns();
  });
});

if (window.location.hash) {
  const hashPage = window.location.hash.replace("#", "");
  if (document.getElementById(hashPage)?.classList.contains("page-view")) {
    showPageView(hashPage);
  }
}

/* Header scroll */
window.addEventListener(
  "scroll",
  () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  },
  { passive: true }
);

/* Order form — submit to backend */
orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(orderForm);
  const name = data.get("name");
  const phone = data.get("phone");
  const type = data.get("type");
  const date = data.get("date");
  const note = data.get("note");

  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: name,
        customer_phone: phone,
        cake_type: type,
        delivery_date: date,
        note: note || ''
      })
    });

    const result = await res.json();

    if (res.ok) {
      showToast(`🎉 Cảm ơn ${name}! ${result.message}`);
      // Save order to localStorage history
      saveOrder({
        name,
        phone,
        cake_type: type,
        delivery_date: date,
        note: note || ''
      });
      orderForm.reset();
      // Clear cart after successful order
      cart = [];
      saveCart();
    } else {
      showToast(`❌ ${result.error || 'Đặt bánh thất bại. Vui lòng thử lại.'}`, 'error');
    }
  } catch (err) {
    // Fallback: demo mode
    showToast(`🎂 Cảm ơn ${name}! Đơn “${type}” đã được ghi nhận (offline mode)`);
    // Save order to localStorage history too
    saveOrder({
      name,
      phone,
      cake_type: type,
      delivery_date: date,
      note: note || ''
    });
    orderForm.reset();
  }
});

/* Set min date for order */
const dateInput = orderForm.querySelector('[name="date"]');
if (dateInput) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = tomorrow.toISOString().split("T")[0];
}

/* Keyboard */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeCartDrawer();
    closeModal();
    nav.classList.remove("open");
    closeAllNavDropdowns();
  }
});

/* ---------- Check order form & store map visibility ---------- */
/* Form đặt bánh và Bản đồ cửa hàng loại trừ lẫn nhau:
   - Form bật  → form hiện, map ẩn
   - Form tắt + map bật → form ẩn, map hiện
   - Form tắt + map tắt → form ẩn, map ẩn */
async function checkOrderFormVisibility() {
  try {
    const res = await fetch(`${API_BASE}/api/settings`);
    const data = await res.json();
    if (data && data.settings) {
      const formEnabled = data.settings.order_form_enabled === '1';
      const mapEnabled = data.settings.store_map_enabled === '1';
      const orderFormEl = document.getElementById('orderForm');
      const storeMapEl = document.getElementById('storeMap');
      const orderInfo = document.querySelector('.order-info');
      
      if (orderFormEl) {
        orderFormEl.style.display = formEnabled ? '' : 'none';
      }
      
      if (storeMapEl) {
        // Map chỉ hiện khi form ẨN và map được bật.
        // Lưu ý: CSS default `.store-map { display:none }` → phải gán 'block' khi hiện
        // (gán '' sẽ fallback về none, khiến bản đồ không bao giờ xuất hiện).
        const showMap = !formEnabled && mapEnabled;
        storeMapEl.style.display = showMap ? 'block' : 'none';
        storeMapEl.setAttribute('aria-hidden', showMap ? 'false' : 'true');
      }
      
      const p = orderInfo?.querySelector('p');
      if (p) {
        if (!formEnabled) {
          p.textContent = 'Hiện tại chưa nhận đơn qua form. Vui lòng inbox TikTok hoặc gọi hotline để đặt bánh.';
        } else {
          p.innerHTML = 'Điền form hoặc inbox TikTok <a href="https://www.tiktok.com/@lybi1993" target="_blank" rel="noopener noreferrer"><strong>@lybi1993</strong></a>. Bếp phản hồi trong 15–30 phút (giờ làm việc).';
        }
      }
    }
  } catch (err) {
    console.warn('Không thể kiểm tra cài đặt form, hiển thị mặc định.', err);
  }
}

/* ============================================
   MOBILE PROFESSIONAL INTERACTIONS
   Bottom Nav, Bottom Sheet, Swipe, Header Hide
   ============================================ */

/* --- Bottom Nav Elements --- */
const bottomNav = document.getElementById("bottomNav");
const bottomNavItems = bottomNav?.querySelectorAll(".bottom-nav-item");
const galleryGrid = document.getElementById("galleryGrid");
const galleryDots = document.querySelectorAll("#galleryScrollHint .dot");

const gallerySettingsConfig = [
  { key: 'gallery_item_1', titleKey: 'gallery_item_1_title', imageKey: 'gallery_item_1_image', fallbackTitle: 'Strawberry Dream', fallbackImage: 'image bakery/0e6f6c00138b92d5cb9a14.jpg' },
  { key: 'gallery_item_2', titleKey: 'gallery_item_2_title', imageKey: 'gallery_item_2_image', fallbackTitle: 'Chocolate Cloud', fallbackImage: 'image bakery/04b3dadba550240e7d4112.jpg' },
  { key: 'gallery_item_3', titleKey: 'gallery_item_3_title', imageKey: 'gallery_item_3_image', fallbackTitle: 'Lemon Soft', fallbackImage: 'image bakery/0eb241c13e4abf14e65b28.jpg' },
  { key: 'gallery_item_4', titleKey: 'gallery_item_4_title', imageKey: 'gallery_item_4_image', fallbackTitle: 'Sakura Bloom', fallbackImage: 'image bakery/1a41e2329db91ce745a827.jpg' },
  { key: 'gallery_item_5', titleKey: 'gallery_item_5_title', imageKey: 'gallery_item_5_image', fallbackTitle: 'Cookie Box', fallbackImage: 'image bakery/4f822ee35168d03689793.jpg' },
  { key: 'gallery_item_6', titleKey: 'gallery_item_6_title', imageKey: 'gallery_item_6_image', fallbackTitle: 'Gift Set', fallbackImage: 'image bakery/6c8c4efb3170b02ee96124.jpg' }
];

function applyGallerySettings(settings = {}) {
  const items = document.querySelectorAll('.g-item[data-gallery-key]');
  items.forEach((item, index) => {
    const cfg = gallerySettingsConfig[index];
    if (!cfg) return;

    const title = settings[cfg.titleKey] || cfg.fallbackTitle;
    const image = settings[cfg.imageKey] || cfg.fallbackImage;
    const img = item.querySelector('.g-image');
    const caption = item.querySelector('.g-fill figcaption');

    if (img) {
      img.src = image;
      img.alt = title;
    }
    if (caption) {
      caption.textContent = title;
    }
  });
}

async function loadGallerySettings() {
  try {
    const res = await fetch(`${API_BASE}/api/settings`);
    if (!res.ok) throw new Error('Không thể tải cấu hình gallery');
    const data = await res.json();
    applyGallerySettings(data.settings || {});
  } catch (err) {
    console.warn('Không tải được cấu hình gallery, dùng giá trị mặc định.', err);
    applyGallerySettings({});
  }
}

/* --- Orders data & rendering --- */
const ORDER_STATUS = {
  pending: { label: "Chờ xác nhận", cls: "status-pending", emoji: "🕐" },
  processing: { label: "Đang làm", cls: "status-processing", emoji: "👩‍🍳" },
  done: { label: "Đã giao", cls: "status-done", emoji: "✅" }
};

function loadOrders() {
  const ordersList = document.getElementById("ordersList");
  if (!ordersList) return;

  try {
    const orders = JSON.parse(localStorage.getItem("pl-orders") || "[]");
    if (!orders.length) {
      ordersList.innerHTML = `
        <div class="orders-empty">
          Chưa có đơn hàng nào 🧁<br />
          Đặt bánh và theo dõi lịch sử tại đây nhé!
        </div>`;
      return;
    }

    ordersList.innerHTML = orders
      .slice()
      .reverse()
      .map((o) => {
        const st = ORDER_STATUS[o.status] || ORDER_STATUS.pending;
        return `
        <article class="order-card">
          <div class="order-card-icon">${st.emoji}</div>
          <div class="order-card-info">
            <strong>#${o.id} — ${o.cake_type}</strong>
            <span>${o.name} · ${o.phone} · ${o.delivery_date}</span>
            ${o.note ? `<span>${o.note}</span>` : ""}
          </div>
          <span class="order-card-status ${st.cls}">${st.label}</span>
        </article>`;
      })
      .join("");
  } catch (err) {
    console.warn("Không đọc được đơn hàng.", err);
  }
}

function saveOrder(orderData) {
  let orders = [];
  try {
    orders = JSON.parse(localStorage.getItem("pl-orders") || "[]");
  } catch (err) {
    orders = [];
  }
  const id = Date.now().toString().slice(-6);
  orders.push({ id, status: "pending", ...orderData });
  localStorage.setItem("pl-orders", JSON.stringify(orders));
  return id;
}

/* updateCartUI — already defined above, no override needed */

/* --- Bottom Nav Tab Switching --- */
let activeBottomTab = "home"; // tracks current active tab for toggle-close

if (bottomNavItems) {
  bottomNavItems.forEach((item) => {
    item.addEventListener("click", () => {
      const tab = item.dataset.tab;

      // If the user taps the SAME tab again → toggle close (scroll back to top / collapse)
      if (tab === activeBottomTab) {
        // "close" behavior: scroll to top for sections, or collapse page-view
        if (tab === "orders") {
          resetPageView();
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
        bottomNavItems.forEach((i) => i.classList.toggle("active", i.dataset.tab === "home"));
        activeBottomTab = "home";
        nav.classList.remove("open");
        menuToggle.classList.remove("open");
        closeAllNavDropdowns();
        return;
      }

      activeBottomTab = tab;

      // Set active state
      bottomNavItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");

      // Scroll to section or reset / show page view
      if (tab === "home") {
        resetPageView();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (tab === "tiktok") {
        resetPageView();
        const section = document.getElementById("tiktok");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      } else if (tab === "orders") {
        showPageView("orders");
        loadOrders();
      } else {
        const section = document.getElementById(tab);
        if (section) {
          resetPageView();
          section.scrollIntoView({ behavior: "smooth" });
        }
      }

      // Close mobile nav overlay if open
      nav.classList.remove("open");
      menuToggle.classList.remove("open");
      closeAllNavDropdowns();
    });
  });
}

/* --- Highlight active bottom nav tab on scroll --- */
function updateActiveBottomTab() {
  if (!bottomNavItems || window.innerWidth > 768) return;

  const sections = [
    { id: "home", tab: "home" },
    { id: "order", tab: "order" },
    { id: "tiktok", tab: "tiktok" }
  ];

  let activeTab = "home";
  const scrollPos = window.scrollY + window.innerHeight / 3;

  for (const s of sections) {
    const el = document.getElementById(s.id);
    if (el && el.offsetTop <= scrollPos) {
      activeTab = s.tab;
    }
  }

  bottomNavItems.forEach((i) => {
    const tab = i.dataset.tab;
    if (tab !== "orders") {
      i.classList.toggle("active", tab === activeTab);
    }
  });
}

window.addEventListener("scroll", updateActiveBottomTab, { passive: true });

/* --- Header Auto-Hide on Scroll Direction --- */
let headerScrollLastY = 0;
let headerScrollThreshold = 60;

function handleHeaderAutoHide() {
  if (window.innerWidth > 768) {
    header.classList.remove("header-hidden");
    return;
  }

  const currentY = window.scrollY;
  const diff = currentY - headerScrollLastY;

  if (Math.abs(diff) > 10) {
    if (diff > 0 && currentY > headerScrollThreshold) {
      header.classList.add("header-hidden");
    } else if (diff < 0) {
      header.classList.remove("header-hidden");
    }
  }

  headerScrollLastY = currentY;
}

window.addEventListener("scroll", handleHeaderAutoHide, { passive: true });

/* --- Bottom Sheet Cart Drag-to-Close --- */
const cartDragHandle = document.getElementById("cartDragHandle");
let dragStartY = 0;
let dragCurrentY = 0;
let isDragging = false;

if (cartDragHandle) {
  cartDragHandle.addEventListener("touchstart", (e) => {
    if (!cartDrawer.classList.contains("open")) return;
    dragStartY = e.touches[0].clientY;
    isDragging = true;
    cartDrawer.style.transition = "none";
  }, { passive: true });

  cartDragHandle.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    dragCurrentY = e.touches[0].clientY;
    const delta = dragCurrentY - dragStartY;
    if (delta > 0) {
      cartDrawer.style.transform = `translateY(${delta}px)`;
      cartOverlay.style.opacity = Math.max(0, 1 - delta / 300);
    }
  }, { passive: true });

  cartDragHandle.addEventListener("touchend", () => {
    if (!isDragging) return;
    isDragging = false;
    cartDrawer.style.transition = "";

    const delta = dragCurrentY - dragStartY;
    if (delta > 80) {
      closeCartDrawer();
    } else {
      cartDrawer.style.transform = "";
      cartOverlay.style.opacity = "";
    }
    dragStartY = 0;
    dragCurrentY = 0;
  }, { passive: true });
}

/* --- Override openCart/closeCartDrawer for bottom sheet body class --- */
const originalOpenCart = openCart;
openCart = function() {
  originalOpenCart();
  document.body.classList.add("bottom-sheet-open");
};

const originalCloseCartDrawer = closeCartDrawer;
closeCartDrawer = function() {
  originalCloseCartDrawer();
  document.body.classList.remove("bottom-sheet-open");
};

/* --- Gallery Swipe Hint Dots --- */
function updateGalleryDots() {
  if (!galleryGrid || !galleryDots.length || window.innerWidth > 768) return;

  const scrollLeft = galleryGrid.scrollLeft;
  const itemWidth = galleryGrid.querySelector(".g-item")?.offsetWidth || 1;
  const gap = 12; // approximate gap
  const activeIndex = Math.round(scrollLeft / (itemWidth + gap));

  galleryDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === activeIndex);
  });
}

if (galleryGrid) {
  galleryGrid.addEventListener("scroll", updateGalleryDots, { passive: true });
}

/* --- Hero Carousel (mobile only) --- */
const carouselTrack = document.getElementById("carouselTrack");
const carouselDots = document.getElementById("carouselDots");
const carouselPrev = document.getElementById("carouselPrev");
const carouselNext = document.getElementById("carouselNext");
let carouselIndex = 0;
let carouselSlides = [];
let carouselInterval = null;
const CAROUSEL_INTERVAL_MS = 3000;

function initCarousel() {
  if (!carouselTrack || window.innerWidth > 768) return;

  carouselSlides = carouselTrack.querySelectorAll(".carousel-slide");
  if (!carouselSlides.length) return;

  // Create dots
  if (carouselDots) {
    carouselDots.innerHTML = "";
    carouselSlides.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.addEventListener("click", () => goToSlide(i));
      carouselDots.appendChild(dot);
    });
  }

  goToSlide(0);
  startCarouselAutoPlay();
}

function goToSlide(index) {
  if (!carouselTrack) return;
  const total = carouselSlides.length || carouselTrack.querySelectorAll(".carousel-slide").length;
  if (!total) return;

  carouselIndex = (index + total) % total;
  carouselTrack.style.transform = `translateX(-${carouselIndex * 100}%)`;

  // Update dots
  if (carouselDots) {
    const dots = carouselDots.querySelectorAll("span");
    dots.forEach((dot, i) => dot.classList.toggle("active", i === carouselIndex));
  }
}

function nextSlide() {
  goToSlide(carouselIndex + 1);
  resetCarouselAutoPlay();
}

function prevSlide() {
  goToSlide(carouselIndex - 1);
  resetCarouselAutoPlay();
}

function startCarouselAutoPlay() {
  stopCarouselAutoPlay();
  if (window.innerWidth <= 768) {
    carouselInterval = setInterval(nextSlide, CAROUSEL_INTERVAL_MS);
  }
}

function stopCarouselAutoPlay() {
  if (carouselInterval) {
    clearInterval(carouselInterval);
    carouselInterval = null;
  }
}

function resetCarouselAutoPlay() {
  stopCarouselAutoPlay();
  startCarouselAutoPlay();
}

if (carouselPrev) {
  carouselPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    prevSlide();
  });
}

if (carouselNext) {
  carouselNext.addEventListener("click", (e) => {
    e.stopPropagation();
    nextSlide();
  });
}

// Touch swipe for carousel
let carouselTouchStartX = 0;
let carouselTouchEndX = 0;

const heroCarousel = document.getElementById("heroCarousel");
if (heroCarousel) {
  heroCarousel.addEventListener("touchstart", (e) => {
    carouselTouchStartX = e.changedTouches[0].screenX;
    stopCarouselAutoPlay();
  }, { passive: true });

  heroCarousel.addEventListener("touchend", (e) => {
    carouselTouchEndX = e.changedTouches[0].screenX;
    const diff = carouselTouchStartX - carouselTouchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    } else {
      startCarouselAutoPlay();
    }
  }, { passive: true });
}

// Re-init carousel on resize
window.addEventListener("resize", () => {
  if (window.innerWidth <= 768) {
    initCarousel();
  } else {
    stopCarouselAutoPlay();
  }
});

/* --- Keyboard Handling for Mobile Forms --- */
const formInputs = orderForm?.querySelectorAll("input, select, textarea");
if (formInputs) {
  formInputs.forEach((input) => {
    input.addEventListener("focus", () => {
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          input.scrollIntoView({ behavior: "smooth", block: "center" });
          orderForm.classList.add("keyboard-open");
        }, 300);
      }
    });

    input.addEventListener("blur", () => {
      orderForm.classList.remove("keyboard-open");
    });
  });
}

/* --- Pull-to-refresh prevention for Android WebView --- */
let touchStartY = 0;
document.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener("touchmove", (e) => {
  if (window.scrollY === 0 && e.touches[0].clientY > touchStartY) {
    e.preventDefault();
  }
}, { passive: false });

/* --- No cart badge override needed for bottom nav (cart tab removed) --- */

/* ============================================
   ALBUM "BẾP NHỎ ĐẦY YÊU THƯƠNG" — 28 ảnh
   Fullscreen lightbox gallery with swipe
   ============================================ */

const BAKERY_ALBUM_IMAGES = [
  "image bakery/0e6f6c00138b92d5cb9a14.jpg",
  "image bakery/0e8990feef756e2b376425.jpg",
  "image bakery/0eb241c13e4abf14e65b28.jpg",
  "image bakery/1a41e2329db91ce745a827.jpg",
  "image bakery/04b3dadba550240e7d4112.jpg",
  "image bakery/4f822ee35168d03689793.jpg",
  "image bakery/6c8c4efb3170b02ee96124.jpg",
  "image bakery/7c66ef10909b11c5488a23.jpg",
  "image bakery/8d538225fdae7cf025bf21.jpg",
  "image bakery/9c9d29f5567ed7208e6f13.jpg",
  "image bakery/13f54a81350ab454ed1b18.jpg",
  "image bakery/16e002957d1efc40a50f20.jpg",
  "image bakery/46c674a90b228a7cd33315.jpg",
  "image bakery/73c087a1f82a7974203b2.jpg",
  "image bakery/0435d543aac82b9672d922.jpg",
  "image bakery/506af807878c06d25f9d7.jpg",
  "image bakery/912b74460bcd8a93d3dc8.jpg",
  "image bakery/a3b10cd0735bf205ab4a1.jpg",
  "image bakery/ad9af2ec8d670c39557626.jpg",
  "image bakery/afe200807f0bfe55a71a4.jpg",
  "image bakery/b0fdd790a81b2945700a11.jpg",
  "image bakery/b333025c7dd7fc89a5c616.jpg",
  "image bakery/b206466839e3b8bde1f210.jpg",
  "image bakery/d9b90edb7150f00ea9415.jpg",
  "image bakery/e045ef2b90a011fe48b117.jpg",
  "image bakery/e108a164deef5fb106fe6.jpg",
  "image bakery/eef8228d5d06dc58851719.jpg",
  "image bakery/menu1.jpg"
];

const albumLightbox = document.getElementById("albumLightbox");
const albumLbTrack = document.getElementById("albumLbTrack");
const albumLbThumbs = document.getElementById("albumLbThumbs");
const albumLbCounter = document.getElementById("albumLbCounter");
const albumLbClose = document.getElementById("albumLbClose");
const albumLbPrev = document.getElementById("albumLbPrev");
const albumLbNext = document.getElementById("albumLbNext");
const bakeryAlbum = document.getElementById("bakeryAlbum");

let albumIndex = 0;

/* Build slides + thumbnails */
function buildAlbumGallery() {
  if (!albumLbTrack || !albumLbThumbs) return;

  albumLbTrack.innerHTML = BAKERY_ALBUM_IMAGES.map(
    (src, i) => `
    <div class="album-lb-slide" data-index="${i}">
      <img src="${src}" alt="Ảnh bánh ${i + 1} — Bếp nhỏ đầy yêu thương" loading="lazy" />
    </div>`
  ).join("");

  albumLbThumbs.innerHTML = BAKERY_ALBUM_IMAGES.map(
    (src, i) => `
    <button class="album-lb-thumb" data-thumb="${i}" aria-label="Xem ảnh ${i + 1}">
      <img src="${src}" alt="" loading="lazy" />
    </button>`
  ).join("");
}

/* Show image at index (with loop) */
function goToAlbumSlide(index) {
  const total = BAKERY_ALBUM_IMAGES.length;
  if (!total) return;
  albumIndex = (index + total) % total;

  albumLbTrack.style.transform = `translateX(-${albumIndex * 100}%)`;
  albumLbCounter.textContent = `${albumIndex + 1} / ${total}`;

  // Highlight active thumbnail + scroll it into view
  const thumbs = albumLbThumbs.querySelectorAll(".album-lb-thumb");
  thumbs.forEach((th, i) => {
    const active = i === albumIndex;
    th.classList.toggle("active", active);
    if (active) {
      th.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  });
}

function openAlbumGallery() {
  if (!albumLightbox) return;
  goToAlbumSlide(0);
  albumLightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeAlbumGallery() {
  if (!albumLightbox) return;
  albumLightbox.classList.remove("open");
  if (!modal.classList.contains("open") && !cartDrawer.classList.contains("open")) {
    document.body.style.overflow = "";
  }
}

/* --- Events --- */
if (bakeryAlbum) {
  bakeryAlbum.addEventListener("click", openAlbumGallery);
  bakeryAlbum.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openAlbumGallery();
    }
  });
}

if (albumLbClose) albumLbClose.addEventListener("click", closeAlbumGallery);
if (albumLbPrev) albumLbPrev.addEventListener("click", () => goToAlbumSlide(albumIndex - 1));
if (albumLbNext) albumLbNext.addEventListener("click", () => goToAlbumSlide(albumIndex + 1));

albumLbThumbs?.addEventListener("click", (e) => {
  const thumb = e.target.closest("[data-thumb]");
  if (thumb) goToAlbumSlide(Number(thumb.dataset.thumb));
});

// Click on empty area of stage (not image) to close
albumLbTrack?.addEventListener("click", (e) => {
  if (e.target.classList.contains("album-lb-track")) {
    closeAlbumGallery();
  }
});

/* Touch swipe support (kéo ngang để lướt ảnh) */
let albumTouchStartX = 0;
let albumTouchEndX = 0;

if (albumLbTrack) {
  albumLbTrack.addEventListener("touchstart", (e) => {
    albumTouchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  albumLbTrack.addEventListener("touchend", (e) => {
    albumTouchEndX = e.changedTouches[0].screenX;
    const diff = albumTouchStartX - albumTouchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goToAlbumSlide(albumIndex + 1);
      else goToAlbumSlide(albumIndex - 1);
    }
  }, { passive: true });
}

/* Keyboard navigation */
document.addEventListener("keydown", (e) => {
  if (!albumLightbox.classList.contains("open")) return;
  if (e.key === "Escape") {
    closeAlbumGallery();
  } else if (e.key === "ArrowRight") {
    goToAlbumSlide(albumIndex + 1);
  } else if (e.key === "ArrowLeft") {
    goToAlbumSlide(albumIndex - 1);
  }
});

/* Build on load */
buildAlbumGallery();

/* Init */
loadGallerySettings();
loadProducts();
updateCartUI();
checkOrderFormVisibility();
loadOrders();
initCarousel();
