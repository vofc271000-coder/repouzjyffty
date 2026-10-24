'use strict';
/* ===== Voltcrate demo store: all products, prices and ratings are illustrative sample data ===== */
const $ = (s, r = document) => r.querySelector(s);
const money = n => '$' + n.toFixed(2);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const MAX_QTY = 10;
const CATS = { currency: ['Game Currency', '💎'], keys: ['License Keys', '🔑'], subs: ['Subscriptions', '🎮'], gift: ['Gift Cards', '🎁'], software: ['Software', '🛠️'] };
// Clearly defined demo discount codes (percent off the discounted subtotal)
const CODES = { VOLT10: 10, PLAY15: 15, WELCOME5: 5 };

// P(id,name,category,game,icon,hue,description,[[variant,price]...],discount%,rating,popularity,stock)
const P = (id, name, cat, game, icon, hue, desc, vars, disc, rating, pop, stock) => ({ id, name, cat, game, icon, hue, desc, vars, disc, rating, pop, stock });
const products = [
  P(1, 'Robux Top-Up', 'currency', 'Roblox', '🧱', 350, 'Sample Robux currency listing for demo purposes.', [['800 R$', 9.5], ['1,700 R$', 19], ['4,500 R$', 47]], 10, 4.8, 98, 'in'),
  P(2, 'PUBG Mobile UC', 'currency', 'PUBG', '🪖', 30, 'Sample Unknown Cash listing for demo purposes.', [['660 UC', 9], ['1,800 UC', 24], ['3,850 UC', 48]], 8, 4.7, 95, 'in'),
  P(3, 'Free Fire Diamonds', 'currency', 'Free Fire', '🔥', 15, 'Sample diamonds listing for demo purposes.', [['520 💎', 5.5], ['1,080 💎', 10.5], ['2,200 💎', 21]], 12, 4.6, 90, 'in'),
  P(4, 'Fortnite V-Bucks', 'currency', 'Fortnite', '🦙', 265, 'Sample V-Bucks listing for demo purposes.', [['1,000 V-B', 7.5], ['2,800 V-B', 20], ['5,000 V-B', 34]], 5, 4.9, 92, 'in'),
  P(5, 'Valorant Points', 'currency', 'Valorant', '🎯', 350, 'Sample VP listing for demo purposes.', [['1,000 VP', 8], ['2,050 VP', 16], ['5,350 VP', 40]], 0, 4.5, 70, 'low'),
  P(6, 'Starforge Odyssey (Demo Key)', 'keys', 'Steam', '🚀', 255, 'Fictional sci-fi RPG. Demo listing only: no real key is delivered.', [['Standard', 29.9], ['Deluxe', 39.9]], 25, 4.7, 80, 'in'),
  P(7, 'Neon Drift Legends (Demo Key)', 'keys', 'Steam', '🏎️', 190, 'Fictional arcade racer. Demo listing only.', [['Standard', 14.9]], 40, 4.4, 66, 'in'),
  P(8, 'Crypt of Ash (Demo Key)', 'keys', 'PC', '💀', 5, 'Fictional roguelike. Demo listing only.', [['Standard', 9.9], ['Collector', 18.9]], 30, 4.3, 55, 'low'),
  P(9, 'Xbox Game Pass Ultimate', 'subs', 'Xbox', '🟩', 130, 'Sample subscription listing. Not a real code.', [['1 month', 15], ['3 months', 42], ['12 months', 150]], 6, 4.8, 88, 'in'),
  P(10, 'PlayStation Plus Essential', 'subs', 'PlayStation', '🔷', 220, 'Sample subscription listing. Not a real code.', [['1 month', 9], ['3 months', 25], ['12 months', 75]], 10, 4.7, 85, 'in'),
  P(11, 'PC Game Pass', 'subs', 'PC', '🖥️', 160, 'Sample subscription listing. Not a real code.', [['1 month', 10], ['3 months', 28]], 15, 4.6, 72, 'in'),
  P(12, 'Steam Gift Card', 'gift', 'Steam', '♨️', 205, 'Sample gift card listing. Not redeemable.', [['$10', 10], ['$25', 25], ['$50', 50]], 4, 4.9, 97, 'in'),
  P(13, 'PlayStation Store Gift Card', 'gift', 'PlayStation', '🎁', 235, 'Sample gift card listing. Not redeemable.', [['$20', 20], ['$50', 50]], 5, 4.8, 82, 'in'),
  P(14, 'Xbox Gift Card', 'gift', 'Xbox', '🎁', 120, 'Sample gift card listing. Not redeemable.', [['$15', 15], ['$25', 25]], 3, 4.6, 64, 'out'),
  P(15, 'StreamKit Pro Overlay Suite', 'software', 'PC', '🎬', 300, 'Fictional streaming overlay software, demo listing.', [['1 year', 39], ['Lifetime', 99]], 20, 4.5, 58, 'in'),
  P(16, 'Voltlink Gaming VPN', 'software', 'PC', '🛡️', 170, 'Fictional low-latency VPN membership, demo listing.', [['1 month', 6], ['12 months', 48]], 35, 4.2, 61, 'in'),
  P(17, 'Genesis Crystals', 'currency', 'Genshin Impact', '✨', 45, 'Sample crystals listing for demo purposes.', [['980 GC', 14], ['3,280 GC', 48]], 0, 4.7, 77, 'in')
];
products.forEach(p => { p.price = p.vars[0][1]; });
const getP = id => products.find(p => p.id === id);
const origOf = (p, price) => p.disc ? price / (1 - p.disc / 100) : price;
const STOCK = { in: ['● In stock', 'ok'], low: ['● Low stock', 'low'], out: ['● Out of stock', 'out'] };

