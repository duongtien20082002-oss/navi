console.log("JS LOADED AND RUNNING");

// ===========================
// SCROLL MƯỢT ĐẾN SECTION
// ===========================
document.querySelectorAll(".js-scroll").forEach((link) => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href && href.startsWith("#")) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const topOffset = 76; // chừa chỗ topbar
        const elementPos = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPos - topOffset,
          behavior: "smooth",
        });
      }
    }
  });
});

// ===========================
// FAQ TOGGLE
// ===========================
document.querySelectorAll(".faq-item").forEach((item) => {
  const btn = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");
  const toggle = item.querySelector(".faq-toggle");

  if (!btn || !answer || !toggle) return;

  btn.addEventListener("click", () => {
    const isOpen = answer.style.display === "block";

    // Đóng tất cả
    document.querySelectorAll(".faq-answer").forEach((ans) => {
      ans.style.display = "none";
    });
    document.querySelectorAll(".faq-toggle").forEach((tg) => {
      tg.textContent = "+";
    });

    // Mở cái đang click nếu đang đóng
    if (!isOpen) {
      answer.style.display = "block";
      toggle.textContent = "−";
    }
  });
});

// ===========================
// GIẢ LẬP SỐ LƯỢNG ƯU ĐÃI CÒN LẠI (ĐƠN GIẢN)
// ===========================
(function () {
  const el = document.getElementById("stock-count");
  if (!el) return;
  const base = 22;
  const randomMinus = Math.floor(Math.random() * 5); // 0–4
  el.textContent = base - randomMinus;
})();

// ===========================
// GỬI LEAD VỀ GOOGLE SHEETS
// ===========================
const leadForm = document.getElementById("lead-form");
console.log("FORM:", leadForm);

// URL Web App ĐÚNG của anh
const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbwa7XYaWcq3jxNhEgwoS_YJfC3b-lF_aboWfWIJUvXpwWmCie4XwiHh55KQ35k5b7FD/exec";

if (leadForm) {
  leadForm.addEventListener("submit", async (e) => {
    console.log("SUBMIT EVENT TRIGGERED");
    e.preventDefault();

    const formData = new FormData(leadForm);
    const rawName = (formData.get("name") || "").trim();
    const rawPhone = (formData.get("phone") || "").trim();

    const name = rawName;
    const phone = rawPhone.replace(/[^0-9]/g, "");

    if (!phone) {
      alert("Anh/chị vui lòng nhập số điện thoại.");
      return;
    }

    if (phone.length < 9 || phone.length > 11) {
      alert("Số điện thoại chưa đúng, anh/chị kiểm tra lại giúp em.");
      return;
    }

    // Payload gửi sang Apps Script
    const payload = new URLSearchParams();
    payload.append("HoTen", name);
    payload.append("SoDienThoai", phone);

    const submitBtn =
      leadForm.querySelector('button[type="submit"]') ||
      leadForm.querySelector("button");
    const oldText = submitBtn ? submitBtn.textContent : "";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Đang gửi...";
    }

    try {
      await fetch(WEB_APP_URL, {
        method: "POST",
        body: payload,
        mode: "no-cors",
      });

      alert(
        `Cảm ơn ${name || "bà con"} đã để lại thông tin!\n` +
          `Kỹ sư King Azone sẽ liên hệ số: ${phone} trong thời gian sớm nhất.`
      );

      leadForm.reset();
    } catch (err) {
      console.error("Lỗi gửi lead lên Google Script:", err);
      alert(
        "Gửi thông tin chưa thành công, anh/chị vui lòng thử lại hoặc gọi hotline 0911.509.011."
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent =
          oldText || "Gửi thông tin – King Azone liên hệ tư vấn";
      }
    }
  });
}