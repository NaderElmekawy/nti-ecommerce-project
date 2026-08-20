const template = document.createElement('template');

template.innerHTML = `
  <style>
  a {
  text-decoration : none;
  }
  /* Shared Classes */
.offer-banner {
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: calc(1.25 / 0.875);
  text-align: center;
  padding-block: 0.5rem;
  background-image: var(--linear-gradient);
}
.offer-banner span {
  font-weight: bold;
}

.custom-container {
  margin-inline: auto;
  padding-inline: 2rem;
  max-width: 80rem;
}
@media screen and (max-width: 1024px) {
  .custom-container {
    padding-inline: 1rem;
  }
}

    /* Header */
header {
  position: sticky;
  top: 0;
  z-index: 100000;
  background-color: var(--bg-header);
  border-bottom: 1px solid var(--border-header);
  backdrop-filter: blur(var(--blur-md));
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5rem;
}
@media screen and (max-width: 1024px) {
  .header-content {
    height: 4rem;
  }
}
.header-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.header-logo-svg {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  background-image: var(--linear-gradient);
  border-radius: 0.75rem;
}
.header-logo-svg svg {
  width: 1.5rem;
  height: 1.5rem;
  color: white;
}
.header-logo span {
  font-family: "Outfit", sans-serif;
  color: white;
  font-weight: 700;
  color: var(--text-logo);
  font-size: 1.25rem;
  line-height: 1.4;
}

/* Nav links */

.header-content > nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}
.header-content > nav  a {
  color: var(--text-navLink);
  transition: var(--transition-colors);
  font-weight: 500;
  font-size: 0.875rem;
}
.header-content > nav  a:hover {
  color: var(--text-navLink-hover);
}
@media (max-width: 1024px) {
  .header-content > nav {
    display: none;
  }
}

/* header widgets */


.header-widgets {
  display: flex;
  align-items: center; 
  gap: 0.5rem;
}

.header-widgets button,
.header-widgets a,
.header-content .mobile-menu-toggle {
  display: inline-flex;       
  align-items: center;
  justify-content: center;
  width: 2.25rem;           
  height: 2.25rem;           
  padding: 0;               
  border-radius: 0.5rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  box-sizing: border-box;
}

.header-widgets button:hover,
.header-widgets a:hover,
.header-content .mobile-menu-toggle:hover {
  background-color: var(--color-widget-hover);
}

.header-widget {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-widgets);
}

.header-widgets a.header-widget-wishlist {
  display: inline-flex;
}
@media (max-width: 640px) {
  .header-widgets a.header-widget-wishlist {
    display: none;
  }
}

.header-widget-cart {
  position: relative;
}

.cart-count-badge {
  position: absolute;
  right: -0.25rem;
  top: -0.25rem;
  width: 1.125rem;
  height: 1.125rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-primary-600);
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 50%;
  pointer-events: none;
}
.header-content .mobile-menu-toggle {
  display: none;
}
.header-content .mobile-menu-toggle svg {
    width: 1.5rem;
    height: 1.5rem;
}
.header-content .mobile-menu-toggle svg.close-icon {
    display: none;
}
@media (max-width: 1024px) {
  .header-content .mobile-menu-toggle {
    display: flex;
    align-items: center;
    justify-content : center;
  }
}
  #search-modal {
  position : fixed;
  z-index : 50;
 
  inset : 0;
  display : none;
  align-items : center;
  justify-content : center;
  backdrop-filter : blur(var(--blur-sm));
  padding-top : 5rem;
 
  background-color : var(--color-black-50);
  }
  #search-modal .search-modal-content {
    background-color : var(--bg-modal);
    box-shadow: 0 25px 50px -12px #00000040;;
    padding : 1.5rem;
    border-radius : 1rem;
    max-width : 42rem;
    width : 100%;
    margin-inline : 1rem;
    margin-top: 1.9rem;
  }
    .search-modal-input {
    position : relative;

    }
    .search-modal-input svg {
    position : absolute;
    color : var(--color-gray-400);
    top : 50%;
    transform : translateY(-50%);
    width : 1.25rem;
    height : 1.25rem;
    left : 1rem;
    }
    .search-modal-input input {
    border : 1px solid var(--border-modal);
    width : 100%;
    border-radius : 0.75rem;
    background-color : var(--bg-modal);
    padding : 1rem 1rem 1rem 3rem;
    color : var(--text-logo);
    }
    .search-modal-input input:placeholder {
    color : var(--color-gray-400);
    }
    .search-modal-input input:focus {
    border-color : var(--color-primary-500);
    outline : none;
    outline : 2px ring var(--color-primary-500);
    
    }
    .search-modal-popular {
    display : flex;
    align-items: center;
    margin-top : 1rem;
    gap : 0.5rem;
    flex-wrap : wrap;
    }
    .search-modal-popular span {
    font-size : 0.875rem;
    color : var(--color-gray-500);
    } 
    .search-modal-popular a {
      
      color : var(--text-navLink);
      border-radius : 50%;
      font-size : 0.875rem;
      padding-inline : 0.75rem;
      padding-block : 0.25rem;
      transition : var(--transition-colors);
    }
      
      .search-modal-escape {
      margin-top : 1rem;
      text-align : center;
      font-size : 0.875rem;
      color : var(--color-gray-500);
      }
      .search-modal-escape kbd {
      background : var(--border-header);
      padding : 0.25rem 0.5rem;
      border-radius : 0.25rem;

      }
      .mobile-menu {
        border-top :  1px solid var(--border-header);
        background : var(--bg-main);
        display : none;
      }
      .mobile-menu-nav {
        display : flex;
        flex-direction : column;
        padding : 1rem;
        max-width : 80rem;
        margin-inline : auto;
      }
        .mobile-menu-nav a {
        display : block;
        padding : 0.75rem 1rem;
        font-size : 1rem;
        font-weight : normal;
        border-radius : 0.5rem;
        color : var(--text-navLink);

        }
        .mobile-menu-wedgets {
          margin-top : 1rem;
          border-top : 1px solid var(--border-header);
          padding-top : 1rem;
        }
        @media (min-width : 1024px) {
        .mobile-menu {
        display : none;
        }
        }
  </style>

  <div class="offer-banner">
  Free shipping on orders over $75 | Use code <span>STRIDE20</span> for 20% off
  your first order
</div>
<header>
  <div class="custom-container">
    <div class="header-content">
      <button class="mobile-menu-toggle" type="button" >
        <svg
          class="header-widget menu-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
        <svg
          class="header-widget close-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
      
     
      <a href = "/" class="header-logo">
        <div class="header-logo-svg">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
        </div>
        <span>Stride</span>
      </a>
      <nav>
        <a href="./shop.html">Shop</a>
        <a href="./Categories.html">Categories</a>
        <a href="./New-Arrivals.html">New Arrivals</a>
        <a href="./featured.html">Featured</a>
        <a href="./About.html">About</a>
        <a href="./branches.html">Branches</a>
      </nav>
      <div class="header-widgets">
        <!-- Search -->
        <button type="button" id="search-toggle">
          <svg
            class="header-widget header-widgets-search"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </button>
        <button type="button" id="theme-toggle" aria-label="Toggle dark mode">
          <svg
            class="header-widget header-widgets-light"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            ></path>
          </svg>
          <svg
            
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="header-widget header-widgets-dark"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
        </button>
        <a href="./wishlist.html" class="header-widget-wishlist">
          <svg
            class="header-widget"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
        </a>
        <a href="./cart.html" aria-label="Cart" class="header-widget-cart">
          <svg
            class="header-widget"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            ></path>
          </svg>
          <!-- Cart Count Badge -->
          <span id="cartCount" class="cart-count-badge">0</span>
        </a>
      </div>
    </div>
  </div>
  
      <div id="search-modal">
        <div class = "search-modal-content">
        <div class = "search-modal-input">
        <svg  fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg>
        <input type = "search" placeholder="Search shoes, brands, categories..." autofocus/>
        </div>
        <div class = "search-modal-popular">
        <span>Popualr</span>
        <a href = "./shop.html?category=running">Running</a>
        <a href = "./shop.html?category=sneakers">Sneakers</a>
        <a href = "./shop.html?category=boots">Boots</a>
        </div>
        <div class = "search-modal-escape">
         Press <kbd>Esc</kbd> to close
        </div>
        </div>
      </div>
      <div class = "mobile-menu">
       <nav class = "mobile-menu-nav">
        <a href="./shop.html">Shop</a>
        <a href="./Categories.html">Categories</a>
        <a href="./New-Arrivals.html">New Arrivals</a>
        <a href="./featured.html">Featured</a>
        <a href="./About.html">About</a>
        <a href="./branches.html">Branches</a>
        <div class = "mobile-menu-wedgets">
        <a href="./wishlist.html">Wishlist</a>
   
        </div>
      </nav>
      </div>
</header>

`;

