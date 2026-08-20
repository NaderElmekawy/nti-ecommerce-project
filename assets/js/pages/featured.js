import { createProductCard } from '../components/productCard.js';
import { products } from '../../../data.js';
import { addToCart, toggleWishlist, showNotification } from './shop.js';

function renderFeatured() {
  const container = document.getElementById("featured-container");
  if (!container) return;

  const featuredProducts = products.filter(product => product.isFeatured);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8);

  container.innerHTML = displayProducts.map(product => 
    createProductCard(product, "col-lg-3 col-md-6 col-sm-12")
  ).join('');
}

// Event Listeners for Add to Cart & Wishlist & Colors
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

  // 3. Change Image Based on Color Circle
  const colorCircle = e.target.closest(".color-circle");
  if (colorCircle) {
      e.preventDefault();

      const newImageSrc = colorCircle.getAttribute("data-color-image");
      const productCard = colorCircle.closest(".product-card");

      if (productCard && newImageSrc) {
          const productImage = productCard.querySelector(".product-image");
          if (productImage) {
              productImage.src = newImageSrc;
          }

          productCard.querySelectorAll(".color-circle").forEach(circle => {
              circle.classList.remove("active");
          });
          colorCircle.classList.add("active");
      }
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderFeatured);
} else {
  renderFeatured();
}
