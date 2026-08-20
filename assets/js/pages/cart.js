/* ============================================================
   CART.JS — Stride Shopping Cart Logic
   ============================================================
   
   Engineering Overview
   --------------------
   This module follows a unidirectional data-flow pattern:
   
     localStorage (source of truth)
       ↓  read
     State (in-memory cart array)
       ↓  render
     DOM (UI reflects current state)
       ↓  user action (event delegation)
     Mutate State → persist to localStorage → re-render
   
   Key Design Decisions:
   
   1. EVENT DELEGATION — A single event listener on the cart
      container handles all clicks (qty ±, remove). This is
      O(1) listener attachment vs O(n) per-button listeners,
      and automatically works for dynamically-injected HTML.
   
   2. DATA ATTRIBUTES — Each cart item card carries
      `data-product-id` so click handlers can instantly
      identify which product to mutate without DOM traversal.
   
   3. IMMUTABLE RE-RENDER — After any mutation, the full
      summary is recalculated from the source array. This
      prevents desync between individual DOM nodes.
   
   4. ANIMATION — Items use CSS @keyframes for entrance and
      exit. Removal waits for the animation to complete before
      actually removing the DOM node (animationend event).
   
   ============================================================ */

import { products } from "../../../data.js";

// ======================== CONSTANTS ==========================

const STORAGE_KEY = 'cartProducts';
const FREE_SHIPPING_THRESHOLD = 75;
const STANDARD_SHIPPING = 5;
const TAX_RATE = 0.08; // 8% estimated tax

// ======================== CART PRODUCT LOCALSTORAGE ==========================

const cartProducts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ======================== STATE ==============================

/**
 * Loads cart from localStorage. Falls back to MOCK_CART on
 * first visit, and immediately persists the mock so that
 * subsequent page loads read from storage.
 */
function loadCart() {
  try {
    
    if (cartProducts.length > 0) {
      if (Array.isArray(cartProducts) ) return cartProducts;
    }
  } catch (e) {
    console.warn('[Stride Cart] Could not parse localStorage, using mock data.', e);
  }

  // First visit → seed with mock data
  saveCart(cartProducts);
  return [...cartProducts];
}

/** Persist current cart array to localStorage */
function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

// Active cart state
let cart = loadCart();
let discountPercent = 0;


// ======================== DOM REFS ===========================

const cartContainer = document.getElementById('cart-items-container');
const cartSection = document.getElementById('cart-section');
const cartBottomActions = document.getElementById('cart-bottom-actions');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryShipping = document.getElementById('summary-shipping');
const summaryTax = document.getElementById('summary-tax');
const summaryTotal = document.getElementById('summary-total');
const freeShippingMsg = document.getElementById('free-shipping-msg');
const btnClearCart = document.getElementById('btn-clear-cart');
const btnCheckout = document.getElementById('btn-checkout');
const emptyCartTemplate = document.getElementById('empty-cart-template');

// Promo Code DOM Elements
const promoInput = document.getElementById('promo-input');
const btnApplyPromo = document.getElementById('btn-apply-promo');
const discountRow = document.getElementById('discount-row');
const summaryDiscount = document.getElementById('summary-discount');


// ======================== RENDERERS ==========================

/**
 * Renders a single cart item as an HTML string.
 * Uses Bootstrap's row/col grid for desktop and stacks on mobile.
 */
function renderCartItem(item) {
  const itemTotal = item.price * item.quantity;
  const originalPriceHTML = item.originalPrice
    ? `<span class="cart-item-original-price ms-1">$${item.originalPrice}</span>`
    : '';

  // Get the original product data to populate dropdowns
  const product = products.find(p => Number(p.id) === Number(item.id));
  
  let colorSelectHTML = `<span>Color: ${item.color}</span>`;
  if (product && product.colorNames && product.colorNames.length > 0) {
    colorSelectHTML = `
      <select class="variant-select form-select form-select-sm d-inline-block w-auto" data-action="update-variant" data-type="color">
        ${product.colorNames.map(color => `
          <option value="${color}" ${color === item.color ? 'selected' : ''}>${color}</option>
        `).join('')}
      </select>
    `;
  }

  let sizeSelectHTML = `<span>Size: ${item.size}</span>`;
  if (product && product.sizes && product.sizes.length > 0) {
    sizeSelectHTML = `
      <select class="variant-select form-select form-select-sm d-inline-block w-auto" data-action="update-variant" data-type="size">
        ${product.sizes.map(size => `
          <option value="${size}" ${String(size) === String(item.size) ? 'selected' : ''}>${size}</option>
        `).join('')}
      </select>
    `;
  }

  return `
    <div class="cart-item-card row align-items-center" data-product-id="${item.id}" data-product-color="${item.color}" data-product-size="${item.size}">

      <!-- Product (Image + Info) -->
      <div class="col-md-5 d-flex align-items-center gap-3 mb-3 mb-md-0">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" loading="lazy" />
        <div>
          <p class="cart-item-name mb-1">${item.name}</p>
          <div class="cart-item-meta d-flex gap-2 align-items-center">
            ${sizeSelectHTML}
            ${colorSelectHTML}
          </div>
        </div>
      </div>

      <!-- Price -->
      <div class="col-4 col-md-2 text-md-center">
        <span class="cart-item-price">$${item.price}</span>
        ${originalPriceHTML}
      </div>

      <!-- Quantity -->
      <div class="col-4 col-md-3 text-md-center">
        <div class="qty-control">
          <button class="qty-btn" data-action="decrease" aria-label="Decrease quantity">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" data-action="increase" aria-label="Increase quantity">+</button>
        </div>
      </div>

      <!-- Total + Remove -->
      <div class="col-4 col-md-2 text-end d-flex align-items-center justify-content-end gap-2">
        <span class="cart-item-total">$${itemTotal}</span>
        <button class="btn-remove-item" data-action="remove" aria-label="Remove ${item.name} from cart">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

    </div>
  `;
}

