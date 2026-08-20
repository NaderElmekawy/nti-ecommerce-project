import { products } from "../../../data.js";
import { createProductCard } from "../components/productCard.js";

// ======================================
// CATEGORIES
// ======================================

const categories = [
    "All Products",
    "Running",
    "Sneakers",
    "Basketball",
    "Casual",
    "Boots",
    "Sandals"
];

// ======================================
// URL PARAMETERS
// ======================================

const params = new URLSearchParams(window.location.search);

const categoryFromUrl = params.get("category");
const searchFromUrl = params.get("search");

// Make category matching case-insensitive
const matchedCategory = categories.find(
    category =>
        category.toLowerCase() === (categoryFromUrl || "").toLowerCase()
);

let currentCategory = matchedCategory || "All Products";
let currentQuickFilter = "";

const categoryList = document.getElementById("categoryList");

// ======================================
// WISHLIST HELPERS
// ======================================

export function getWishlist() {
    return JSON.parse(localStorage.getItem("wishlistProducts")) || [];
}

export function saveWishlist(wishlist) {
    localStorage.setItem("wishlistProducts", JSON.stringify(wishlist));
}

export function toggleWishlist(id) {
    const numericId = Number(id);
    let wishlist = getWishlist();

    const index = wishlist.findIndex(
        item => Number(item.id) === numericId
    );

    let isAdded = false;

    if (index > -1) {
        wishlist.splice(index, 1);
        isAdded = false;
    } else {
        const product = products.find(
            p => Number(p.id) === numericId
        );

        if (product) {
            wishlist.push(product);
            isAdded = true;
        }
    }

    saveWishlist(wishlist);

    return isAdded;
}

// ======================================
// CREATE CATEGORIES
// ======================================

function createCategories() {
    if (!categoryList) return;

    categoryList.innerHTML = "";

    categories.forEach(category => {
        const count =
            category === "All Products"
                ? products.length
                : products.filter(
                      p => p.category === category
                  ).length;

        const link = document.createElement("a");

        link.href = "#";

        link.className =
            "category" +
            (category === currentCategory ? " active" : "");

        link.innerHTML = `
            <span>${category}</span>
            <span class="category-count">(${count})</span>
        `;

        link.addEventListener("click", function (e) {
            e.preventDefault();

            currentCategory = category;
            currentQuickFilter = "";

            document
                .getElementById("newFilter")
                ?.classList.remove("active");

            document
                .getElementById("saleFilter")
                ?.classList.remove("active");

            createCategories();
            renderProducts();
        });

        categoryList.appendChild(link);
    });
}

// ======================================
// INITIAL SEARCH VALUE FROM URL
// ======================================

const searchInput = document.getElementById("searchInput");

if (searchInput && searchFromUrl) {
    searchInput.value = searchFromUrl;
}

// ======================================
// RENDER PRODUCTS
// ======================================

function renderProducts() {
    let filtered = [...products];

    // ==================================
    // CATEGORY
    // ==================================

    if (currentCategory !== "All Products") {
        filtered = filtered.filter(
            p => p.category === currentCategory
        );
    }

    // ==================================
    // SEARCH
    // ==================================

    const search =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

    if (search !== "") {
        filtered = filtered.filter(
            p =>
                p.name.toLowerCase().includes(search) ||
                p.category.toLowerCase().includes(search)
        );
    }

    // ==================================
    // PRICE
    // ==================================

    const minPriceInput =
        document.getElementById("minPrice");

    const maxPriceInput =
        document.getElementById("maxPrice");

    const minPrice = minPriceInput
        ? Number(minPriceInput.value) || 0
        : 0;

    const maxPriceVal =
        maxPriceInput
            ? maxPriceInput.value
            : "";

    const maxPrice =
        maxPriceVal === ""
            ? Infinity
            : Number(maxPriceVal);

    filtered = filtered.filter(
        p =>
            p.price >= minPrice &&
            p.price <= maxPrice
    );

    // ==================================
    // QUICK FILTER - NEW
    // ==================================

    if (currentQuickFilter === "new") {
        filtered = filtered.filter(
            p => p.badgeType === "new"
        );
    }

    // ==================================
    // QUICK FILTER - SALE
    // ==================================

    if (currentQuickFilter === "sale") {
        filtered = filtered.filter(
            p => p.oldPrice
        );
    }

    // ==================================
    // SORT
    // ==================================

    const sortSelect =
        document.getElementById("sortSelect");

    const sort =
        sortSelect
            ? sortSelect.value
            : "";

    if (sort === "priceLow") {
        filtered.sort(
            (a, b) => a.price - b.price
        );
    }

    if (sort === "priceHigh") {
        filtered.sort(
            (a, b) => b.price - a.price
        );
    }

    if (sort === "rating") {
        filtered.sort(
            (a, b) => b.rating - a.rating
        );
    }

    // ==================================
    // COUNT
    // ==================================

    const countEl =
        document.getElementById("productCount");

    if (countEl) {
        countEl.textContent = filtered.length;
    }

    // ==================================
    // RENDER
    // ==================================

    const grid =
        document.getElementById("productGrid");

    if (grid) {
        grid.innerHTML = filtered
            .map(product =>
                createProductCard(product)
            )
            .join("");
    }

    // ==================================
    // EMPTY STATE
    // ==================================

    const emptyEl =
        document.getElementById("empty");

    if (emptyEl) {
        emptyEl.classList.toggle(
            "d-none",
            filtered.length !== 0
        );
    }
}

