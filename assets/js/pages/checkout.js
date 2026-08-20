/* ============================================================
   CHECKOUT.JS — Stride Checkout Logic
   ============================================================ */

const STORAGE_CART_KEY = 'cartProducts';
const STORAGE_ORDER_KEY = 'stride_last_order';
const FREE_SHIPPING_THRESHOLD = 75;
const STANDARD_SHIPPING = 5;
const TAX_RATE = 0.08;

// ======================== DOM REFS ===========================
const form = document.getElementById('checkout-form');
const paymentRadios = document.querySelectorAll('.payment-radio');
const paymentOptionCards = document.querySelectorAll('.payment-option-card');
const ccDetails = document.getElementById('cc-details');
const walletDetails = document.getElementById('wallet-details');

const summarySubtotal = document.getElementById('summary-subtotal');
const summaryShipping = document.getElementById('summary-shipping');
const summaryTax = document.getElementById('summary-tax');
const summaryTotal = document.getElementById('summary-total');
const checkoutItemsContainer = document.getElementById('checkout-items');

// CC Inputs
const ccNumber = document.getElementById('cc-number');
const ccExp = document.getElementById('cc-exp');
const ccCvv = document.getElementById('cc-cvv');

// Wallet Inputs
const walletReceipt = document.getElementById('wallet-receipt');
const receiptFilename = document.getElementById('receipt-filename');
const receiptError = document.getElementById('receipt-error');

let receiptBase64 = null;
let cart = JSON.parse(localStorage.getItem(STORAGE_CART_KEY)) || [];
let orderTotals = { subtotal: 0, shipping: 0, tax: 0, total: 0 };

// ======================== INIT ===============================

function init() {
  loadCart();
  if (cart.length === 0) {
    // If cart is empty, redirect to cart page
    window.location.href = 'cart.html';
    return;
  }
  renderSummary();
  setupPaymentToggle();
  setupWalletUpload();
  setupFormValidation();
}

// ======================== CART & SUMMARY =====================

function loadCart() {
  try {
    const stored = localStorage.getItem(STORAGE_CART_KEY);
    if (stored) {
      cart = JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load cart', e);
  }
}

function renderSummary() {
  // Render mini items
  checkoutItemsContainer.innerHTML = cart.map(item => `
    <div class="mini-product">
      <img src="${item.image}" alt="${item.name}" class="mini-product-img">
      <div class="mini-product-details">
        <h4 class="mini-product-name">${item.name}</h4>
        <span class="mini-product-meta">Qty: ${item.quantity}</span>
      </div>
      <div class="mini-product-price">$${item.price * item.quantity}</div>
    </div>
  `).join('');

  // Calculate totals
  orderTotals.subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  orderTotals.shipping = orderTotals.subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  orderTotals.tax = Math.round(orderTotals.subtotal * TAX_RATE * 100) / 100;
  orderTotals.total = orderTotals.subtotal + orderTotals.shipping + orderTotals.tax;

  // Update DOM
  summarySubtotal.textContent = `$${orderTotals.subtotal}`;
  summaryShipping.textContent = orderTotals.shipping === 0 ? 'FREE' : `$${orderTotals.shipping}`;
  summaryTax.textContent = `$${orderTotals.tax.toFixed(2)}`;
  summaryTotal.textContent = `$${orderTotals.total.toFixed(2)}`;
}

// ======================== UI TOGGLES =========================

function setupPaymentToggle() {
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      // Reset active styles
      paymentOptionCards.forEach(card => card.classList.remove('active'));
      
      // Add active style to selected
      const selectedId = `label-${e.target.value}`;
      document.getElementById(selectedId).classList.add('active');

      // Toggle containers
      ccDetails.classList.remove('show');
      walletDetails.classList.remove('show');

      if (e.target.value === 'cc') {
        ccDetails.classList.add('show');
      } else if (e.target.value === 'wallet') {
        walletDetails.classList.add('show');
      }
    });
  });
}

function setupWalletUpload() {
  walletReceipt.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      receiptFilename.textContent = file.name;
      receiptError.style.setProperty('display', 'none', 'important');
      
      // Convert to Base64 for temporary storage
      const reader = new FileReader();
      reader.onload = function(event) {
        receiptBase64 = event.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      receiptFilename.textContent = 'Click to upload image';
      receiptBase64 = null;
    }
  });
}

// ======================== VALIDATION =========================

// Allow only numbers in CC inputs
[ccNumber, ccCvv].forEach(input => {
  input.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
  });
});

// Format MM/YY
ccExp.addEventListener('input', function(e) {
  let val = this.value.replace(/\D/g, '');
  if (val.length >= 2) {
    val = val.substring(0, 2) + '/' + val.substring(2, 4);
  }
  this.value = val;
});

function validateCreditCard() {
  let isValid = true;

  // 16 digits
  if (ccNumber.value.length !== 16) {
    ccNumber.classList.add('is-invalid');
    isValid = false;
  } else {
    ccNumber.classList.remove('is-invalid');
  }

  // MM/YY format
  const expRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expRegex.test(ccExp.value)) {
    ccExp.classList.add('is-invalid');
    isValid = false;
  } else {
    ccExp.classList.remove('is-invalid');
  }

  // CVV
  if (ccCvv.value.length !== 3) {
    ccCvv.classList.add('is-invalid');
    isValid = false;
  } else {
    ccCvv.classList.remove('is-invalid');
  }

  return isValid;
}

function validateWallet() {
  if (!walletReceipt.files || walletReceipt.files.length === 0) {
    receiptError.style.setProperty('display', 'block', 'important');
    return false;
  }
  receiptError.style.setProperty('display', 'none', 'important');
  return true;
}

function setupFormValidation() {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Reset bootstrap validation classes
    form.classList.remove('was-validated');
    let isFormValid = form.checkValidity();

    // Check generic HTML5 validity
    if (!isFormValid) {
      e.stopPropagation();
      form.classList.add('was-validated');
    }

    // Check specific payment methods
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    let isPaymentValid = true;

    if (paymentMethod === 'cc') {
      isPaymentValid = validateCreditCard();
    } else if (paymentMethod === 'wallet') {
      isPaymentValid = validateWallet();
    }

    if (isFormValid && isPaymentValid) {
      processOrder(paymentMethod);
    } else {
      // Scroll to first error
      const firstInvalid = document.querySelector('.is-invalid, :invalid');
      if(firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

// ======================== PROCESS ORDER ======================

function processOrder(paymentMethod) {
  const orderId = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits

  const orderData = {
    id: orderId,
    date: new Date().toISOString(),
    items: cart,
    totals: orderTotals,
    paymentMethod: paymentMethod,
    receiptImage: receiptBase64,
    shippingDetails: {
      name: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      address: document.getElementById('address').value
    }
  };

  // Save order to show on success page
  localStorage.setItem(STORAGE_ORDER_KEY, JSON.stringify(orderData));
  
  // Clear cart
  localStorage.removeItem(STORAGE_CART_KEY);

  // Redirect
  window.location.href = `order-success.html?id=${orderId}`;
}

// Run
init();