/**
 * Full re-render of the cart items list.
 * Checks for empty state and toggles UI accordingly.
 */
function renderCart() {
  if (cart.length === 0) {
    showEmptyState();
    return;
  }

  // Build all item HTML
  cartContainer.innerHTML = cart.map(renderCartItem).join('');

  // Make sure the items section and actions are visible
  cartBottomActions.style.display = '';
  document.querySelector('.cart-table-header')?.classList.remove('d-none');
  document.querySelector('.cart-table-header')?.classList.add('d-md-flex');

  // Recalculate prices
  updateSummary();
}

/**
 * Shows the "empty cart" UI from the <template>.
 */
function showEmptyState() {
  const fragment = emptyCartTemplate.content.cloneNode(true);
  cartContainer.innerHTML = '';
  cartContainer.appendChild(fragment);

  // Hide table header + bottom actions
  cartBottomActions.style.display = 'none';
  document.querySelector('.cart-table-header')?.classList.add('d-none');
  document.querySelector('.cart-table-header')?.classList.remove('d-md-flex');
}


// ======================== PRICING LOGIC ======================

/**
 * Recalculates subtotal, shipping, tax, and grand total.
 * Implements the free-shipping threshold logic:
 *   - Subtotal >= $75 → shipping = FREE
 *   - Subtotal <  $75 → shipping = $5, show remaining amount
 */
function updateSummary() {
  // 1. Subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 2. Discount Calculation (Simple if statement check)
  let discountAmount = 0;
  if (discountPercent > 0) {
    discountAmount = (subtotal * discountPercent) / 100;
  }

  const discountedSubtotal = subtotal - discountAmount;

  // 3. Shipping
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = isFreeShipping ? 0 : STANDARD_SHIPPING;

  // 4. Tax
  const tax = Math.round(discountedSubtotal * TAX_RATE * 100) / 100;

  // 5. Grand Total
  const total = discountedSubtotal + shipping + tax;

  // ---- Update DOM ----

  animateValue(summarySubtotal, `$${subtotal}`);
  animateValue(summaryTotal, `$${total.toFixed(total % 1 === 0 ? 0 : 2)}`);
  animateValue(summaryTax, `$${tax.toFixed(tax % 1 === 0 ? 0 : 2)}`);

  // Update Discount UI
  if (discountRow && summaryDiscount) {
    if (discountAmount > 0) {
      discountRow.classList.remove('d-none');
      summaryDiscount.textContent = `-$${discountAmount.toFixed(2)}`;
    } else {
      discountRow.classList.add('d-none');
    }
  }

  // Shipping display
  if (isFreeShipping) {
    summaryShipping.textContent = 'FREE';
    summaryShipping.classList.add('shipping-free');
  } else {
    summaryShipping.textContent = `$${shipping}`;
    summaryShipping.classList.remove('shipping-free');
  }

  // Free shipping promotional message
  updateFreeShippingMsg(subtotal, isFreeShipping);
}

/**
 * Updates the #free-shipping-msg container.
 * Two states:
 *   REMAINING → "You're $X away from free shipping!"
 *   ACHIEVED  → "You qualify for free shipping! 🎉"
 */
function updateFreeShippingMsg(subtotal, isFree) {
  if (isFree) {
    freeShippingMsg.className = 'free-shipping-msg text-xs achieved';
    freeShippingMsg.innerHTML = '🎉 You qualify for free shipping!';
  } else {
    const remaining = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(
      (FREE_SHIPPING_THRESHOLD - subtotal) % 1 === 0 ? 0 : 2
    );
    freeShippingMsg.className = 'free-shipping-msg text-xs remaining';
    freeShippingMsg.innerHTML = `🛒 Add <strong>$${remaining}</strong> more to get <strong>free shipping</strong>!`;
  }
}

/**
 * Micro-animation utility: briefly applies .price-updated
 * class for a CSS pulse, then updates text content.
 */
function animateValue(el, newValue) {
  if (el.textContent !== newValue) {
    el.textContent = newValue;
    el.classList.add('price-updated');
    el.addEventListener('animationend', () => el.classList.remove('price-updated'), { once: true });
  }
}


// ======================== EVENT HANDLERS =====================

