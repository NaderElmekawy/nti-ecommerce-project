import { products } from "../../../data.js";
import { createProductCard } from "../components/productCard.js";
import { getWishlist, saveWishlist, showNotification, addToCart } from "./shop.js";

// ================= WISHLIST ITEMS DISPLAY ==========================//


// ======================================
// WISHLIST HELPERS
// ======================================



function removeFromWishlist(id) {
    console.log(id);
    const numericId = Number(id);
    let wishlist = getWishlist();

    wishlist = wishlist.filter(item => Number(item.id) !== numericId);
    saveWishlist(wishlist);
}

// ======================================
// RENDER WISHLIST PRODUCTS
// ======================================

function renderWishlist() {
    const wishlist = getWishlist();
    const grid = document.getElementById("wishlist-grid");
    const emptyEl = document.getElementById("empty-wishlist");
    const countEl = document.getElementById("wishlist-count");

    if (countEl) {
        countEl.textContent = wishlist.length;
    }

    if (!grid) return;

    if (wishlist.length === 0) {
        grid.innerHTML = "";
        if (emptyEl) {
            emptyEl.style.display = "block";
            grid.style.display = "none";
        };
        return;
    }

    if (emptyEl) emptyEl.style.display = "none";

    grid.innerHTML = wishlist
        .map(product => createProductCard(product, "col-lg-3 col-md-6 col-sm-12"))
        .join("");
}

renderWishlist();

// ======================================
// EVENT LISTENER FOR WISHLIST GRID
// ======================================

document.getElementById("wishlist-grid")?.addEventListener("click", function (e) {

    // CHANGE IMAGE BASED ON COLOR
    const colorCircle = e.target.closest(".color-circle");

    if (colorCircle) {
        e.stopPropagation();

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
        return;
    }
    // REMOVE FROM WISHLIST WHEN CLICKING HEART
    const favButton = e.target.closest(".add-to-fav");
    if (favButton) {
        e.stopPropagation();
        const id = Number(favButton.dataset.favId);

        removeFromWishlist(id);

        showNotification("Removed from Wishlist!");
        renderWishlist();
        return;
    }

    // ADD TO CART
    const addButton = e.target.closest("[data-add-cart]");
    if (addButton) {
        e.stopPropagation();
        const id = Number(addButton.dataset.addCart);
        const card = addButton.closest(".product-card");
        addToCart(id, card);
        return;
    }

    // OPEN PRODUCT PAGE
    const card = e.target.closest(".product-card");
    if (!card) return;
    if (e.target.closest(".product-name")) return;

    const id = Number(card.dataset.productId);
    window.location.href = "product.html?id=" + id;


});



// ======================================
// CLEAR WISHLIST
// ======================================
function clearWishlist() {
    localStorage.removeItem("wishlistProducts");
    renderWishlist();
    if (typeof showNotification === "function") {
        showNotification("Wishlist cleared!");
    }
}

const clearAllBtn = document.getElementById("clear-wishlist");
clearAllBtn.addEventListener("click", clearWishlist);


// ======================================
// ALSO LIKE
// ======================================

const alsoLikeGrid = document.querySelector(".also-like-grid");
alsoLikeGrid.innerHTML = products.slice(0, 4).map((product) => createProductCard(product, "col-lg-3 col-md-6 col-sm-12")).join("");