// ======================================
// INITIALIZE
// ======================================

createCategories();
renderProducts();

// ======================================
// SEARCH & FILTER LISTENERS
// ======================================

searchInput?.addEventListener(
    "input",
    renderProducts
);

document
    .getElementById("sortSelect")
    ?.addEventListener(
        "change",
        renderProducts
    );

document
    .getElementById("minPrice")
    ?.addEventListener(
        "input",
        renderProducts
    );

document
    .getElementById("maxPrice")
    ?.addEventListener(
        "input",
        renderProducts
    );

// ======================================
// NEW FILTER
// ======================================

document
    .getElementById("newFilter")
    ?.addEventListener(
        "click",
        function () {
            if (currentQuickFilter === "new") {
                currentQuickFilter = "";

                this.classList.remove("active");
            } else {
                currentQuickFilter = "new";

                this.classList.add("active");

                document
                    .getElementById("saleFilter")
                    ?.classList.remove("active");
            }

            renderProducts();
        }
    );

// ======================================
// SALE FILTER
// ======================================

document
    .getElementById("saleFilter")
    ?.addEventListener(
        "click",
        function () {
            if (currentQuickFilter === "sale") {
                currentQuickFilter = "";

                this.classList.remove("active");
            } else {
                currentQuickFilter = "sale";

                this.classList.add("active");

                document
                    .getElementById("newFilter")
                    ?.classList.remove("active");
            }

            renderProducts();
        }
    );

// ======================================
// PRODUCT CARD EVENTS
// EVENT DELEGATION
// ======================================

