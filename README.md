# ⚡ Voltcrate: Demo Gaming Marketplace

A dependency-free, single-page storefront for game currency, license keys, subscriptions, gift cards and software. Pure HTML, CSS and vanilla JavaScript. No build step, no framework, no server.

> **Everything here is sample data.** No real keys are sold, no payment is taken, and no message or order is sent anywhere. It exists for design, UI testing and learning.

---

## Table of contents

1. [Features](#features)
2. [Quick start](#quick-start)
3. [Project structure](#project-structure)
4. [How it works](#how-it-works)
5. [Routes](#routes)
6. [Data model](#data-model)
7. [Customizing](#customizing)
8. [Persistence and storage keys](#persistence-and-storage-keys)
9. [Accessibility](#accessibility)
10. [Keyboard shortcuts](#keyboard-shortcuts)
11. [Theming](#theming)
12. [Security notes](#security-notes)
13. [Deployment](#deployment)
14. [Manual test checklist](#manual-test-checklist)
15. [Troubleshooting](#troubleshooting)
16. [Going to production](#going-to-production)
17. [Roadmap](#roadmap)
18. [Changelog](#changelog)

---

## Features

**Browsing**
- Home page with hero, category tiles and five curated rows: Special offers, Trending, Popular games, Best sellers, Recently added, plus **Recently viewed** once you have opened products.
- Marketplace with live text search, category / game / price filters and sorting (popular, price low-high, price high-low, newest, **top rated**).
- Product pages with variants (e.g. `800 R$`, `1,700 R$`), quantity picker, stock status, discount badge and related products.
- Generated SVG artwork, so there are zero external image requests, with a built-in "Image unavailable" fallback.

**Buying**
- Cart with per-line quantity, removal, clear-all, and totals computed from data (never hard-coded): list price, sale savings, subtotal, code discount, total.
- Discount codes: `VOLT10` (10%), `PLAY15` (15%), `WELCOME5` (5%).
- Demo checkout with validation and a reference number. Typed details **survive applying a discount code**.

**Quality of life**
- **Wishlist** (heart on every card and product page) with a header counter.
- **Light / dark theme** toggle that starts from your system preference and remembers your choice.
- Cart, code, wishlist, recently viewed and theme persist in `localStorage`.
- Toast notifications, loading screen, FAQ, About, Contact (validated), Terms and Privacy pages.
- Responsive layout with a mobile menu, reduced-motion support and a print stylesheet.

---

## Quick start

Open `index.html` directly in a browser. That's it.

For a more realistic setup (recommended, since some browsers restrict `localStorage` on `file://`), serve the folder:

```bash
# Python 3
python3 -m http.server 8080

# or Node
npx serve .
```

Then visit <http://localhost:8080>.

---

## Project structure

```
.
├── index.html   # Shell: header, empty <section> view containers, footer, static pages
├── style.css    # All styling, CSS variables, responsive rules, light theme
├── script.js    # Data, state, rendering, router, events
└── README.md    # You are here
```

---

## How it works

### Views and the router
`index.html` contains one empty `<section class="view" id="...">` per screen. A tiny hash router in `script.js` reads `location.hash`, shows the matching section, hides the rest, and calls that view's render function. Each render function rebuilds its section's `innerHTML` from state, so the DOM is always a pure function of data.

On every navigation the router also:
- updates `document.title` from the page's `<h1>`,
- moves keyboard focus to that `<h1>` (so screen-reader users hear where they landed),
- closes the mobile menu and scrolls to top.

### Event handling
One delegated `click` listener handles every button via a `data-act` attribute (`quick`, `wish`, `variant`, `inc`, `dec`, `addp`, `cinc`, `cdec`, `rm`, `clear`, `reset`, `code`). Separate delegated listeners handle `change` (cart quantities), `input` (marketplace filters) and `submit` (contact and checkout). This keeps listeners to a handful no matter how many cards exist.

### Money
Prices are plain numbers; `money(n)` formats them with two decimals. The "original" crossed-out price is derived from the discount percentage via `origOf(product, price)`, so a product's discount only needs to be defined once.

---

## Routes

| Hash | View |
|---|---|
| `#home` (default) | Home |
| `#market` | Marketplace, all products |
| `#market/<category>` | Marketplace preset to a category (`currency`, `keys`, `subs`, `gift`, `software`) |
| `#product/<id>` | Product detail |
| `#wishlist` | Saved products |
| `#cart` | Cart |
| `#checkout` | Demo checkout (redirects to cart if empty) |
| `#done` | Order confirmation |
| `#about` `#faq` `#contact` `#terms` `#privacy` | Static pages |

Unknown hashes fall back to Home; unknown product ids show a friendly "Product not found" state.

---

## Data model

Products are created with a compact helper:

```js
P(id, name, category, game, icon, hue, description, variants, discount%, rating, popularity, stock)
```

| Field | Type | Notes |
|---|---|---|
| `id` | number | Unique, also used for "Newest" sorting |
| `cat` | string | Key of the `CATS` object |
| `game` | string | Powers the game filter and "Popular games" row |
| `icon`, `hue` | emoji, 0-360 | Drive the generated SVG artwork |
| `vars` | `[[label, price], ...]` | At least one variant; first is the default |
| `disc` | number | Percent off; `0` hides the badge |
| `stock` | `'in' \| 'low' \| 'out'` | `'out'` disables add-to-cart |

Cart lines are `{ pid, vi, qty }`: product id, variant index, quantity (1 to `MAX_QTY`, currently 10).

---

## Customizing

**Add a product**: append a line to the `products` array:

```js
P(18, 'Apex Coins', 'currency', 'Apex Legends', '🎯', 10, 'Sample coins listing.', [['1,000', 10], ['2,150', 20]], 5, 4.6, 74, 'in'),
```

**Add a category**: add an entry to `CATS` (`key: ['Label', 'emoji']`). Tiles, filters and routes (`#market/key`) appear automatically.

**Add a discount code**: add `CODENAME: percent` to `CODES`. The FAQ and the hint under the code box list codes as text, so update those too.

**Change the quantity cap**: edit `MAX_QTY`.

**Change brand colors**: edit the CSS variables at the top of `style.css` (`--p` purple, `--b` cyan, `--g` gradient).

---

## Persistence and storage keys

All data stays in your browser. Nothing is sent to a server.

| Key | Contents |
|---|---|
| `vc_cart` | Array of `{ pid, vi, qty }` |
| `vc_code` | Active discount code or empty string |
| `vc_wish` | Array of wishlisted product ids |
| `vc_recent` | Up to 8 recently viewed product ids |
| `vc_theme` | `dark` or `light` |

Stored data is **re-validated on load**: unknown products, bad variants and invalid quantities are dropped, so a stale or hand-edited value cannot break the page. If storage is blocked (private mode, strict settings), the app still works for the current session.

To reset everything: clear site data, or run `localStorage.clear()` in the console.

---

## Accessibility

- Skip-to-content link, landmarks (`header`, `nav`, `main`, `footer`) and visible `:focus-visible` outlines.
- Route changes update the page title and move focus to the new heading.
- Icon-only controls have `aria-label`s; the wishlist hearts expose `aria-pressed`; variant buttons use `role="radio"` with `aria-checked`.
- Toasts live in an `aria-live="polite"` region; form errors use `role="alert"`.
- `prefers-reduced-motion` disables animation and transitions.
- A `<noscript>` notice explains the JavaScript requirement.

---

## Keyboard shortcuts

| Key | Action |
|---|---|
| `/` | Jump to marketplace search (ignored while typing in a field) |
| `Tab` / `Shift+Tab` | Move through controls; the first stop is "Skip to content" |
| `Enter` / `Space` | Activate buttons |

---

## Theming

Dark is the default. The first visit follows `prefers-color-scheme`; the ◐ button in the header toggles and remembers your choice. Light mode is implemented as a `[data-theme=light]` block that redefines the CSS variables and overrides the few hard-coded dark surfaces (nav, mobile menu, banner, loader).

---

## Security notes

This is a front-end demo, but it follows good habits you can carry forward:

- **Escaping**: every piece of user- or data-derived text inserted via `innerHTML` goes through `esc()`. The checkout confirmation uses `textContent` for the customer's name.
- **No external requests**: artwork is generated inline as SVG data URIs.
- **Validated storage**: see above.
- **No secrets**: there is nothing to leak; there is also nothing secure. `localStorage` is readable by any script on the page and is **not** a place for real sessions, tokens or payment data.

---

## Deployment

It is a static site, so any static host works:

- **GitHub Pages**: push the folder, enable Pages on the branch.
- **Netlify / Vercel / Cloudflare Pages**: drag-and-drop or connect the repo; no build command, publish directory `.`.
- **Any web server**: copy the four files.

Because routing uses `#hashes`, no server rewrite rules are needed.

---

## Manual test checklist

- [ ] Home loads; the loader fades out; all rows show cards.
- [ ] Search narrows results live; **Reset filters** restores everything.
- [ ] Price filter edges: "Under $10" excludes a $10.00 product.
- [ ] Sorting, including **Top rated**, reorders as expected.
- [ ] Product page: switching variant updates price and keeps quantity.
- [ ] Out-of-stock items cannot be added from cards or product pages.
- [ ] Adding the same product and variant twice merges into one line; quantity stops at 10.
- [ ] Typing `0` or `99` as a quantity shows a toast and clamps.
- [ ] Each discount code applies; an invalid code shows an error; clearing removes it.
- [ ] Checkout: fill in details, apply a code, and confirm the form values remain.
- [ ] Placing a demo order empties the cart and shows a reference.
- [ ] Wishlist hearts toggle on cards and the product page; the header count updates; the list survives reload.
- [ ] Theme toggle works and persists.
- [ ] Press `/` on any page to reach the search box.
- [ ] Resize below 820 px: the mobile menu opens and closes.
- [ ] Tab through the page with only the keyboard.

---

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Cart or wishlist doesn't persist | Private browsing or blocked storage. The app still works for the session. |
| Page stuck on the spinner | JavaScript error: open DevTools → Console. The loader hides on `window.load`. |
| Emoji look different per device | Emoji are rendered by the OS font; this is expected. |
| Old data after editing products | Stored ids that no longer exist are dropped automatically; clear storage if in doubt. |
| `/` doesn't focus search | You are typing in a field, or a browser extension is capturing the key. |

---

## Going to production

To turn this into a real store you would need, at minimum:

1. **A backend and database** for catalog, inventory, orders and users.
2. **A payment provider** (hosted checkout) so card data never touches your code.
3. **Authentication** and server-side sessions.
4. **Server-side price and discount calculation**: never trust totals computed in the browser.
5. **Secure digital delivery** and fraud / abuse controls for keys and top-ups.
6. **Legal review**: real Terms, Privacy Policy, refund policy, tax handling, and the licensing rights for anything you sell.
7. **Monitoring, backups and a test suite.**

---

## Roadmap

- Persist marketplace filters in the URL
- Order history page
- Product reviews (sample data)
- i18n and multi-currency display
- Automated tests for totals, cart merging and storage validation

---

## Changelog

**v2.0**
- Added wishlist, recently viewed, light/dark theme, "Top rated" sort and the `/` search shortcut.
- Router now updates the page title and moves focus on navigation; added skip link, meta description and `<noscript>` notice.
- Fixed checkout form values being wiped when applying or removing a discount code.
- Added print styles and a card-level heart button.
- Rewrote this README.

**v1.0**: Initial demo store.
