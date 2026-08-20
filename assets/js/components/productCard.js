function getWishlist() {
    return JSON.parse(localStorage.getItem("wishlistProducts")) || [];
}

export function createProductCard(product, columnClass = "col-md-6 col-xl-4", options = {}) {
    const {
        showFav = true,
        showCart = true,
        actions = []
    } = options;

    const wishlist = getWishlist();
    const isFav = wishlist.some(item => Number(item.id) === Number(product.id));

    let badgeHTML = "";
    if (product.badge) {
        badgeHTML = `
            <span class="badge-product badge-${product.badgeType}">
                ${product.badge}
            </span>
        `;
    }

    const colorsHTML = (product.colors || [])
        .map((colorHex, index) => {
            const imageForColor = (product.colorImages && product.colorImages[index])
                ? product.colorImages[index]
                : product.image;

            const colorName = (product.colorNames && product.colorNames[index]) || "";
            const isActive = index === 0 ? "active" : "";

            return `
            <span 
                class="color-circle ${isActive}" 
                style="background-color: ${colorHex};" 
                data-color-image="${imageForColor}"
                title="${colorName}"
            ></span>
        `;
        })
        .join("");

    const sizesCount = product.sizes ? product.sizes.length : 0;

    const favBtnHTML = showFav ? `
        <button 
            class="add-to-fav ${isFav ? "active" : ""}" 
            data-fav-id="${product.id}"
        >
            <svg fill="${isFav ? "currentColor" : "none"}" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
        </button>
    ` : "";

    const cartBtnHTML = showCart ? `
        <button
            class="add-button mt-3"
            data-add-cart="${product.id}"
        >
            🛒 Add to Cart
        </button>
    ` : "";

    const customActionsHTML = actions.map(act => `
        <button class="${act.className || 'btn btn-secondary mt-2 w-100'}" data-action="${act.name}" data-id="${product.id}">
            ${act.label}
        </button>
    `).join("");

    return `
        <div class="${columnClass}">
            <div
                class="product-card"
                data-product-id="${product.id}"
            >
                <div class="product-image-wrapper">
                    <img
                        src="${product.image}"
                        class="product-image"
                        alt="${product.name}"
                    >
                    ${badgeHTML}
                    ${favBtnHTML}
                </div>

                <div class="product-category">
                    ${product.category}
                    <span class="rating float-end">
                        ★
                        <span class="rating-number">${product.rating}</span>
                    </span>
                </div>

                <a href="product.html?id=${product.id}" class="product-name">
                    ${product.name}
                </a>

                <div class="mb-2">
                    <span class="price">$${product.price}</span>
                    ${product.oldPrice
                        ? `<span class="old-price">$${product.oldPrice}</span>`
                        : ""
                    }
                </div>

                <div class="color-options">
                    ${colorsHTML}
                </div>

                <div class="availability">
                    ${sizesCount} sizes available
                </div>

                ${cartBtnHTML}
                ${customActionsHTML}
            </div>
        </div>
    `;
}