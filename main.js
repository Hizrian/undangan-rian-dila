// Saat pertama kali halaman dimuat, posisikan ke atas
window.scrollTo(0, 0);

const openBtn = document.getElementById("openBtn");
const pembukaanSection = document.getElementById("pembukaan");
const bottomNav = document.getElementById("bottomNav");
const content = document.getElementById("content");
const audio = document.getElementById("bgMusic");

// Lock scroll sebelum dibuka
document.body.style.overflow = "hidden";
content.style.overflow = "hidden";

// Buat tirai di section pembukaan
const tiraiLeft = document.createElement("div");
const tiraiRight = document.createElement("div");
tiraiLeft.className = "curtain left";
tiraiRight.className = "curtain right";
pembukaanSection.appendChild(tiraiLeft);
pembukaanSection.appendChild(tiraiRight);

let sudahDibuka = false;
let tiraiTerbuka = false;

openBtn.addEventListener("click", async () => {
  // 1Coba masuk ke mode fullscreen (jika didukung)
  if (document.documentElement.requestFullscreen) {
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.log("Fullscreen gagal:", err);
    }
  } else {
    console.log("Fullscreen tidak didukung di browser ini");
  }

  // Scroll ke section pembukaan
  setTimeout(() => {
    pembukaanSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 600);

  // Cegah klik ganda
  if (sudahDibuka) return;
  sudahDibuka = true;
  bottomNav.style.opacity = "1";
  content.style.overflow = "auto";

  // Buka tirai dengan sedikit delay
  setTimeout(() => {
    tiraiLeft.classList.add("open");
    tiraiRight.classList.add("open");
    tiraiTerbuka = true;

    // Coba putar audio
    audio.play().catch(() => {
      // Jika gagal (biasanya di Safari), tampilkan notifikasi kecil
      const notif = document.createElement("div");
      notif.textContent = "Ketuk layar untuk memulai musik 🎵";
      notif.style.position = "fixed";
      notif.style.bottom = "20px";
      notif.style.left = "50%";
      notif.style.transform = "translateX(-50%)";
      notif.style.background = "rgba(0,0,0,0.7)";
      notif.style.color = "#fff";
      notif.style.padding = "10px 16px";
      notif.style.borderRadius = "12px";
      notif.style.fontSize = "14px";
      notif.style.zIndex = "9999";
      notif.style.transition = "opacity 0.4s";
      document.body.appendChild(notif);

      // Tambahkan gesture listener untuk memulai audio
      const startAudio = () => {
        audio.play().catch(() => {});
        notif.style.opacity = "0";
        setTimeout(() => notif.remove(), 500);
        document.removeEventListener("touchstart", startAudio);
        document.removeEventListener("click", startAudio);
      };

      document.addEventListener("touchstart", startAudio, { once: true });
      document.addEventListener("click", startAudio, { once: true });
    });
  }, 800);
});

// // Event scroll untuk menutup atau membuka kembali tirai
// window.addEventListener("scroll", () => {
//   const scrollPos = window.scrollY;

//   // Saat user scroll ke paling atas, tutup tirai
//   if (scrollPos <= 20 && tiraiTerbuka) {
//     tiraiLeft.classList.remove("open");
//     tiraiRight.classList.remove("open");
//     tiraiTerbuka = false;
//     content.style.overflow = "hidden"; // kunci scroll lagi
//   }

//   // Saat user mulai turun, buka kembali tirai
//   else if (scrollPos > 100 && !tiraiTerbuka) {
//     tiraiLeft.classList.add("open");
//     tiraiRight.classList.add("open");
//     tiraiTerbuka = true;
//     content.style.overflow = "auto"; // buka scroll lagi
//   }
// });

// IntersectionObserver to set active nav + auto-scroll horizontal
const navScroll = document.querySelector(".nav-scroll"); // wrapper scroll
const navItems = Array.from(document.querySelectorAll(".nav-item"));
const sections = Array.from(document.querySelectorAll("main section, .cover")); // termasuk cover

