import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "./style.css";
const photoIds = {
  hero: "photo-1492144534655-ae79c964c9d7",
  audio: "photo-1606220945770-b5b6c2c55bf1",
  charger: "photo-1583863788434-e58a36330cf0",
  phone: "photo-1511707171634-5f897ff02aa9",
  car: "photo-1503376780353-7e6692767b70",
  headphones: "photo-1546435770-a3e426bf472b",
  dash: "photo-1449965408869-eaa3f722e40d",
};
const img = (key, w = 1000) =>
  `https://images.unsplash.com/${photoIds[key]}?auto=format&fit=crop&w=${w}&q=85`;
// Local original illustrations remain available if the external photo host cannot be reached.
document.addEventListener(
  "error",
  (event) => {
    const image = event.target;
    if (image instanceof HTMLImageElement && !image.dataset.fallback) {
      image.dataset.fallback = "true";
      const key = Object.keys(photoIds).find((k) =>
        image.src.includes(photoIds[k]),
      );
      if (key) image.src = `/images/${key}.svg`;
    }
  },
  true,
);
const products = [
  {
    id: "EL-001",
    name: "Wireless audio accessories",
    category: "Electronics",
    type: "Audio",
    image: "audio",
  },
  {
    id: "CA-001",
    name: "In-car charging accessories",
    category: "Car Accessories",
    type: "Charging",
    image: "charger",
  },
  {
    id: "EL-002",
    name: "Over-ear audio accessories",
    category: "Electronics",
    type: "Audio",
    image: "headphones",
  },
  {
    id: "CA-002",
    name: "Mobile & dashboard accessories",
    category: "Car Accessories",
    type: "Mobile accessories",
    image: "dash",
  },
  {
    id: "EL-003",
    name: "Mobile accessories",
    category: "Electronics",
    type: "Mobile accessories",
    image: "phone",
  },
  {
    id: "CA-003",
    name: "Car accessory enquiries",
    category: "Car Accessories",
    type: "General enquiries",
    image: "car",
  },
];
const mark = `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M5 23 25 7v49H13V28l-8 5z" fill="currentColor"/><path d="M59 9H43a22 22 0 0 0 0 45h16V42H44a10 10 0 0 1 0-21h15z" fill="currentColor"/><path d="M34 7h25v10H34z" fill="#c5a86f"/></svg>`;
document.querySelector("#app").innerHTML = `
<div class="announcement"><span>TRADE SUPPLY. MADE PERSONAL.</span><span>Wholesale only · Business enquiries welcome <span class="gold"><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></span></span></div>
<header><a class="brand" href="#home" aria-label="EBAY 1ST CHOICE LTD home">${mark}<span>EBAY 1ST CHOICE <small>LTD · WHOLESALE</small></span></a><button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button><nav aria-label="Main navigation"><a href="#catalogue" data-nav="All">Our catalogue</a><a href="#catalogue" data-nav="Electronics">Electronics</a><a href="#catalogue" data-nav="Car Accessories">Car accessories</a><a href="#about">About us</a></nav><a class="button small" href="#enquiry">Trade enquiry <span><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></span></a></header>
<main id="home"><section class="hero"><div class="hero-copy"><div class="eyebrow"><i></i> ELECTRONICS & CAR ACCESSORIES · WHOLESALE</div><h1>Your next range.<br>Your next <em>opportunity.</em></h1><p>Source electronics and car accessories for your business. Explore our wholesale ranges and start a conversation about the products you need.</p><div class="actions"><a class="button light" href="#catalogue">Browse our ranges <span><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></span></a><a class="text-link" href="#enquiry">Let's talk wholesale <span><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></span></a></div><div class="hero-bottom"><span>01 / ELECTRONICS</span><span>02 / CAR ACCESSORIES</span></div></div><div class="hero-image"><img src="${img("hero", 1400)}" alt="Detail of a modern sports car" fetchpriority="high"><div class="image-shade"></div><div class="hero-photo-tag"><span class="status-dot"></span> THE AUTOMOTIVE RANGE</div><div class="image-label"><span>ELECTRONICS. AUTOMOTIVE. OPPORTUNITY.</span><strong>On the move.<br>In good company.</strong></div><span class="image-number">01 — 02</span></div></section>
<section class="benefits" aria-label="Wholesale service"><div><b><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></b><span>Wholesale focused<small>For your business requirements</small></span></div><div><b>◇</b><span>Two specialist ranges<small>Electronics & car accessories</small></span></div><div><b>≋</b><span>Personal quotations<small>Discuss products and quantities</small></span></div><div><b>◎</b><span>Trade conversations<small>Discuss your business needs</small></span></div></section>
<section class="section ranges" id="ranges"><div class="section-heading"><div><div class="eyebrow">TWO RANGES. ONE PARTNER.</div><h2>Two worlds. One wholesale partner.</h2></div><p>Explore our product areas.<br>Tell us what your customers need.</p></div><div class="range-grid"><a class="range-card" href="#catalogue" data-nav="Electronics"><img src="${img("headphones")}" alt="Over-ear headphones representing the electronics range" loading="lazy"><div class="range-overlay"><small>01 / CONNECTED LIVING</small><h3>Electronics</h3><p>Audio, charging & mobile accessories</p></div><span class="round-arrow"><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></span></a><a class="range-card" href="#catalogue" data-nav="Car Accessories"><img src="${img("car")}" alt="Car representing the car accessories range" loading="lazy"><div class="range-overlay"><small>02 / LIFE ON THE MOVE</small><h3>Car accessories</h3><p>Charging, mounting & in-car essentials</p></div><span class="round-arrow"><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></span></a></div></section>
<section class="automotive section" id="car-accessories"><div class="auto-photo"><img src="${img("dash", 1200)}" alt="Representative in-car dashboard photography" loading="lazy"><span class="photo-caption">THE CAR ACCESSORIES COLLECTION</span></div><div class="auto-copy"><div class="eyebrow">MADE FOR LIFE ON THE ROAD</div><h2>Put your business<br>in the <em>driving seat.</em></h2><p>A dedicated space for your automotive accessory requirements. Explore in-car essentials and tell us what your customers are looking for.</p><div class="auto-types"><a href="#catalogue" data-nav="Car Accessories"><span>01</span><div>Car charging<small>In-car power & charging enquiries</small></div><b><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></b></a><a href="#catalogue" data-nav="Car Accessories"><span>02</span><div>Phone mounts<small>Dashboard & mobile accessory enquiries</small></div><b><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></b></a><a href="#enquiry"><span>03</span><div>Looking for something else?<small>Send us your product requirements</small></div><b><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></b></a></div><a class="button" href="#catalogue" data-nav="Car Accessories">Explore car accessories <span><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></span></a></div></section>
<section class="section catalogue" id="catalogue"><div class="section-heading"><div><div class="eyebrow">THE WHOLESALE EDIT</div><h2>A closer look at our ranges.</h2></div><a class="underlined" href="#enquiry">Looking for something specific? <svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></a></div><div class="catalogue-controls"><div class="tabs" role="group" aria-label="Product category"><button class="active" data-filter="All">All products</button><button data-filter="Electronics">Electronics</button><button data-filter="Car Accessories">Car accessories</button></div><label class="search"><span>⌕</span><input type="search" placeholder="Search the catalogue" aria-label="Search the catalogue"></label></div><p class="catalogue-note">Range inspiration · Representative photography, not confirmed stock. Ask us about products, specifications, availability and minimum quantities.</p><div class="product-grid" id="products"></div><p id="result-status" class="sr-only" aria-live="polite"></p></section>
<section class="process section"><div><div class="eyebrow">STRAIGHTFORWARD SOURCING</div><h2>From first look<br>to your next step.</h2><a class="underlined" href="#enquiry">Start a conversation <svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></a></div><ol><li><span>01</span><div><h3>Explore the range</h3><p>Browse electronics and car accessories, or tell us what you are looking for.</p></div></li><li><span>02</span><div><h3>Share your requirements</h3><p>Let us know your products, quantities and delivery destination.</p></div></li><li><span>03</span><div><h3>Discuss your quotation</h3><p>Confirm pricing, availability and trading arrangements with our team.</p></div></li></ol></section>
<section class="about section" id="about"><div class="about-symbol"><span class="about-label">OUR BUSINESS, AT A GLANCE</span>${mark}<div class="about-values"><span>Electronics</span><span>Car accessories</span><span>Wholesale enquiries</span></div></div><div><div class="eyebrow">MEET EBAY 1ST CHOICE LTD</div><h2>Business starts<br>with a connection.</h2><p>EBAY 1ST CHOICE LTD focuses on wholesale electronics and car accessories. Our catalogue brings these two areas together, giving trade buyers a clear starting point for sourcing conversations. Tell us your requirements; discuss the details directly with our team.</p><a class="underlined" href="#enquiry">Tell us about your business <svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></a></div></section>
<section class="section enquiry" id="enquiry"><div><div class="eyebrow">LET'S BUILD YOUR NEXT ORDER</div><h2>Your requirements.<br><em>Our starting point.</em></h2><p>Prepare your wholesale enquiry with the products and quantities you need.</p><div class="enquiry-note"><strong>Your enquiry, ready to share</strong><p>Download a summary of your requirements. This form saves a file on your device; it does not send an enquiry to our team.</p></div></div><form id="quote-form"><div class="form-row"><label>Your name<input name="name" autocomplete="name" required maxlength="120" placeholder="Full name"></label><label>Company name<input name="company" autocomplete="organization" required maxlength="160" placeholder="Your business"></label></div><div class="form-row"><label>Business email<input type="email" name="email" autocomplete="email" required maxlength="200" placeholder="you@company.com"></label><label>Phone <span>(optional)</span><input name="phone" type="tel" autocomplete="tel" maxlength="50" placeholder="Including country code"></label></div><label>Delivery country / postcode<input name="destination" required autocomplete="postal-code" maxlength="180" placeholder="Where do you need your products?"></label><label>Products & quantities<textarea name="requirements" rows="4" required maxlength="5000" placeholder="Product name or code, quantity and any requirements"></textarea></label><label class="checkbox"><input type="checkbox" required><span>I understand this downloads my enquiry and does not send it.</span></label><button class="button light" type="submit">Download enquiry <span><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></span></button><p id="form-status" role="status"></p></form></section>
<section class="section faq"><div class="eyebrow">A FEW USEFUL ANSWERS</div><h2>Before we connect.</h2><details><summary>Can I buy directly through the website?</summary><p>This is a wholesale catalogue. Contact the team to discuss products and receive a quotation. There is no online checkout.</p></details><details><summary>How do I find pricing and minimum quantities?</summary><p>Include the products and quantities you need in your enquiry. Pricing, minimum quantities and availability are confirmed individually.</p></details><details><summary>Are these your confirmed products?</summary><p>The photographs illustrate our product areas. Individual products, specifications, stock and minimum quantities must be confirmed with the team before an order is agreed.</p></details></section></main>
<div class="closing-banner"><div class="eyebrow">YOUR NEXT STEP STARTS HERE</div><a href="#enquiry">Let’s talk <em>wholesale.</em> <span><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></span></a></div><footer><div class="footer-top"><a class="brand" href="#home">${mark}<span>EBAY 1ST CHOICE<small>LTD · WHOLESALE</small></span></a><p>Electronics. Car accessories.<br>Your next business connection.</p><div><a href="#catalogue" data-nav="Electronics">Electronics <svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></a><a href="#catalogue" data-nav="Car Accessories">Car accessories <svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></a><a href="#enquiry">Trade enquiries <svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} EBAY 1ST CHOICE LTD</span><span>Wholesale catalogue · No online purchasing</span><a href="#home">Back to top ↑</a></div></footer><dialog id="product-dialog" aria-labelledby="detail-title"><button class="dialog-close" aria-label="Close product details">×</button><div id="detail-content"></div></dialog>`;
let filter = "All",
  query = "";
