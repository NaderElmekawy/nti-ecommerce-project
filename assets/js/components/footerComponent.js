const template = document.createElement('template');

template.innerHTML = `
  <style>
  @import "./assets/css/bootstrap.min.css";
    :host {
      display: block;
    }

    a {
      text-decoration: none;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    footer {
      background-color: var(--bg-modal);
    }

    /* Containers */
    .newsletter-container,
    .main-footer-container,
    .bottom-bar-container {
      max-width: 80rem;
      margin-inline: auto;
      padding-inline: 2rem;
    }

    .newsletter-container,
    .main-footer-container {
      padding-block: 4rem;
    }

    .bottom-bar-container {
      padding-block: 1.5rem;
    }

    /* Newsletter Section */
    footer .newsletter {
      border-bottom: 1px solid var(--border-header);
    }

    footer .newsletter .newsletter-content {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }

    .newsletter-content-left {
      text-align: left;
    }

    .newsletter-content-left h3 {
      font-family: "Outfit", sans-serif;
      font-size: 1.25rem;
      font-weight: bold;
      color: var(--text-logo);
      margin: 0;
    }

    .newsletter-content-left p {
      margin-top: 0.25rem;
      margin-bottom: 0;
      color: var(--color-widgets);
    }

    .newsletter-content form {
      display: flex;
      width: 100%;
      max-width: 28rem;
      gap: 0.75rem;
    }

    .newsletter-content form input {
      display: flex;
      width: 100%;
      border-radius: 1rem;
      border: 1px solid var(--border-modal);
      padding: 0.75rem 1rem;
      color: var(--color-gray-900);
      background-color: var(--bg-input);
      box-sizing: border-box;
    }

    .newsletter-content form input:focus {
      border-color: var(--color-primary-500);
      outline: none;
      box-shadow: 0 0 0 2px color-mix(in oklab, var(--color-primary-500) 20%, transparent);
    }

    .newsletter-content form button {
      border-radius: 0.5rem;
      background-color: var(--color-primary-600);
      padding: 0.75rem 1rem;
      font-weight: 600;
      color: white;
      transition: var(--transition-colors);
      outline: none;
      border: none;
      cursor: pointer;
    }

    .newsletter-content form button:hover {
      background-color: var(--color-primary-700);
    }

    /* Brand Section */
    .main-footer .brand a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: "Outfit", sans-serif;
      font-size: 1.25rem;
      font-weight: bold;
      color: var(--text-logo);
    }

    .main-footer .brand a div {
      display: flex;
      height: 2.25rem;
      width: 2.25rem;
      align-items: center;
      justify-content: center;
      border-radius: 0.75rem;
      background-image: linear-gradient(
        to bottom right,
        var(--color-primary-500),
        var(--color-primary-600)
      );
    }

    .main-footer .brand a div svg {
      width: 1.5rem;
      height: 1.5rem;
      color: white;
    }

    .main-footer .brand > p {
      margin-top: 1rem;
      font-size: 0.875rem;
      color: var(--color-widgets);
    }

    .main-footer .brand .brand-social {
      margin-top: 1.5rem;
      display: flex;
      gap: 1rem;
    }

    .main-footer .brand .brand-social a {
      color: var(--color-gray-400);
      transition: var(--transition-colors);
    }

    .main-footer .brand .brand-social a:hover {
      color: var(--color-primary-600);
    }

    .main-footer .brand .brand-social a svg {
      height: 1.25rem;
      width: 1.25rem;
    }

    /* Custom Footer Sections */
    .custom-section-footer h4 {
      font-weight: 600;
      color: var(--text-logo);
      margin: 0;
    }

    .custom-section-footer ul {
      margin-top: 1rem;
    }

    .custom-section-footer ul li {
      margin-bottom: 0.5rem;
    }

    .custom-section-footer ul li a {
      font-size: 0.875rem;
      color: var(--color-widgets);
      transition: var(--transition-colors);
    }

    .custom-section-footer ul li a:hover {
      color: var(--color-primary-600);
    }

    /* Bottom Bar */
    footer .bottom-bar {
      border-top: 1px solid var(--border-header);
    }

    footer .bottom-bar .bottom-bar-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    footer .bottom-bar .bottom-bar-container > p {
      font-size: 0.875rem;
      color: var(--color-gray-500);
      margin: 0;
    }

    .bottom-bar-left {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .bottom-bar-left a {
      font-size: 0.875rem;
      color: var(--color-gray-500);
      transition: var(--transition-colors);
    }

    .bottom-bar-left a:hover {
      color: var(--text-navLink);
    }

    /* Payment Icons */
    .payment-icons {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .payment-icon-container {
      display: flex;
      height: 1.5rem;
      width: 2.25rem;
      align-items: center;
      justify-content: center;
      border-radius: 0.25rem;
    }

    .visa-icon-container {
      background-color: #1a1f71;
    }

    .visa-icon-container span {
      font-weight: bold;
      font-style: italic;
      color: white;
      font-size: 0.75rem;
    }

    .card-icon-container {
      background: var(--color-gray-100);
    }

    .card-icon-container svg {
      width: 1rem;
      height: 1rem;
    }

    .amex-icon-container {
      background-color: #006fcf;
    }

    .amex-icon-container span {
      font-weight: bold;
      color: white;
      font-size: 0.5rem;
    }

    .pay-icon-container {
      background-color: black;
    }

    .pay-icon-container span {
      font-weight: bold;
      color: white;
      font-size: 0.625rem;
    }

    /* Clean & Grouped Media Queries */
    @media (max-width: 1024px) {
      .main-footer-container {
        padding-block: 3rem;
      }

      .newsletter-container,
      .bottom-bar-container,
      .main-footer-container {
        padding-inline: 1rem;
      }
    }

    @media (max-width: 640px) {
      footer .newsletter .newsletter-content {
        flex-direction: column;
        text-align: center;
      }

      .newsletter-content-left {
        text-align: center;
      }

      .newsletter-content form {
        flex-direction: column;
      }

      .bottom-bar-left {
        flex-direction: column;
      }

      footer .bottom-bar .bottom-bar-container {
        flex-direction: column;
      }
    }
  </style>

  <footer>
    <!-- Newsletter -->
    <div class="newsletter">
      <div class="newsletter-container">
        <div class="newsletter-content">
          <div class="newsletter-content-left">
            <h3>Join the Stride Club</h3>
            <p>
              Get 15% off your first order, plus early access to new drops.
            </p>
          </div>
          <form id="newsletter-form">
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Main Footer -->
    <div class="main-footer-container">
      <div class="row main-footer g-4">
        <!-- Brand -->
        <div class="col-lg-3 col-md-4 col-sm-6 brand">
          <a href="/">
            <div>
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
          <p>
            Premium footwear for every step of your journey. From athletic
            performance to everyday comfort.
          </p>
          <div class="brand-social">
            <a href="#" aria-label="Instagram">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                ></path>
              </svg>
            </a>
            <a href="#" aria-label="Facebook">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                ></path>
              </svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                ></path>
              </svg>
            </a>
            <a href="#" aria-label="YouTube">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                ></path>
              </svg>
            </a>
            <a href="#" aria-label="TikTok">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
                ></path>
              </svg>
            </a>
          </div>
        </div>

        <!-- Shop -->
        <div class="col-lg-3 col-md-4 col-sm-6 shop custom-section-footer">
          <h4>Shop</h4>
          <ul>
            <li><a href="./shop.html?category=running">Running</a></li>
            <li><a href="./shop.html?category=sneakers">Sneakers</a></li>
            <li><a href="./shop.html?category=basketball">Basketball</a></li>
            <li><a href="./shop.html?category=casual">Casual</a></li>
            <li><a href="./shop.html?category=boots">Boots</a></li>
            <li><a href="./shop.html?category=sandals">Sandals</a></li>
          </ul>
        </div>

        <!-- Help -->
        <div class="col-lg-3 col-md-4 col-sm-6 help custom-section-footer">
          <h4>Help</h4>
          <ul>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/shipping">Shipping &amp; Returns</a></li>
            <li><a href="/size-guide">Size Guide</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/track-order">Track Order</a></li>
          </ul>
        </div>

        <!-- About -->
        <div class="col-lg-3 col-md-4 col-sm-6 custom-section-footer">
          <h4>About</h4>
          <ul>
            <li><a href="/about">Our Story</a></li>
            <li><a href="/sustainability">Sustainability</a></li>
            <li><a href="/athletes">Athletes</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/stores">Store Locator</a></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="bottom-bar">
      <div class="bottom-bar-container">
        <p>© 2026 Stride. All rights reserved.</p>
        <div class="bottom-bar-left">
          <div>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
          <!-- Payment Icons -->
          <div class="payment-icons">
            <div class="payment-icon-container visa-icon-container">
              <span>VISA</span>
            </div>
            <div class="payment-icon-container card-icon-container">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="12" r="6" fill="#EB001B"></circle>
                <circle cx="15" cy="12" r="6" fill="#F79E1B"></circle>
                <path
                  d="M12 7.5a6 6 0 000 9 6 6 0 000-9z"
                  fill="#FF5F00"
                ></path>
              </svg>
            </div>
            <div class="payment-icon-container amex-icon-container">
              <span>AMEX</span>
            </div>
            <div class="payment-icon-container pay-icon-container">
              <span>Pay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
`;

export class SiteFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const form = this.shadowRoot.querySelector('#newsletter-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input');
        if (input && input.value) {
          alert(`Thank you for subscribing, ${input.value}!`);
          input.value = '';
        }
      });
    }
  }
}

customElements.define('site-footer', SiteFooter);