// klik menu scroll ke section
navItems.forEach((it) => {
  it.addEventListener("click", () => {
    const id = it.dataset.target;
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const observerOptions = {
  root: null,
  rootMargin: "0px 0px -40% 0px",
  threshold: 0,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.id;

      navItems.forEach((n) => {
        if (n.dataset.target === id) {
          n.classList.add("active");

          // auto-scroll horizontal supaya menu aktif selalu terlihat
          const navRect = navScroll.getBoundingClientRect();
          const itemRect = n.getBoundingClientRect();
          const offset = itemRect.left - navRect.left - navRect.width / 2 + itemRect.width / 2;
          navScroll.scrollBy({ left: offset, behavior: "smooth" });
        } else {
          n.classList.remove("active");
        }
      });
    }
  });
}, observerOptions);

sections.forEach((s) => observer.observe(s));

// Countdown helper
function startCountdown(targetDate, els) {
  function update() {
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) {
      els.days.textContent = "00";
      els.hrs.textContent = "00";
      els.mins.textContent = "00";
      els.secs.textContent = "00";
      clearInterval(timer);
      return;
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    els.days.textContent = String(d).padStart(2, "0");
    els.hrs.textContent = String(h).padStart(2, "0");
    els.mins.textContent = String(m).padStart(2, "0");
    els.secs.textContent = String(s).padStart(2, "0");
  }
  update();
  const timer = setInterval(update, 1000);
  return timer;
}

// Configure dates here (ubah sesuai kebutuhan)
// Format: YYYY, M-1, D, H, m
// Contoh: Akad 31 Dec 2025 09:00
const akadDate = new Date(2026, 0, 20, 9, 0, 0);
const resepsiDate = new Date(2026, 0, 25, 9, 0, 0);

startCountdown(akadDate, {
  days: document.getElementById("aDays"),
  hrs: document.getElementById("aHrs"),
  mins: document.getElementById("aMins"),
  secs: document.getElementById("aSecs"),
});
startCountdown(resepsiDate, {
  days: document.getElementById("rDays"),
  hrs: document.getElementById("rHrs"),
  mins: document.getElementById("rMins"),
  secs: document.getElementById("rSecs"),
});

// Optional: allow changing guest name via URL param 'to'
(function setGuestFromURL() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("to");
  if (name) {
    document.getElementById("guestName").textContent = decodeURIComponent(name);
  }
})();

// Accessibility: pause music when page hidden
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    audio.pause();
  } else if (sudahDibuka) {
    audio.play().catch(() => {});
  }
});

// ----------------------------
// MODAL ANGAO & GIFT (HTML STATIC)
// ----------------------------

// ambil elemen modal dan tombol
const modalAngpao = document.getElementById("modalAngpao");
const modalGift = document.getElementById("modalGift");
const openAngpao = document.getElementById("openAngpao");
const openGift = document.getElementById("openGift");

// buka modal angpao
openAngpao.addEventListener("click", () => {
  modalAngpao.style.display = "flex";
  document.body.style.overflow = "hidden"; // kunci scroll saat modal terbuka
});

// buka modal gift
openGift.addEventListener("click", () => {
  modalGift.style.display = "flex";
  document.body.style.overflow = "hidden";
});

// tutup modal lewat tombol close-x
document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const target = e.target.dataset.close;
    document.getElementById(target).style.display = "none";
    document.body.style.overflow = "auto";
  });
});

// tutup modal jika klik area luar modal
[modalAngpao, modalGift].forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const copyBtn = document.getElementById("copyRek");
  const rekElem = document.getElementById("rekNum");

  if (!copyBtn || !rekElem) return;

  copyBtn.addEventListener("click", async () => {
    const rek = rekElem.textContent.trim();

    try {
      // Coba pakai Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(rek);
      } else {
        // fallback untuk mobile browser
        const tempInput = document.createElement("textarea");
        tempInput.value = rek;
        tempInput.style.position = "fixed";
        tempInput.style.opacity = "0";
        document.body.appendChild(tempInput);
        tempInput.focus();
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      copyBtn.textContent = "Disalin ✓";
      setTimeout(() => (copyBtn.textContent = "Salin Nomor Rekening"), 2000);
    } catch (err) {
      alert("Gagal menyalin. Silakan salin manual.");
    }
  });
});
