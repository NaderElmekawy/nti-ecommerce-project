import { createProductCard } from '../components/productCard.js';
import { products } from '../../../data.js';
import { addToCart, toggleWishlist, showNotification } from './shop.js';

function renderNewArrivals() {
  const container = document.getElementById("new-arrivals-container");
  if (!container) return;

  const newProducts = products.filter(product => product.new);
  const displayProducts = newProducts.length > 0 ? newProducts : products.slice(0, 8);

  container.innerHTML = displayProducts.map(product => 
    createProductCard(product, "col-lg-3 col-md-6 col-sm-12")
  ).join('');
}

// Event Listeners for Add to Cart & Wishlist
document.addEventListener("click", (e) => {
  // 1. Add To Cart Button
  const cartBtn = e.target.closest(".add-button") || e.target.closest("[data-add-cart]");
  if (cartBtn) {
    const productId = cartBtn.getAttribute("data-add-cart");
    const card = cartBtn.closest(".product-card");
    if (productId) {
      addToCart(productId, card);
      if (typeof showNotification === "function") {
        showNotification("Product added to cart!");
      }
    }
  }

  // 2. Add To Wishlist Button
  const favBtn = e.target.closest(".add-to-fav");
  if (favBtn) {
    const productId = favBtn.getAttribute("data-fav-id");
    if (productId && typeof toggleWishlist === "function") {
      const isAdded = toggleWishlist(Number(productId));

      favBtn.classList.toggle("active", isAdded);
      const svgPath = favBtn.querySelector("svg path") || favBtn.querySelector("svg");
      if (svgPath) {
        svgPath.setAttribute("fill", isAdded ? "currentColor" : "none");
      }
      if (typeof showNotification === "function") {
        showNotification(isAdded ? "Added to Wishlist!" : "Removed from Wishlist!");
      }
    }
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderNewArrivals);
} else {
  renderNewArrivals();
}