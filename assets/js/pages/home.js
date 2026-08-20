import { createProductCard } from "../components/productCard.js";
import { categories, products, reviews } from "../../../data.js";
import { addToCart, toggleWishlist, showNotification } from "./shop.js";

// ===============================
// Render Featured Products
// ===============================
const featuredGrid = document.querySelector(".featured-cards");
const featuredProducts = products.filter((product) => product.isFeatured);
if (featuredGrid) {
    featuredGrid.innerHTML = featuredProducts
        .map((product) => createProductCard(product, "col-lg-3 col-md-6 col-sm-12"))
        .join("");
}

// ===============================
// Render New Arrivals
// ===============================
const newArrivalsGrid = document.querySelector(".new-arrivals-cards");
const newArrivalsProducts = products.filter((product) => product.new);
if (newArrivalsGrid) {
    newArrivalsGrid.innerHTML = newArrivalsProducts
        .map((product) => createProductCard(product, "col-lg-3 col-md-6 col-sm-12"))
        .join("");
}

// ===============================
// Event Delegation (Fix Add to Cart & Wishlist)
// ===============================


document.addEventListener("click", (e) => {
    // 1. Add To Cart Button
    const cartBtn = e.target.closest(".add-button");
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

    // CHANGE IMAGE BASED ON COLOR
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


// ===============================
// Reviews
// ===============================

const testiGrid = document.querySelector(".testi-cards");

if (testiGrid) {
    reviews.map((review) => {
        testiGrid.innerHTML += `<div class="col-lg-4 col-md-6 col-sm-12">
                <div class="testi-card">
                    <div class="testi-card-stars">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            ></path></svg
                        ><svg fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            ></path></svg
                        ><svg fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            ></path></svg
                        ><svg fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            ></path></svg
                        ><svg fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                            ></path>
                        </svg>
                    </div>
                    <blockquote class="testi-card-comment">
                        ${review.comment}
                    </blockquote>
                    <div class="testi-card-author">
                        <img
                            src=${review.image}
                            alt="Marcus Chen"
                        />
                        <div class="testi-card-author-info">
                            <p>${review.author.name}</p>
                            <p>${review.author.bio}</p>
                        </div>
                    </div>
                </div>
            </div>`
    })

}



const categoriesGrid = document.querySelector(".categories-cards");
if(categoriesGrid) {
    categories.map((category) => {
        categoriesGrid.innerHTML += `<div class="col-lg-4 col-md-6 col-sm-12 overflow-hidden">
            <a href="./shop.html?category=${encodeURIComponent(category.title)}" class="category-card   ">
            <div class="image-wrapper"> 
                <img src="${category.image}" alt="Basketball"">
            </div> 
            <div class="category-overlay "></div>
            <div class="category-content ">
                <span> 
                    ${category.stock}
                </span> 
                <h3>${category.title}</h3> 
                <p >${category.description}</p> 
                <div >
                    Shop Now
                    <svg  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path> 
                    </svg> 
                </div> 
            </div> 
        </a>
        </div>
        `
    })
}