/**
 * EVENT DELEGATION — Single listener on the cart container.
 *
 * Why delegation?
 *   • Cart items are dynamically generated — listeners on
 *     individual buttons would need to be re-attached on
 *     every render.
 *   • One listener is cheaper than N listeners (perf).
 *   • The `data-action` attribute on each button tells us
 *     what to do; `closest('[data-product-id]')` gives us
 *     the target product.
 */
cartContainer.addEventListener('click', (e) => {
  const actionBtn = e.target.closest('[data-action]');
  if (!actionBtn) return; // Click was not on an action element

  const card = actionBtn.closest('[data-product-id]');
  if (!card) return;

  const productId = card.dataset.productId;
  const color = card.dataset.productColor;
  const size = card.dataset.productSize;
  const action = actionBtn.dataset.action;

  switch (action) {
    case 'increase':
      changeQuantity(productId, color, size, 1);
      break;
    case 'decrease':
      changeQuantity(productId, color, size, -1);
      break;
    case 'remove':
      removeItem(productId, color, size, card);
      break;
  }
});

/**
 * Handle variant (color/size) dropdown changes
 */
cartContainer.addEventListener('change', (e) => {
  const selectBtn = e.target.closest('[data-action="update-variant"]');
  if (!selectBtn) return;

  const card = selectBtn.closest('[data-product-id]');
  if (!card) return;

  const productId = card.dataset.productId;
  const oldColor = card.dataset.productColor;
  const oldSize = card.dataset.productSize;

  // Find the exact item we are modifying
  const itemIndex = cart.findIndex((p) => Number(p.id) === Number(productId) && p.color === oldColor && String(p.size) === String(oldSize));
  if (itemIndex === -1) return;
  const item = cart[itemIndex];

  // Get the product from original data to find the new image if color changed
  const product = products.find(p => Number(p.id) === Number(productId));
  
  let newColor = oldColor;
  let newSize = oldSize;

  if (selectBtn.dataset.type === 'color') {
    newColor = selectBtn.value;
    if (product && product.colorNames) {
      const colorIndex = product.colorNames.indexOf(newColor);
      if (colorIndex !== -1 && product.colorImages && product.colorImages[colorIndex]) {
        item.image = product.colorImages[colorIndex];
      }
    }
  } else if (selectBtn.dataset.type === 'size') {
    newSize = selectBtn.value;
  }

  // Check if changing this variant causes a collision with an existing item in the cart
  const collisionIndex = cart.findIndex((p, idx) => 
    idx !== itemIndex && 
    Number(p.id) === Number(productId) && 
    p.color === newColor && 
    String(p.size) === String(newSize)
  );

  if (collisionIndex !== -1) {
    // Collision! Merge them
    cart[collisionIndex].quantity += item.quantity;
    cart.splice(itemIndex, 1);
  } else {
    // No collision, just update the item
    item.color = newColor;
    item.size = newSize;
  }

  saveCart(cart);
  renderCart();
});

/**
 * Modifies item quantity by `delta` (+1 or -1).
 * Prevents quantity from dropping below 1.
 */
function changeQuantity(productId, color, size, delta) {
  const item = cart.find((p) => Number(p.id) === Number(productId) && p.color === color && String(p.size) === String(size));
  if (!item) return;

  const newQty = item.quantity + delta;
  if (newQty < 1) return; // Guard: never go below 1

  item.quantity = newQty;
  saveCart(cart);
  renderCart(); // Re-render to reflect new qty & totals
}

/**
 * Removes an item with a slide-out animation.
 * Waits for CSS animationend before mutating state, so the
 * user sees a smooth exit instead of an abrupt DOM removal.
 */
function removeItem(productId, color, size, cardEl) {
  // Trigger exit animation
  cardEl.classList.add('cart-item-removing');

  cardEl.addEventListener('animationend', () => {
    // Mutate state
    cart = cart.filter((p) => !(Number(p.id) === Number(productId) && p.color === color && String(p.size) === String(size)));
    saveCart(cart);
    renderCart();
  }, { once: true });
}

/**
 * Clears the entire cart.
 */
btnClearCart.addEventListener('click', () => {
  cart = [];
  saveCart(cart);
  renderCart();
});

/**
 * Redirect to checkout page.
 */
if (btnCheckout) {
  btnCheckout.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    window.location.href = 'checkout.html';
  });
}


// ======================== PROMO CODE LOGIC ===================

/**
 * Handles applying promo code using simple IF statements.
 */
if (btnApplyPromo && promoInput) {
  btnApplyPromo.addEventListener('click', () => {
    const code = promoInput.value.trim().toUpperCase();

    // Simple IF statement to check promo code
    if (code === 'STRIDE20') {
      discountPercent = 20;
      alert('Promo code STRIDE20 applied! You got 20% off.');
    } else if (code === '') {
      discountPercent = 0;
      alert('Please enter a promo code.');
    } else {
      discountPercent = 0;
      alert('Invalid promo code.');
    }

    updateSummary();
  });
}


// ======================== INIT ===============================

// Initial render on page load
renderCart();
