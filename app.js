// =========================
// CẤU HÌNH GOOGLE SHEETS
// =========================
//
// Thay đường link Web App của anh vào đây.
//
const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyTJgyJBn15e0iwDM3DLqstoyczn-0ZRQhKBKGru6GlJPJkpESyyrjub2cuO45c62kS/exec";

// =========================
// TIỆN ÍCH DOM
// =========================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// =========================
// POPUP ĐẶT HÀNG
// =========================

function openOrderPopup(defaultQty) {
  const overlay = $("#orderOverlay");
  const qtyInput = $("#orderQty");

  if (!overlay || !qtyInput) return;

  if (defaultQty && Number(defaultQty) > 0) {
    qtyInput.value = defaultQty;
  }

  overlay.classList.remove("hidden");
}

function closeOrderPopup() {
  const overlay = $("#orderOverlay");
  if (!overlay) return;
  overlay.classList.add("hidden");
}

// Nút "ĐẶT HÀNG NGAY" ở hero
const heroOrderBtn = $("#heroOrderBtn");
if (heroOrderBtn) {
  heroOrderBtn.addEventListener("click", () => {
    const inlineQty = $("#inlineQty");
    const value = inlineQty ? inlineQty.value : "1";
    openOrderPopup(value);
  });
}

// Nút đóng popup (dấu X)
const closeOrderBtn = $("#closeOrderBtn");
if (closeOrderBtn) {
  closeOrderBtn.addEventListener("click", closeOrderPopup);
}

// Đóng popup khi click ra nền mờ
const orderOverlay = $("#orderOverlay");
if (orderOverlay) {
  orderOverlay.addEventListener("click", (e) => {
    if (e.target === orderOverlay) {
      closeOrderPopup();
    }
  });
}

// =========================
// LƯU & GỬI ĐƠN HÀNG
// =========================

const STORAGE_KEY = "naviOrders";

function loadOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Lỗi đọc localStorage:", err);
    return [];
  }
}

function saveOrders(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Lỗi ghi localStorage:", err);
  }
}

// Submit form
const orderForm = $("#orderForm");
if (orderForm) {
  orderForm.addEventListener("submit", handleOrderSubmit);
}

async function handleOrderSubmit(e) {
  e.preventDefault();

  const name = $("#orderName")?.value.trim();
  const phone = $("#orderPhone")?.value.trim();
  const qty = $("#orderQty")?.value.trim() || "1";
  const province = $("#orderProvince")?.value.trim();
  const note = $("#orderNote")?.value.trim();

  if (!name || !phone) {
    alert("Vui lòng nhập đầy đủ Họ tên và Số điện thoại.");
    return;
  }

  const order = {
    Product: "Navi 250ml",
    HoTen: name,
    SDT: phone,
    SoLuong: qty,
    KhuVuc: province || "",
    GhiChu: note || "",
    CreatedAt: new Date().toISOString(),
  };

  // Lưu tạm trong trình duyệt (phòng khi mạng / Sheets lỗi)
  const list = loadOrders();
  list.push(order);
  saveOrders(list);

  try {
    if (!WEB_APP_URL || !WEB_APP_URL.startsWith("https://script.google.com")) {
      console.warn("WEB_APP_URL chưa được cấu hình đúng.");
      throw new Error("WEB_APP_URL chưa được cấu hình đúng.");
    }

    // Gửi lên Google Apps Script
    await fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",          // bỏ qua CORS, miễn request đến được server
      body: JSON.stringify(order) // không cần header Content-Type
    });

    alert("Đã gửi đơn hàng. King Azone sẽ gọi lại cho bà con sớm nhất!");
    orderForm.reset();
    closeOrderPopup();
  } catch (err) {
    console.error("Lỗi khi gửi lên Google Sheets:", err);
    closeOrderPopup();
    alert(
      "Đơn đã được lưu tạm trên trình duyệt nhưng gửi lên Sheets bị lỗi.\n" +
        "Vui lòng kiểm tra lại kết nối hoặc liên hệ bộ phận kỹ thuật."
    );
  }
}

// =========================
// FAQ ACCORDION
// =========================

const faqQuestions = $$(".faq-question");
faqQuestions.forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    if (!item) return;
    item.classList.toggle("active");
  });
});

// =========================
// LIGHTBOX ẢNH
// =========================

const galleryItems = $$(".gallery-item");
const lightbox = $("#lightbox");
const lightboxImage = $("#lightboxImage");
const lightboxClose = $("#lightboxClose");

if (galleryItems && lightbox && lightboxImage) {
  galleryItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const src = item.getAttribute("href") || item.querySelector("img")?.src;
      if (!src) return;
      lightboxImage.src = src;
      lightbox.classList.remove("hidden");
    });
  });
}

if (lightboxClose && lightbox) {
  lightboxClose.addEventListener("click", () => {
    lightbox.classList.add("hidden");
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.add("hidden");
    }
  });
}
