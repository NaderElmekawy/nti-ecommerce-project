/* ============================================================
   ORDER-SUCCESS.JS — Stride Order Success Logic
   ============================================================ */

const STORAGE_ORDER_KEY = 'stride_last_order';

// DOM Elements
const displayOrderId = document.getElementById('display-order-id');
const displayOrderDate = document.getElementById('display-order-date');
const displayPaymentMethod = document.getElementById('display-payment-method');
const displayItemCount = document.getElementById('display-item-count');
const displayTotalAmount = document.getElementById('display-total-amount');
const walletReceiptContainer = document.getElementById('wallet-receipt-container');
const displayWalletReceipt = document.getElementById('display-wallet-receipt');

function init() {
  // 1. Get Order ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const orderIdFromUrl = urlParams.get('id');

  if (!orderIdFromUrl) {
    // If someone visits the page directly without an ID, send them home
    window.location.href = 'index.html';
    return;
  }

  // 2. Get Order Details from LocalStorage
  let orderData = null;
  try {
    const stored = localStorage.getItem(STORAGE_ORDER_KEY);
    if (stored) {
      orderData = JSON.parse(stored);
    }
  } catch (e) {
    console.error('Could not parse order data', e);
  }

  // If order data exists and matches the URL ID, render it
  if (orderData && orderData.id === orderIdFromUrl) {
    renderOrderDetails(orderData);
  } else {
    // Fallback if data was cleared but URL still has ID
    displayOrderId.textContent = `#${orderIdFromUrl}`;
    displayOrderDate.textContent = new Date().toLocaleDateString();
    displayPaymentMethod.textContent = 'Processing...';
    displayItemCount.textContent = 'Unknown';
    displayTotalAmount.textContent = '-';
  }
}

function renderOrderDetails(order) {
  // Format Date
  const dateObj = new Date(order.date);
  const formattedDate = dateObj.toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  // Map Payment Method Label
  let paymentLabel = 'Cash on Delivery';
  if (order.paymentMethod === 'cc') paymentLabel = 'Credit Card';
  if (order.paymentMethod === 'wallet') paymentLabel = 'Mobile Wallet / InstaPay';

  // Calculate total items
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  // Update DOM
  displayOrderId.textContent = `#${order.id}`;
  displayOrderDate.textContent = formattedDate;
  displayPaymentMethod.textContent = paymentLabel;
  displayItemCount.textContent = `${totalItems} item(s)`;
  displayTotalAmount.textContent = `$${order.totals.total.toFixed(2)}`;

  // Handle Mobile Wallet Receipt Display
  if (order.paymentMethod === 'wallet' && order.receiptImage) {
    displayWalletReceipt.src = order.receiptImage;
    walletReceiptContainer.style.display = 'block';
  }
}

// Run
init();
