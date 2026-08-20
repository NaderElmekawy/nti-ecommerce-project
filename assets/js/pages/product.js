
import { products } from "../../../data.js";
import { toggleWishlist, showNotification} from "./shop.js";


// ===============================
// GET PRODUCT
// ===============================

const params =
    new URLSearchParams(
        window.location.search
    );

const productId =
    Number(
        params.get("id")
    );


const product =
    products.find(
        item =>
            item.id === productId
    );


if (!product) {

    console.error(
        "Product not found. ID:",
        productId
    );

    window.location.href =
        "shop.html";
}


// ===============================
// VARIABLES
// ===============================

let selectedColorIndex = 0;


// ===============================
// MAIN IMAGE
// ===============================

const mainImage =
    document.getElementById(
        "mainImage"
    );


if (mainImage && product) {

    mainImage.src =
        product.image;

    mainImage.alt =
        product.name;
}


// ===============================
// THUMBNAILS
// ===============================

const thumbnails =
    document.getElementById(
        "thumbnails"
    );


if (thumbnails && product) {

    thumbnails.innerHTML = `

        <img
            src="${product.image}"
            class="thumbnail active"
            alt="${product.name}"
        >

    `;

}


// ===============================
// CHANGE IMAGE
// ===============================

function changeImage(element) {

    if (!mainImage) {
        return;
    }


    mainImage.src =
        element.src;

    mainImage.style.filter =
        "none";


    document
        .querySelectorAll(
            ".thumbnail"
        )
        .forEach(
            img => {

                img.classList.remove(
                    "active"
                );

            }
        );


    element.classList.add(
        "active"
    );
}


// ===============================
// COLOR IMAGE
// ===============================

function getColorImage(index) {

    if (
        product.colorImages &&
        product.colorImages[index]
    ) {

        return product.colorImages[index];

    }

    return product.image;
}


// ===============================
// PRODUCT INFO
// ===============================

const productInfo =
    document.getElementById(
        "productInfo"
    );


if (
    productInfo &&
    product
) {

    productInfo.innerHTML = `

        <div>

            <span class="category">
                ${product.category}
            </span>

            <span class="rating ms-3">
                ★★★★★

                <span class="reviews">
                    ${product.rating}
                    (${product.reviews} reviews)
                </span>

            </span>

        </div>


        <h1 class="product-title">
            ${product.name}
        </h1>


        <div>

            <span class="price">
                $${product.price}
            </span>

            ${
                product.oldPrice
                    ? `

                        <span class="old-price">
                            $${product.oldPrice}
                        </span>

                        <span class="save">
                            Save
                            $${product.oldPrice - product.price}
                        </span>

                    `
                    : ""
            }

        </div>


        <p class="description">
            ${product.description}
        </p>


        <!-- COLOR -->

        <div class="option-title">

            Color:

            <span
                id="selectedColor"
                style="
                    color:#9dafc5;
                    font-weight:400;
                "
            >
                ${product.colorNames[0]}
            </span>

        </div>


        <div>

            ${product.colors.map(
                (color, index) => `

                    <span

                        class="
                            color-option
                            ${
                                index === 0
                                    ? "active"
                                    : ""
                            }
                        "

                        style="
                            background:${color};
                            display:inline-block;
                            cursor:pointer;
                        "

                    ></span>

                `
            ).join("")}

        </div>


        <!-- SIZE -->

        <div
            class="
                option-title
                d-flex
                justify-content-between
            "
        >

            <span>
                Select Size
            </span>

            <span
                style="
                    color:#ff7410;
                    font-size:14px;
                "
            >
                Size Guide
            </span>

        </div>


        <div class="size-list">

            ${product.sizes.map(
                (size, index) => `

                    <button
                        type="button"
                        class="
                            size-btn
                            ${
                                index === 0
                                    ? "active"
                                    : ""
                            }
                        "
                    >
                        ${size}
                    </button>

                `
            ).join("")}

        </div>


        <!-- CART -->

        <div class="d-flex gap-3 align-items-end">

            <button
                type="button"
                class="add-cart"
            >
                🛍
                Add to Cart
            </button>


            <button
                type="button"
                class="wishlist"
            >
                ♡
            </button>

        </div>


        <!-- INFO -->

        <div class="row g-3 ">

            <div class="col-md-6 col-sm-12">

                <div class="info-box">

                    <div class="info-title">
                        🚚 Free Shipping
                    </div>

                    <div class="info-text">
                        On orders over $75
                    </div>

                </div>

            </div>


            <div class="col-md-6 col-sm-12">

                <div class="info-box">

                    <div class="info-title">
                        ↻ 60-Day Returns
                    </div>

                    <div class="info-text">
                        Try it. Love it.
                    </div>

                </div>

            </div>

        </div>

    `;


    // ===============================
    // SIZE EVENTS
    // ===============================

    document
        .querySelectorAll(".size-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    selectSize(button);

                }
            );

        });


    // ===============================
    // COLOR EVENTS
    // ===============================

    document
        .querySelectorAll(".color-option")
        .forEach(
            (option, index) => {

                option.addEventListener(
                    "click",
                    () => {

                        selectColor(
                            option,
                            product.colorNames[index],
                            index
                        );

                    }
                );

            }
        );


    // ===============================
    // ADD TO CART EVENT
    // ===============================

    const addCartButton =
        document.querySelector(
            ".add-cart"
        );


    if (addCartButton) {

        addCartButton.addEventListener(
            "click",
            addToCart
        );

    }

}