// Generated SVG artwork (no external image requests); also used as the missing-image fallback
const art = p => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${p.hue},75%,45%)"/><stop offset="1" stop-color="hsl(${(p.hue + 60) % 360},80%,18%)"/></linearGradient></defs><rect width="320" height="200" fill="url(#g)"/><circle cx="260" cy="40" r="70" fill="#fff" opacity=".07"/><text x="160" y="118" font-size="72" text-anchor="middle">${p.icon}</text><text x="160" y="176" font-size="15" fill="#fff" opacity=".8" text-anchor="middle" font-family="sans-serif">${esc(p.game)} · sample</text></svg>`);
const FALLBACK = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#12141B"/><text x="160" y="110" font-size="20" fill="#8d92a8" text-anchor="middle" font-family="sans-serif">Image unavailable</text></svg>');
const imgTag = p => `<img src="${art(p)}" alt="${esc(p.name)}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK}'">`;

/* ===== State: cart + discount code persisted in localStorage (demo only, not secure) ===== */
let cart = [], code = '';
try {
  const saved = JSON.parse(localStorage.getItem('vc_cart') || '[]');
  // Re-validate stored data so a tampered/old cart can't break the page
  cart = Array.isArray(saved) ? saved.filter(i => getP(i.pid) && getP(i.pid).vars[i.vi] && Number.isInteger(i.qty) && i.qty > 0).map(i => ({ ...i, qty: Math.min(i.qty, MAX_QTY) })) : [];
  code = CODES[localStorage.getItem('vc_code')] ? localStorage.getItem('vc_code') : '';
} catch (e) { cart = []; }
const save = () => { try { localStorage.setItem('vc_cart', JSON.stringify(cart)); localStorage.setItem('vc_code', code); } catch (e) { /* storage unavailable: cart works for this session only */ } };

let wish = [], recent = [];
try { wish = JSON.parse(localStorage.getItem('vc_wish') || '[]').filter(getP); recent = JSON.parse(localStorage.getItem('vc_recent') || '[]').filter(getP); } catch (e) { wish = []; recent = []; }
const saveW = () => { try { localStorage.setItem('vc_wish', JSON.stringify(wish)); localStorage.setItem('vc_recent', JSON.stringify(recent)); } catch (e) { /* session only */ } };

function toast(msg, bad) {
  const t = document.createElement('div');
  t.className = 'toast' + (bad ? ' bad' : ''); t.textContent = msg;
  $('#toasts').append(t); setTimeout(() => t.remove(), 2800);
}
const clampQty = v => { v = parseInt(v, 10); return Number.isNaN(v) ? 1 : Math.max(1, Math.min(MAX_QTY, v)); };

function addToCart(pid, vi, qty) {
  const p = getP(pid);
  if (!p || !p.vars[vi]) return toast('That product is unavailable.', true);
  if (p.stock === 'out') return toast('This item is out of stock.', true);
  qty = clampQty(qty);
  const line = cart.find(i => i.pid === pid && i.vi === vi); // same product + variant: update quantity
  if (line) { line.qty = Math.min(MAX_QTY, line.qty + qty); if (line.qty === MAX_QTY) toast(`Max ${MAX_QTY} per item reached.`); }
  else cart.push({ pid, vi, qty });
  save(); updateCount(); toast(`Added ${p.name} (${p.vars[vi][0]}) to cart`);
}
const updateCount = () => { $('#cartCount').textContent = cart.reduce((n, i) => n + i.qty, 0); $('#wishCount').textContent = wish.length; };

// Totals are always computed from the cart; nothing is hardcoded
function totals() {
  let list = 0, sub = 0;
  cart.forEach(i => { const p = getP(i.pid), pr = p.vars[i.vi][1]; list += origOf(p, pr) * i.qty; sub += pr * i.qty; });
  const codeOff = code ? sub * CODES[code] / 100 : 0;
  return { list, saleSave: list - sub, sub, codeOff, total: sub - codeOff };
}
const summaryHTML = t => `<div><span>List price</span><span>${money(t.list)}</span></div><div><span>Sale savings</span><span>-${money(t.saleSave)}</span></div>
<div><span>Subtotal</span><span>${money(t.sub)}</span></div>${code ? `<div><span>Code ${code} (${CODES[code]}%)</span><span>-${money(t.codeOff)}</span></div>` : ''}
<div class="tot"><span>Total</span><span>${money(t.total)}</span></div>`;

/* ===== Rendering ===== */
const card = p => {
  const [s, sc] = STOCK[p.stock];
  return `<article class="card"><button class="heart${wish.includes(p.id) ? ' on' : ''}" data-act="wish" data-id="${p.id}" aria-pressed="${wish.includes(p.id)}" aria-label="Toggle wishlist: ${esc(p.name)}">♥</button><a class="im" href="#product/${p.id}">${imgTag(p)}${p.disc ? `<span class="badge">-${p.disc}%</span>` : ''}</a>
<div class="cb"><small>${esc(p.game)} · ${CATS[p.cat][0]}</small><h3><a href="#product/${p.id}">${esc(p.name)}</a></h3>
<div class="meta">★ ${p.rating} · <span class="${sc}">${s}</span></div>
<div class="pr">from <b>${money(p.price)}</b>${p.disc ? `<s>${money(origOf(p, p.price))}</s>` : ''}</div>
<button class="btn" data-act="quick" data-id="${p.id}" ${p.stock === 'out' ? 'disabled' : ''}>${p.stock === 'out' ? 'Sold out' : 'Add to cart'}</button></div></article>`;
};
const rowOf = (title, list, link) => `<h2>${title}${link ? `<a href="${link}">View all</a>` : ''}</h2><div class="grid">${list.map(card).join('')}</div>`;

function renderHome() {
  const by = (f, n) => [...products].sort(f).slice(0, n);
  $('#home').innerHTML = `<div class="hero"><div><h1>Top up fast. <span>Play sooner.</span></h1><p>Game currency, license keys, subscriptions and gift cards in one storefront. This is a demo build with sample listings.</p>
<a class="btn" href="#market">Browse the marketplace</a> <a class="btn ghost" href="#market/currency">Game currency</a></div><div class="art"><span>⚡</span></div></div>
<h2>Shop by category</h2><div class="cats">${Object.entries(CATS).map(([k, [n, i]]) => `<a href="#market/${k}"><i>${i}</i><b>${n}</b><small class="meta">${products.filter(p => p.cat === k).length} listings</small></a>`).join('')}</div>
${rowOf('Special offers', by((a, b) => b.disc - a.disc, 4), '#market')}
${rowOf('Trending now', by((a, b) => b.pop - a.pop, 4), '#market')}
${rowOf('Popular games', ['Roblox', 'Fortnite', 'PUBG', 'Steam'].map(g => products.find(p => p.game === g)), '#market')}
${rowOf('Best sellers', by((a, b) => b.rating * b.pop - a.rating * a.pop, 4))}
${rowOf('Recently added', by((a, b) => b.id - a.id, 4))}
${recent.length ? rowOf('Recently viewed', recent.slice(0, 4).map(getP)) : ''}`;
}

const filt = { q: '', cat: 'all', game: 'all', price: 'all', sort: 'pop' };
function renderMarket(preset) {
  if (preset) filt.cat = CATS[preset] ? preset : 'all';
  const games = [...new Set(products.map(p => p.game))].sort();
  const opt = (v, l, cur) => `<option value="${v}" ${cur === v ? 'selected' : ''}>${l}</option>`;
  $('#market').innerHTML = `<h1>Marketplace</h1><div class="tools">
<input id="fq" type="search" placeholder="Search products…" aria-label="Search" value="${esc(filt.q)}">
<select id="fcat" aria-label="Category">${opt('all', 'All categories', filt.cat)}${Object.entries(CATS).map(([k, [n]]) => opt(k, n, filt.cat)).join('')}</select>
<select id="fgame" aria-label="Game">${opt('all', 'All games', filt.game)}${games.map(g => opt(g, g, filt.game)).join('')}</select>
<select id="fprice" aria-label="Price">${opt('all', 'Any price', filt.price)}${opt('0-10', 'Under $10', filt.price)}${opt('10-30', '$10 – $30', filt.price)}${opt('30-999', '$30+', filt.price)}</select>
<select id="fsort" aria-label="Sort">${opt('pop', 'Most popular', filt.sort)}${opt('low', 'Price: low to high', filt.sort)}${opt('high', 'Price: high to low', filt.sort)}${opt('new', 'Newest', filt.sort)}${opt('rate', 'Top rated', filt.sort)}</select></div><div id="mgrid"></div>`;
  drawGrid();
}
function drawGrid() {
  const q = filt.q.trim().toLowerCase(), [lo, hi] = filt.price === 'all' ? [0, 1e9] : filt.price.split('-').map(Number);
  const list = products.filter(p => (!q || (p.name + ' ' + p.game).toLowerCase().includes(q)) && (filt.cat === 'all' || p.cat === filt.cat) && (filt.game === 'all' || p.game === filt.game) && p.price >= lo && p.price < hi);
  const sorts = { pop: (a, b) => b.pop - a.pop, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, new: (a, b) => b.id - a.id, rate: (a, b) => b.rating - a.rating };
  list.sort(sorts[filt.sort]);
  $('#mgrid').innerHTML = list.length ? `<p class="note">${list.length} result${list.length > 1 ? 's' : ''}</p><div class="grid">${list.map(card).join('')}</div>`
    : `<div class="empty"><i>🔍</i><p>No products match these filters.</p><button class="btn ghost" data-act="reset">Reset filters</button></div>`;
}

let pv = { vi: 0, qty: 1 };
function renderProduct(id, keep) {
  const p = getP(id);
  if (!p) { $('#product').innerHTML = `<div class="empty"><i>❓</i><p>Product not found.</p><a class="btn" href="#market">Back to marketplace</a></div>`; return; }
  if (!keep) { pv = { vi: 0, qty: 1 }; recent = [p.id, ...recent.filter(x => x !== p.id)].slice(0, 8); saveW(); }
  const pr = p.vars[pv.vi][1], [s, sc] = STOCK[p.stock];
  const related = products.filter(x => x.id !== p.id && (x.cat === p.cat || x.game === p.game)).slice(0, 4);
  $('#product').innerHTML = `<p class="note"><a href="#market">← Marketplace</a></p><div class="pd"><div class="big">${imgTag(p)}</div><div>
<small class="meta">${esc(p.game)} · ${CATS[p.cat][0]}</small><h1>${esc(p.name)}</h1><div class="meta">★ ${p.rating} · <span class="${sc}">${s}</span></div>
<div class="price">${money(pr)} ${p.disc ? `<s>${money(origOf(p, pr))}</s> <span class="badge" style="position:static">-${p.disc}%</span>` : ''}</div>
<p class="meta">${esc(p.desc)}</p><p class="note">Demo product with an illustrative price. It is not a genuine or redeemable item.</p>
<div class="opts" role="radiogroup" aria-label="Variant">${p.vars.map((v, i) => `<button class="opt ${i === pv.vi ? 'sel' : ''}" role="radio" aria-checked="${i === pv.vi}" data-act="variant" data-i="${i}" data-id="${p.id}">${esc(v[0])} · ${money(v[1])}</button>`).join('')}</div>
<div class="row"><div class="qty"><button data-act="dec" aria-label="Decrease">−</button><input id="pq" value="${pv.qty}" inputmode="numeric" aria-label="Quantity"><button data-act="inc" aria-label="Increase">+</button></div>
<button class="btn" data-act="addp" data-id="${p.id}" ${p.stock === 'out' ? 'disabled' : ''}>${p.stock === 'out' ? 'Out of stock' : 'Add to cart'}</button><button class="btn ghost" data-act="wish" data-id="${p.id}">♥ Wishlist</button></div></div></div>
${related.length ? rowOf('Related products', related) : ''}`;
}

function renderWishlist() {
  const l = wish.map(getP);
  $('#wishlist').innerHTML = '<h1>Wishlist</h1>' + (l.length ? `<div class="grid">${l.map(card).join('')}</div>`
    : '<div class="empty"><i>♥</i><p>Nothing saved yet. Tap the heart on any product.</p><a class="btn" href="#market">Browse the marketplace</a></div>');
}

function renderCart() {
  if (!cart.length) { $('#cart').innerHTML = `<h1>Your cart</h1><div class="empty"><i>🛒</i><p>Your cart is empty. Add something to get started.</p><a class="btn" href="#market">Continue shopping</a></div>`; return; }
  $('#cart').innerHTML = `<h1>Your cart</h1><div class="lay"><div>${cart.map((i, n) => { const p = getP(i.pid), pr = p.vars[i.vi][1]; return `<div class="line">${imgTag(p)}<div><h3>${esc(p.name)}</h3><div class="meta">${esc(p.vars[i.vi][0])} · ${money(pr)} each</div><button class="rm" data-act="rm" data-n="${n}">Remove</button></div>
<div><div class="qty"><button data-act="cdec" data-n="${n}" aria-label="Decrease">−</button><input value="${i.qty}" data-n="${n}" class="cq" inputmode="numeric" aria-label="Quantity"><button data-act="cinc" data-n="${n}" aria-label="Increase">+</button></div><div style="text-align:right;margin-top:6px"><b>${money(pr * i.qty)}</b></div></div></div>`; }).join('')}
<div class="row"><a class="btn ghost" href="#market">Continue shopping</a><button class="btn ghost" data-act="clear">Clear cart</button></div></div>
<aside class="sum">${summaryHTML(totals())}${codeBox()}<a class="btn" href="#checkout">Proceed to checkout</a></aside></div>`;
}
const codeBox = () => `<div class="codebox"><input id="codeIn" placeholder="Discount code" aria-label="Discount code" value="${esc(code)}"><button class="btn ghost" data-act="code">Apply</button></div><p class="note" style="margin:0">Demo codes: VOLT10, PLAY15, WELCOME5</p>`;

function renderCheckout() {
  if (!cart.length) { location.hash = '#cart'; return; }
  $('#checkout').innerHTML = `<h1>Checkout</h1><p class="warn">Demo checkout: no payment is taken, no card details are collected and no real order is placed.</p><div class="lay"><form id="coForm" novalidate>
<label>Full name<input name="name" autocomplete="name"></label><label>Email<input name="email" type="email" autocomplete="email"></label>
<label>Game ID / username (optional)<input name="gid"></label><label>Order notes (optional)<textarea name="note" rows="3"></textarea></label>
<label class="chk"><input type="checkbox" name="tos"> I understand this is a demo and agree to the <a href="#terms" style="color:var(--b)">Terms</a></label>
<p class="err" id="coErr" role="alert"></p><button class="btn" type="submit">Place demo order</button></form>
<aside class="sum">${cart.map(i => { const p = getP(i.pid); return `<div><span>${i.qty}× ${esc(p.name)} (${esc(p.vars[i.vi][0])})</span><span>${money(p.vars[i.vi][1] * i.qty)}</span></div>`; }).join('')}<hr style="border-color:var(--line);margin:8px 0">${summaryHTML(totals())}${codeBox()}</aside></div>`;
}

/* ===== Router ===== */
function route() {
  const [v, arg] = (location.hash.slice(1) || 'home').split('/');
  const id = document.getElementById(v)?.classList.contains('view') ? v : 'home';
  document.querySelectorAll('.view').forEach(s => { s.hidden = s.id !== id; });
  const r = { wishlist: renderWishlist, home: renderHome, market: () => renderMarket(arg), product: () => renderProduct(parseInt(arg, 10)), cart: renderCart, checkout: renderCheckout }[id];
  if (r) r();
  const h = $('#' + id + ' h1'); document.title = (h ? h.textContent + ' – ' : '') + 'Voltcrate';
  if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); } // move focus for screen-reader and keyboard users
  $('#menu').classList.remove('open'); window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);