export class SiteHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  connectedCallback() {
    const themeBtn = this.shadowRoot.querySelector('#theme-toggle');
    const lightIcon = this.shadowRoot.querySelector(".header-widgets-dark");
    const darkIcon = this.shadowRoot.querySelector(".header-widgets-light");

    const applyTheme = (theme) => {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);

      if (theme === "dark") {
        if (darkIcon) darkIcon.style.display = "none";
        if (lightIcon) lightIcon.style.display = "block";
      } else {
        if (lightIcon) lightIcon.style.display = "none";
        if (darkIcon) darkIcon.style.display = "block";
      }
    };

    const currentTheme = localStorage.getItem("theme") || "light";
    applyTheme(currentTheme);

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const activeTheme = localStorage.getItem("theme") || "light";
        const newTheme = activeTheme === "dark" ? "light" : "dark";

        localStorage.setItem("theme", newTheme);
        applyTheme(newTheme);
      });
    }

    const searchBtn = this.shadowRoot.querySelector('#search-toggle');
    const searchModal = this.shadowRoot.querySelector('#search-modal');
    const searchInput = this.shadowRoot.querySelector('.search-modal-input input');

    if (searchInput) {
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const searchValue = searchInput.value.trim();

          if (!searchValue) return;

          window.location.href =
            `./shop.html?search=${encodeURIComponent(searchValue)}`;
        }
      });
    }


    if (searchBtn && searchModal) {
      searchBtn.addEventListener('click', () => {
        searchModal.style.display = 'flex';
        if (searchInput) searchInput.focus();
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchModal.style.display === 'flex') {
          searchModal.style.display = 'none';
        }
      });

      searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
          searchModal.style.display = 'none';
        }
      });
    }

    const menuBtn = this.shadowRoot.querySelector('.mobile-menu-toggle');
    const closeIconMenu = this.shadowRoot.querySelector(".close-icon");
    const menuIcon = this.shadowRoot.querySelector(".menu-icon");
    const mobileMenu = this.shadowRoot.querySelector(".mobile-menu");
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', !isExpanded);
        if (isExpanded) {
          menuIcon.style.display = "none";
          closeIconMenu.style.display = "block";
          mobileMenu.style.display = "block";
        } else {
          closeIconMenu.style.display = "none";
          menuIcon.style.display = "block";
          mobileMenu.style.display = "none";
        }
      });
    }

    // Initialize cart badge from localStorage
    this._refreshBadge();
  }

  /**
   * Public method — call from any page script to update the cart badge.
   * @param {number} count  Total quantity of items in the cart.
   */
  updateCartBadge(count) {
    const badge = this.shadowRoot.querySelector('#cartCount');
    if (badge) {
      badge.textContent = count;
    }
  }

  /** Read localStorage and set the badge on first load */
  _refreshBadge() {
    try {
      const cartItems = JSON.parse(localStorage.getItem('cartProducts')) || [];
      const count = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
      this.updateCartBadge(count);
    } catch (_) {
      this.updateCartBadge(0);
    }
  }
}

customElements.define('site-header', SiteHeader);