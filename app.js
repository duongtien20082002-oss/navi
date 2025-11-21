// SCROLL MƯỢT ĐẾN SECTION
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

// FAQ TOGGLE
document.querySelectorAll(".faq-item").forEach((item) => {
  const btn = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");
  const toggle = item.querySelector(".faq-toggle");

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

// GIẢ LẬP SỐ LƯỢNG ƯU ĐÃI CÒN LẠI (ĐƠN GIẢN)
(function () {
  const el = document.getElementById("stock-count");
  if (!el) return;
  const base = 22;
  const randomMinus = Math.floor(Math.random() * 5); // 0–4
  el.textContent = base - randomMinus;
})();

// XỬ LÝ SUBMIT FORM (DEMO – ANH CÓ THỂ GẮN VỀ GOOGLE FORM HOẶC BACKEND SAU)
const leadForm = document.getElementById("lead-form");
if (leadForm) {
  leadForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(leadForm);
    const name = formData.get("name") || "";
    const phone = formData.get("phone") || "";

    // Ở đây anh có thể fetch tới API / Google Sheet...
    // Demo: chỉ hiện alert và reset form
    alert(
      `Cảm ơn ${name || "bà con"} đã để lại thông tin!\nKỹ sư King Azone sẽ liên hệ số: ${
        phone || "đã đăng ký"
      } trong thời gian sớm nhất.`
    );
    leadForm.reset();
  });
}