function render() {
  const shown = products.filter(
    (p) =>
      (filter === "All" || p.category === filter) &&
      `${p.name} ${p.id} ${p.category}`.toLowerCase().includes(query),
  );
  document.querySelector("#products").innerHTML = shown.length
    ? shown
        .map(
          (p) =>
            `<article class="product"><div class="product-image"><img src="${img(p.image, 650)}" alt="Representative image for ${p.name}" loading="lazy"><span>${p.category}</span><button class="quick-view" data-view="${p.id}" aria-label="View ${p.name}"><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></button></div><div class="product-meta"><small>${p.id} · ILLUSTRATIVE RANGE</small><h3>${p.name}</h3><p>Pricing & quantities on enquiry</p><button data-enquire="${p.id}">Enquire about this range <span><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></span></button></div></article>`,
        )
        .join("")
    : '<p class="empty">No matching ranges. Try another search or send us your requirements below.</p>';
  document.querySelector("#result-status").textContent =
    `${shown.length} ranges shown`;
  document.querySelectorAll("[data-filter]").forEach((b) => {
    b.classList.toggle("active", b.dataset.filter === filter);
    b.setAttribute("aria-pressed", b.dataset.filter === filter);
  });
}
const dialog = document.querySelector("#product-dialog");
function closeDialog() {
  dialog.close();
}
dialog.querySelector(".dialog-close").addEventListener("click", closeDialog);
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) closeDialog();
});
document.addEventListener("click", (e) => {
  const view = e.target.closest("[data-view]");
  if (view) {
    const p = products.find((p) => p.id === view.dataset.view);
    document.querySelector("#detail-content").innerHTML =
      `<img src="${img(p.image, 900)}" alt="Representative photography for ${p.name}"><div class="detail-copy"><div class="eyebrow">${p.category}</div><h2 id="detail-title">${p.name}</h2><p>Explore this wholesale product area with our team. Tell us the type of product, quantity and any compatibility requirements you have.</p><dl><div><dt>Range reference</dt><dd>${p.id}</dd></div><div><dt>Pricing & minimum quantities</dt><dd>Confirmed on enquiry</dd></div><div><dt>Photography</dt><dd>Representative category image</dd></div></dl><button class="button" data-enquire="${p.id}">Prepare an enquiry <span><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg></span></button></div>`;
    dialog.showModal();
  }
  const f = e.target.closest("[data-filter]");
  if (f) {
    filter = f.dataset.filter;
    render();
  }
  const n = e.target.closest("[data-nav]");
  if (n) {
    filter = n.dataset.nav;
    query = "";
    document.querySelector(".search input").value = "";
    render();
  }
  const q = e.target.closest("[data-enquire]");
  if (q) {
    if (dialog.open) closeDialog();
    const p = products.find((p) => p.id === q.dataset.enquire);
    document.querySelector("[name=requirements]").value =
      `${p.id} — ${p.name}\nQuantity required: `;
    document.querySelector("#enquiry").scrollIntoView({ behavior: "smooth" });
    document
      .querySelector("[name=requirements]")
      .focus({ preventScroll: true });
  }
  if (e.target.closest("nav a")) {
    document.querySelector("nav").classList.remove("open");
    document
      .querySelector(".menu-toggle")
      .setAttribute("aria-expanded", "false");
  }
});
document.querySelector(".search input").addEventListener("input", (e) => {
  query = e.target.value.trim().toLowerCase();
  render();
});
document.querySelector(".menu-toggle").addEventListener("click", (e) => {
  const open = document.querySelector("nav").classList.toggle("open");
  e.currentTarget.setAttribute("aria-expanded", String(open));
});
document.querySelector("#quote-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(e.currentTarget);
  const content = `EBAY 1ST CHOICE LTD — Wholesale enquiry\nPrepared: ${new Date().toISOString()}\n\nName: ${d.get("name")}\nCompany: ${d.get("company")}\nEmail: ${d.get("email")}\nPhone: ${d.get("phone")}\nDestination: ${d.get("destination")}\n\nRequirements:\n${d.get("requirements")}\n\nThis file has not been submitted. Send it to the company's verified business contact.\n`;
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "wholesale-enquiry.txt";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector("#form-status").textContent =
    "Your enquiry file is prepared. It has not been sent to the company.";
});
render();