/* ===== Events (delegated) ===== */
const rerender = () => {
  const v = (location.hash.slice(1) || 'home').split('/')[0];
  if (v === 'cart') return renderCart();
  if (v !== 'checkout') return;
  const f = $('#coForm'), keep = f ? Object.fromEntries(new FormData(f)) : {}; // keep typed details when the summary redraws
  renderCheckout();
  const nf = $('#coForm'); if (nf) Object.entries(keep).forEach(([k, val]) => { const el = nf.elements[k]; if (el) el.type === 'checkbox' ? (el.checked = true) : (el.value = val); });
};
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const d = b.dataset, n = +d.n, pq = $('#pq');
  switch (d.act) {
    case 'wish': {
      const id = +d.id, on = !wish.includes(id);
      wish = on ? [...wish, id] : wish.filter(x => x !== id); saveW(); updateCount();
      toast(on ? 'Saved to wishlist' : 'Removed from wishlist');
      if (location.hash === '#wishlist') renderWishlist();
      else document.querySelectorAll(`[data-act="wish"][data-id="${id}"]`).forEach(h => { h.classList.toggle('on', on); h.setAttribute('aria-pressed', on); });
      break;
    }
    case 'quick': addToCart(+d.id, 0, 1); break;
    case 'variant': pv.vi = +d.i; pv.qty = clampQty(pq && pq.value); renderProduct(+d.id, true); break;
    case 'inc': pq.value = clampQty(+pq.value + 1); break;
    case 'dec': pq.value = clampQty(+pq.value - 1); break;
    case 'addp': { const q = parseInt(pq.value, 10); if (!(q >= 1 && q <= MAX_QTY)) { pq.value = clampQty(pq.value); return toast(`Quantity must be 1–${MAX_QTY}.`, true); } addToCart(+d.id, pv.vi, q); break; }
    case 'cinc': cart[n].qty = Math.min(MAX_QTY, cart[n].qty + 1); save(); updateCount(); rerender(); break;
    case 'cdec': cart[n].qty = Math.max(1, cart[n].qty - 1); save(); updateCount(); rerender(); break;
    case 'rm': cart.splice(n, 1); save(); updateCount(); rerender(); toast('Item removed'); break;
    case 'clear': cart = []; save(); updateCount(); rerender(); toast('Cart cleared'); break;
    case 'reset': Object.assign(filt, { q: '', cat: 'all', game: 'all', price: 'all', sort: 'pop' }); renderMarket(); break;
    case 'code': {
      const c = $('#codeIn').value.trim().toUpperCase();
      if (!c) { code = ''; toast('Code removed'); } else if (CODES[c]) { code = c; toast(`Code ${c} applied: ${CODES[c]}% off`); } else return toast('Invalid discount code.', true);
      save(); rerender(); break;
    }
  }
});
document.addEventListener('change', e => { // typed quantities in the cart
  if (!e.target.classList.contains('cq')) return;
  const n = +e.target.dataset.n, q = parseInt(e.target.value, 10);
  if (!(q >= 1 && q <= MAX_QTY)) toast(`Quantity must be 1–${MAX_QTY}.`, true);
  cart[n].qty = clampQty(e.target.value); save(); updateCount(); renderCart();
});
document.addEventListener('input', e => { // marketplace filters
  const m = { fq: 'q', fcat: 'cat', fgame: 'game', fprice: 'price', fsort: 'sort' }[e.target.id];
  if (m) { filt[m] = e.target.value; drawGrid(); }
});
document.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, fd = Object.fromEntries(new FormData(f)), mail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (f.id === 'contactForm') {
    const err = !fd.name.trim() ? 'Enter your name.' : !mail.test(fd.email.trim()) ? 'Enter a valid email address.' : fd.msg.trim().length < 10 ? 'Message must be at least 10 characters.' : '';
    $('#contactErr').textContent = err; if (!err) { f.reset(); toast('Message noted (demo: nothing was sent)'); }
  } else if (f.id === 'coForm') {
    const err = fd.name.trim().length < 2 ? 'Enter your full name.' : !mail.test(fd.email.trim()) ? 'Enter a valid email address.' : !fd.tos ? 'Please confirm you understand this is a demo.' : '';
    $('#coErr').textContent = err; if (err) return;
    const t = totals(), ref = 'DEMO-' + Date.now().toString(36).toUpperCase();
    $('#done').innerHTML = `<div class="done"><i>✅</i><h1>Demo order complete</h1><p class="meta">Reference ${ref}. Thanks, <span id="dn"></span>.</p><p class="meta">Total shown: ${money(t.total)}. No payment was taken and nothing will be delivered.</p><a class="btn" href="#home">Back to home</a></div>`;
    $('#dn').textContent = fd.name.trim(); // textContent avoids injecting user input as HTML
    cart = []; code = ''; save(); updateCount(); location.hash = '#done';
  }
});
$('#menuBtn').addEventListener('click', () => { const o = $('#menu').classList.toggle('open'); $('#menuBtn').setAttribute('aria-expanded', o); });

/* Theme (dark default, follows system preference until the user chooses) */
let th = 'dark';
try { th = localStorage.getItem('vc_theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'); } catch (e) { /* keep dark */ }
document.documentElement.dataset.theme = th;
$('#themeBtn').addEventListener('click', () => {
  th = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'; document.documentElement.dataset.theme = th;
  try { localStorage.setItem('vc_theme', th); } catch (e) { /* ignore */ }
});
/* "/" jumps to marketplace search, like many docs sites */
document.addEventListener('keydown', e => {
  if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) { e.preventDefault(); location.hash = '#market'; setTimeout(() => { const q = $('#fq'); if (q) q.focus(); }, 0); }
});

updateCount(); route();
window.addEventListener('load', () => setTimeout(() => $('#loader').classList.add('off'), 350));
