/* Tiệm Bánh Phương Lý — interactions */

const PRODUCTS = [
  {
    id: "strawberry-dream",
    name: "Strawberry Dream",
    desc: "Bánh kem dâu tươi, cốt bông lan mềm, kem cheese nhẹ — best-seller trên @lybi1993.",
    price: 350000,
    cat: "cream",
    emoji: "🍓",
    badge: "Best-seller",
    tags: ["Kem tươi", "Dâu", "18cm"],
    detail: "Lớp bông lan vanilla thrice-sifted, kem whipping + cream cheese, dâu tươi theo mùa. Decor drip hồng pastel như trên feed TikTok @lybi1993."
  },
  {
    id: "chocolate-cloud",
    name: "Chocolate Cloud",
    desc: "Socola Bỉ đậm vị, mousse nhẹ như mây, phủ cacao và vàng lá.",
    price: 420000,
    cat: "cream",
    emoji: "🍫",
    badge: "Premium",
    tags: ["Socola Bỉ", "Mousse", "20cm"],
    detail: "Cốt chocolate moist, mousse dark chocolate 70%, ganache bóng. Phù hợp sinh nhật người lớn, tone sang."
  },
  {
    id: "sakura-bloom",
    name: "Sakura Bloom",
    desc: "Tone hồng sakura, hoa kem handmade, chữ custom theo yêu cầu.",
    price: 480000,
    cat: "birthday",
    emoji: "🌸",
    badge: "Custom",
    tags: ["Sinh nhật", "Hoa kem", "Custom"],
    detail: "Bánh sinh nhật thiết kế theo moodboard. Gửi sample từ @lybi1993 — bếp làm đúng vibe. Size 16–22cm."
  },
  {
    id: "lemon-soft",
    name: "Lemon Soft Cake",
    desc: "Chanh vàng tươi, curd chua dịu, kem mascarpone thanh.",
    price: 320000,
    cat: "cream",
    emoji: "🍋",
    badge: "Fresh",
    tags: ["Chanh", "Thanh nhẹ", "16cm"],
    detail: "Không ngọt gắt — lemon curd nhà làm, cốt genoise, topping zest và mứt chanh."
  },
  {
    id: "cupcake-set",
    name: "Cupcake Set 6",
    desc: "Set 6 cupcake mix vị: vani, socola, dâu, matcha — hộp quà xinh.",
    price: 189000,
    cat: "cupcake",
    emoji: "🧁",
    badge: "Set quà",
    tags: ["6 cái", "Mix vị", "Hộp đẹp"],
    detail: "Lý tưởng làm quà, tiệc nhỏ, họp team. Có set 12 cái (+89k). Decor theo theme."
  },
  {
    id: "cupcake-12",
    name: "Cupcake Party 12",
    desc: "12 cupcake đầy màu sắc — perfect cho birthday party & baby shower.",
    price: 320000,
    cat: "cupcake",
    emoji: "🎉",
    badge: "Party",
    tags: ["12 cái", "Party", "Theme"],
    detail: "Chọn theme: pastel, rainbow, animal, flower. Giao kèm nến và thiệp."
  },
  {
    id: "cookie-box",
    name: "Cookie Box Signature",
    desc: "Hộp 12 cookies: butter, matcha, chocolate chip, sablé hoa.",
    price: 165000,
    cat: "cookie",
    emoji: "🍪",
    badge: "Crunchy",
    tags: ["12 cái", "Mix", "Giòn"],
    detail: "Nướng mỗi sáng. Bảo quản 7 ngày. Ideal làm quà 8/3, 20/10, Trung thu mini."
  },
  {
    id: "gift-set-love",
    name: "Set Quà Ngọt Love",
    desc: "Mini cake + cookies + thiệp viết tay — gói nơ lụa pastel.",
    price: 399000,
    cat: "gift",
    emoji: "🎀",
    badge: "Gift",
    tags: ["Combo", "Thiệp", "Nơ lụa"],
    detail: "Combo perfect tặng crush / người thương. Ghi message trên thiệp miễn phí."
  },
  {
    id: "two-tier-dream",
    name: "Two-Tier Dream",
    desc: "Bánh 2 tầng hoành tráng, decor hoa kem & cherry — event lớn.",
    price: 890000,
    cat: "birthday",
    emoji: "🎂",
    badge: "Luxury",
    tags: ["2 tầng", "Event", "Custom"],
    detail: "Đặt trước 2–3 ngày. Phù hợp đám cưới nhỏ, thôi nôi, kỷ niệm. Consult free qua inbox TikTok @lybi1993."
  }
];

const formatPrice = (n) =>
  n.toLocaleString("vi-VN") + "đ";

function renderBestSellerProducts() {
  const list = PRODUCTS;
  bestSellerGrid.innerHTML = list
    .map(
      (p) => `
    <article class="product-card" data-id="${p.id}" data-cat="${p.cat}">
      <div class="product-thumb">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
        <span class="emoji">${p.emoji}</span>
      </div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-meta">
          <span class="price">${formatPrice(p.price)}</span>
          <div style="display:flex;gap:0.5rem;align-items:center">
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

/* ---------- State ---------- */
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
        <span class="emoji">${p.emoji}</span>
      </div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-meta">
          <span class="price">${formatPrice(p.price)}</span>
          <div style="display:flex;gap:0.5rem;align-items:center">
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
        <div class="cart-item-emoji">${p.emoji}</div>
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
    <div class="modal-hero">${p.emoji}</div>
    <div class="modal-content">
      <h3>${p.name}</h3>
      <span class="price">${formatPrice(p.price)}</span>
      <p>${p.detail || p.desc}</p>
      <div class="modal-tags">
        ${(p.tags || []).map((t) => `<span>${t}</span>`).join("")}
      </div>
      <button class="btn btn-primary full" data-add-modal="${p.id}">Thêm vào giỏ bánh</button>
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
menuToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
  menuToggle.classList.toggle("open");
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

/* Order form */
orderForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(orderForm);
  const name = data.get("name");
  const type = data.get("type");
  showToast(`Cảm ơn ${name}! Đơn “${type}” đã được ghi nhận 🎂`);
  orderForm.reset();
  // Demo: clear cart after “order”
  // cart = []; saveCart();
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
  }
});

/* Init */
renderProducts();
renderBestSellerProducts();
updateCartUI();