// ===============================
// ADD TO WISHLIST  
// ===============================


const wishlistBtn = document.querySelector(".wishlist");


if (wishlistBtn) {
    wishlistBtn.addEventListener("click", () => {
        const isAdded = toggleWishlist(product.id);
        
        wishlistBtn.classList.toggle("active", isAdded);

        showNotification(isAdded ? "Added to Wishlist! ❤️" : "Removed from Wishlist!");
    });
}


// ===============================
// SELECT COLOR
// ===============================

function selectColor(
    element,
    name,
    index
) {

    document
        .querySelectorAll(
            ".color-option"
        )
        .forEach(
            option => {

                option.classList.remove(
                    "active"
                );

            }
        );


    element.classList.add(
        "active"
    );


    selectedColorIndex =
        index;


    const selectedColor =
        document.getElementById(
            "selectedColor"
        );


    if (selectedColor) {

        selectedColor.textContent =
            name;

    }


    if (mainImage) {

        const image =
            getColorImage(index);


        mainImage.src =
            image;


        if (
            product.colorImages &&
            product.colorImages[index]
        ) {

            mainImage.style.filter =
                "none";

        } else {

            applyColorFilter(index);

        }

    }

}


// ===============================
// SELECT SIZE
// ===============================

function selectSize(button) {

    document
        .querySelectorAll(
            ".size-btn"
        )
        .forEach(
            btn => {

                btn.classList.remove(
                    "active"
                );

            }
        );


    button.classList.add(
        "active"
    );

}


// ===============================
// COLOR FILTER
// ===============================

function applyColorFilter(index) {

    const filters = [
        "none",
        "brightness(1.15)",
        "sepia(0.4) saturate(1.8)",
        "grayscale(1)"
    ];


    mainImage.style.filter =
        filters[index] || "none";

}


// ===============================
// ADD TO CART
// ===============================

function addToCart() {

    const selectedSizeElement =
        document.querySelector(
            ".size-btn.active"
        );


    const selectedSize =
        selectedSizeElement
            ? selectedSizeElement.textContent.trim()
            : product.sizes[0];


    const selectedColorElement =
        document.getElementById(
            "selectedColor"
        );


    const selectedColor =
        selectedColorElement
            ? selectedColorElement.textContent.trim()
            : product.colorNames[0];


    let cart = [];


    try {

        cart =
            JSON.parse(
                localStorage.getItem(
                    "cartProducts"
                )
            ) || [];

    } catch (error) {

        cart = [];

    }


    const existingItem =
        cart.find(
            item =>
                item.id === product.id &&
                item.size === selectedSize &&
                item.color === selectedColor
        );


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: getColorImage(
                selectedColorIndex
            ),

            size: selectedSize,

            color: selectedColor,

            quantity: 1

        });

    }


    localStorage.setItem(
        "cartProducts",
        JSON.stringify(cart)
    );


    updateCartCount();


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

        message.textContent =
            "Added to cart!";


        notification.classList.add(
            "show"
        );


        clearTimeout(
            window.cartNotificationTimer
        );


        window.cartNotificationTimer =
            setTimeout(
                () => {

                    notification.classList.remove(
                        "show"
                    );

                },
                3000
            );

    }

}


// ===============================
// UPDATE CART COUNT
// ===============================

function updateCartCount() {

    let cart = [];


    try {

        cart =
            JSON.parse(
                localStorage.getItem(
                    "cartProducts"
                )
            ) || [];

    } catch (error) {

        cart = [];

    }


    const count =
        cart.reduce(
            (total, item) => {

                return total +
                    Number(
                        item.quantity || 0
                    );

            },
            0
        );


    // Reach into the Shadow DOM via the header component's public method
    const header =
        document.querySelector(
            "site-header"
        );


    if (header && header.updateCartBadge) {

        header.updateCartBadge(
            count
        );

    }

}


// ===============================
// INITIAL CART COUNT
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

    }
);