document
    .getElementById("productGrid")
    ?.addEventListener(
        "click",
        function (e) {

            // ==================================
            // ADD / REMOVE WISHLIST
            // ==================================

            const favButton =
                e.target.closest(".add-to-fav");

            if (favButton) {
                e.stopPropagation();

                const id =
                    Number(
                        favButton.dataset.favId
                    );

                const isAdded =
                    toggleWishlist(id);

                favButton.classList.toggle(
                    "active",
                    isAdded
                );

                const svg =
                    favButton.querySelector("svg");

                if (svg) {
                    svg.setAttribute(
                        "fill",
                        isAdded
                            ? "currentColor"
                            : "none"
                    );
                }

                showNotification(
                    isAdded
                        ? "Added to Wishlist! ❤️"
                        : "Removed from Wishlist!"
                );

                return;
            }

            // ==================================
            // ADD TO CART
            // ==================================

            const addButton =
                e.target.closest(
                    "[data-add-cart]"
                );

            if (addButton) {
                e.stopPropagation();

                const id =
                    Number(
                        addButton.dataset.addCart
                    );

                const card =
                    addButton.closest(
                        ".product-card"
                    );

                addToCart(id, card);

                return;
            }

            // ==================================
            // CUSTOM ACTIONS
            // ==================================

            const customBtn =
                e.target.closest(
                    "[data-action]"
                );

            if (customBtn) {
                e.stopPropagation();

                const action =
                    customBtn.dataset.action;

                const id =
                    Number(
                        customBtn.dataset.id
                    );

                if (action === "quick-view") {
                    openQuickViewModal(id);
                }

                return;
            }

            // ==================================
            // CHANGE IMAGE BASED ON COLOR
            // ==================================

            const colorCircle =
                e.target.closest(
                    ".color-circle"
                );

            if (colorCircle) {
                e.stopPropagation();
                e.preventDefault();

                const newImageSrc =
                    colorCircle.getAttribute(
                        "data-color-image"
                    );

                const productCard =
                    colorCircle.closest(
                        ".product-card"
                    );

                if (
                    productCard &&
                    newImageSrc
                ) {
                    const productImage =
                        productCard.querySelector(
                            ".product-image"
                        );

                    if (productImage) {
                        productImage.src =
                            newImageSrc;
                    }

                    productCard
                        .querySelectorAll(
                            ".color-circle"
                        )
                        .forEach(circle => {
                            circle.classList.remove(
                                "active"
                            );
                        });

                    colorCircle.classList.add(
                        "active"
                    );
                }

                return;
            }

            // ==================================
            // PRODUCT CARD NAVIGATION
            // ==================================

            const card =
                e.target.closest(
                    ".product-card"
                );

            if (!card) return;

            if (
                e.target.closest(
                    ".product-name"
                )
            ) {
                return;
            }

            const id =
                Number(
                    card.dataset.productId
                );

            openProduct(id);
        }
    );

// ======================================
// NOTIFICATION TOAST
// ======================================

export function showNotification(msg) {
    const notification =
        document.getElementById(
            "cartNotification"
        );

    const message =
        document.getElementById(
            "notificationMessage"
        );

    if (
        notification &&
        message
    ) {
        message.textContent = msg;

        notification.classList.add(
            "show"
        );

        clearTimeout(
            window.cartNotificationTimer
        );

        window.cartNotificationTimer =
            setTimeout(() => {
                notification.classList.remove(
                    "show"
                );
            }, 3000);
    }
}

// ======================================
// OPEN PRODUCT
// ======================================

function openProduct(id) {
    window.location.href =
        "product.html?id=" + id;
}

// ======================================
// ADD TO CART
// ======================================

export function addToCart(id, cardEl) {
    const numericId = Number(id);

    const product =
        products.find(
            p =>
                Number(p.id) === numericId
        );

    if (!product) return;

    // Read selected color variant
    let selectedImage =
        product.image;

    let selectedColor =
        product.colorNames?.[0] || "";

    let selectedSize =
        product.sizes?.[0] || "";

    if (cardEl) {
        const activeCircle =
            cardEl.querySelector(
                ".color-circle.active"
            );

        if (activeCircle) {
            selectedImage =
                activeCircle.getAttribute(
                    "data-color-image"
                ) || product.image;

            selectedColor =
                activeCircle.getAttribute(
                    "title"
                ) || selectedColor;
        }
    }

    let cart =
        JSON.parse(
            localStorage.getItem(
                "cartProducts"
            )
        ) || [];

    // Match by id + color + size
    const existing =
        cart.find(
            item =>
                Number(item.id) === numericId &&
                item.color === selectedColor &&
                String(item.size) ===
                    String(selectedSize)
        );

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: selectedImage,
            color: selectedColor,
            size: selectedSize,
            quantity: 1
        });
    }

    localStorage.setItem(
        "cartProducts",
        JSON.stringify(cart)
    );

    updateCartCount();

    showNotification(
        "Added to cart!"
    );
}

// ======================================
// UPDATE CART COUNT
// ======================================

function updateCartCount() {
    const cart =
        JSON.parse(
            localStorage.getItem(
                "cartProducts"
            )
        ) || [];

    const count =
        cart.reduce(
            (total, item) =>
                total +
                Number(
                    item.quantity || 0
                ),
            0
        );

    const header =
        document.querySelector(
            "site-header"
        );

    if (
        header &&
        header.updateCartBadge
    ) {
        header.updateCartBadge(count);
    }
}

updateCartCount();

// ======================================
// QUICK VIEW
// ======================================

function openQuickViewModal(id) {
    console.log(
        "Quick view for product:",
        id
    );
}