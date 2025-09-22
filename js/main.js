/* ====== Config: drop your real links here ====== */
const LINKS = {
  booking: "#",
  review: "#",
  social: {
    google: "#",
    facebook: "#",
    instagram: "#",
    bluesky: "#",
    youtube: "#"
  }
};

/* ====== Header/Footer Injection ====== */
function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  el.innerHTML = `
    <div class="wrap header__inner">
      <a class="brand" href="index.html">
        <img src="assets/logo.png" alt="" />
        <span class="brand__name">Chicago Luxury Mobile Massage</span>
      </a>
      <button class="nav__toggle" aria-expanded="false" aria-controls="nav">Menu</button>
      <nav id="nav" class="nav" aria-label="Primary">
        ${[
          ["index.html","Home"],
          ["about.html","About"],
          ["services.html","Services & Pricing"],
          ["memberships.html","Membership & Packages"],
          ["gift-cards.html","Gift Cards"],
          ["faq.html","FAQ"],
          ["contact.html","Contact"],
          ["policies.html","Policies & Forms"]
        ].map(([href,label]) => `<a href="${href}">${label}</a>`).join("")}
      </nav>
    </div>
  `;
  const path = location.pathname.split("/").pop() || "index.html";
  el.querySelectorAll("nav a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === path) a.setAttribute("aria-current","page");
  });
  const toggle = el.querySelector(".nav__toggle");
  const nav = el.querySelector("#nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("nav--open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  const year = new Date().getFullYear();
  el.innerHTML = `
    <div class="wrap footer__inner">
      <div class="footer__grid">
        <div class="footer__meta">
          <p>© <span id="yr">${year}</span> Chicago Luxury Mobile Massage</p>
          <p>Email: <a href="mailto:info@chicagoluxurymobilemassage.com">info@chicagoluxurymobilemassage.com</a></p>
          <p>Licensure: IN LMT # MT22007222 · IL LMT # 227021857 · NC LMBT # 16384 · NPI # 1780208785N</p>
          <p><a class="link" href="policies.html">Policies & Forms</a></p>
        </div>
        <div>
          <div class="footer__social">
            <a class="link" href="${LINKS.social.google}" aria-label="Google Business Profile">Google</a>
            <a class="link" href="${LINKS.social.facebook}" aria-label="Facebook">Facebook</a>
            <a class="link" href="${LINKS.social.instagram}" aria-label="Instagram">Instagram</a>
            <a class="link" href="${LINKS.social.bluesky}" aria-label="Bluesky">Bluesky</a>
            <a class="link" href="${LINKS.social.youtube}" aria-label="YouTube">YouTube</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ====== CTA links wiring ====== */
function wireGlobalCTAs() {
  document.querySelectorAll("[data-booking]").forEach(el=>{
    el.setAttribute("href", LINKS.booking);
  });
  document.querySelectorAll("[data-review]").forEach(el=>{
    el.setAttribute("href", LINKS.review);
  });
}

/* ====== Forms (client-side only demo) ====== */
function wireForms() {
  const forms = [
    document.getElementById("contact-form"),
    document.getElementById("contact-preview-form")
  ].filter(Boolean);

  forms.forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const hp = form.querySelector(".hp");
      if (hp && hp.value) return; // honeypot

      const required = [...form.querySelectorAll("[required]")];
      const invalid = required.find(i => !i.value.trim());
      if (invalid) { invalid.focus(); invalid.setAttribute("aria-invalid","true"); return; }

      const toast = form.querySelector(".form__toast");
      if (toast) { toast.hidden = false; setTimeout(()=> toast.hidden = true, 3500); }
    });
  });
}

/* ====== FAQ accordion ====== */
function wireAccordion() {
  document.querySelectorAll("[data-accordion]").forEach(acc=>{
    const triggers = acc.querySelectorAll(".accordion__trigger");
    triggers.forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!expanded));
        const panel = btn.nextElementSibling;
        if (panel) panel.hidden = expanded;
      });
    });
  });
}

/* ====== Init ====== */
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  wireGlobalCTAs();
  wireForms();
  wireAccordion();
  initReviewSlider();
});


/* ====== Reviews slider (auto-rotate) ====== */
function initReviewSlider(){
  const slider = document.querySelector("[data-review-slider]");
  if(!slider) return;
  const slides = [...slider.querySelectorAll(".review-slide")];
  if(slides.length <= 1) return;

  let i = 0;
  function show(n){
    slides.forEach((s,idx)=> s.classList.toggle("active", idx === n));
    i = n;
  }
  const prevBtn = slider.querySelector(".prev");
  const nextBtn = slider.querySelector(".next");
  prevBtn?.addEventListener("click", ()=> show((i - 1 + slides.length) % slides.length));
  nextBtn?.addEventListener("click", ()=> show((i + 1) % slides.length));

  let timer = setInterval(()=> nextBtn?.click(), 5000);
  slider.addEventListener("mouseenter", ()=> clearInterval(timer));
  slider.addEventListener("mouseleave", ()=> timer = setInterval(()=> nextBtn?.click(), 5000));
}
