// =====================
// CART SYSTEM
// =====================

// Load cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add product to cart
function addToCart(name, price, image, redirect = false) {
  let cart = getCart();

  // Get size & quantity from inputs (if available)
  const sizeInput = document.getElementById("size");
  const size = sizeInput ? sizeInput.value : "Default";

  const quantityInput = document.getElementById("quantity");
  const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

  // Get current main image if exists (always save relative path)
  const mainImage = document.getElementById("mainImage");
  let imagePath = mainImage ? mainImage.getAttribute("src") : image;

  // ✅ Normalize image path (remove leading slash if exists)
  imagePath = imagePath.replace(/^\//, "");

  // Check if same product + size already exists
  const existing = cart.find(item => item.name === name && item.size === size);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ name, price, image: imagePath, size, quantity });
  }

  saveCart(cart);
  updateCartIndicator(); // ✅ Update green circle when adding

  if (redirect) {
    window.location.href = "cart.html";
  }
}

// =====================
// CUSTOM ADD TO CART POPUP (CENTERED)
// =====================
function addToCartWithPopup(name, price, image) {
  addToCart(name, price, image, false);

  const sizeInput = document.getElementById("size");
  const size = sizeInput ? sizeInput.value : "Default";

  const quantityInput = document.getElementById("quantity");
  const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

  // Create modal if it doesn’t exist
  let modal = document.getElementById("cartModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "cartModal";
    modal.className = "cart-modal";
    modal.innerHTML = `
      <div class="cart-modal-content">
        <p id="cartModalMessage"></p>
        <div class="cart-modal-actions">
          <button id="continueShoppingBtn" style="background:#145214;color:#fff;padding:10px 18px;border:none;border-radius:6px;cursor:pointer;">Continue Shopping</button>
          <button id="viewCartBtn" style="background:#007bff;color:#fff;padding:10px 18px;border:none;border-radius:6px;cursor:pointer;">Go to Cart</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const message = document.getElementById("cartModalMessage");
  const viewCartBtn = document.getElementById("viewCartBtn");
  const continueBtn = document.getElementById("continueShoppingBtn");

  message.textContent = `${quantity} × ${name} (Size: ${size}) has been added to your cart.`;
  modal.style.display = "flex"; // flex centers it

  viewCartBtn.onclick = () => {
    modal.style.display = "none";
    window.location.href = "cart.html";
  };

  continueBtn.onclick = () => {
    modal.style.display = "none";
  };

  // Close modal when clicking outside
  window.addEventListener("click", function outsideClick(e) {
    if (e.target === modal) {
      modal.style.display = "none";
      window.removeEventListener("click", outsideClick);
    }
  });
}

// =====================
// CART PAGE FUNCTIONS
// =====================
function removeFromCart(name, size) {
  let cart = getCart().filter(item => !(item.name === name && item.size === size));
  saveCart(cart);
  displayCart();
  updateCartIndicator();
}

function updateQuantity(name, size, change) {
  let cart = getCart();
  let item = cart.find(i => i.name === name && i.size === size);

  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter(i => !(i.name === name && i.size === size));
    }
  }

  saveCart(cart);
  displayCart();
  updateCartIndicator();
}

function displayCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  if (!cartItemsContainer || !cartTotal) return;

  const cart = getCart();
  let total = 0;
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "LE 0.00";
    return;
  }

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    let imgSrc = item.image.replace(/^\//, "");
    if (!imgSrc.startsWith("images/")) {
        imgSrc = "images/" + imgSrc.split('/').pop();
    }

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${imgSrc}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p>Size: ${item.size}</p>
        <p>Price: LE ${item.price}</p>
        <div class="quantity-controls">
          <button class="qty-btn" onclick="updateQuantity('${item.name}', '${item.size}', -1)">−</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity('${item.name}', '${item.size}', 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart('${item.name}', '${item.size}')">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotal.textContent = "LE " + total.toFixed(2);
}

// =====================
// CART INDICATOR
// =====================
function updateCartIndicator() {
  const cart = getCart();
  const indicator = document.getElementById("cart-indicator") || document.getElementById("cart-count") || document.getElementById("cartCount");
  if (!indicator) return;

  if (cart.length > 0) {
    indicator.style.display = "block";
    indicator.classList.add("active");
  } else {
    indicator.style.display = "none";
    indicator.classList.remove("active");
  }
}

// =====================
// HELPER: APPLY BRAND FILTER
// =====================
function applyBrandFilter(brand, products, brandFilter) {
  products.forEach(product => {
    const productBrand = product.getAttribute("data-brand");
    product.style.display = (brand === "all" || productBrand.toLowerCase() === brand.toLowerCase()) ? "flex" : "none";
  });
  if (brandFilter) {
    brandFilter.querySelectorAll("li").forEach(li => li.classList.remove("active"));
    brandFilter.querySelectorAll(`li[data-brand="${brand}"]`).forEach(li => li.classList.add("active"));
  }
  const heading = document.querySelector(".sortbar p strong");
  if (heading) {
    heading.textContent = brand === "all" ? "Showing All Products" : `Showing ${brand.charAt(0).toUpperCase() + brand.slice(1)} Products`;
  }
}

// =====================
// SEARCH & FILTER SYSTEM
// =====================
function initSearchFilter() {
  const searchIcon = document.getElementById("searchIcon") || document.getElementById("searchToggle");
  const searchInput = document.getElementById("searchInput");
  const brandFilter = document.getElementById("brandFilter");
  const products = document.querySelectorAll(".products .grid .card");
  const sortSelect = document.getElementById("sortSelect");
  const grid = document.getElementById("productGrid");

  // 1. Search Logic
  if (searchIcon && searchInput) {
    searchIcon.addEventListener("click", (e) => {
      e.preventDefault();
      searchInput.classList.toggle("active");
      if (searchInput.classList.contains("active")) searchInput.focus();
    });

    searchInput.addEventListener("keyup", () => {
      const filter = searchInput.value.toLowerCase();
      products.forEach(product => {
        const name = product.querySelector("h4").textContent.toLowerCase();
        product.style.display = name.includes(filter) ? "flex" : "none";
      });
    });
  }

  // 2. Brand Filter Logic
  if (brandFilter) {
    brandFilter.addEventListener("click", e => {
      if (e.target.tagName === "LI") {
        const brand = e.target.getAttribute("data-brand");
        applyBrandFilter(brand, products, brandFilter);
      }
    });
  }

  // 3. Sorting Logic (Corrected and placed inside)
  if (sortSelect && grid) {
    sortSelect.addEventListener("change", () => {
      let cards = Array.from(grid.querySelectorAll(".card"));

      switch (sortSelect.value) {
        case "low-high":
          cards.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
          break;
        case "high-low":
          cards.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
          break;
        case "a-z":
          cards.sort((a, b) => {
            const nameA = a.querySelector("h4").textContent.toLowerCase();
            const nameB = b.querySelector("h4").textContent.toLowerCase();
            return nameA.localeCompare(nameB);
          });
          break;
        case "z-a":
          cards.sort((a, b) => {
            const nameA = a.querySelector("h4").textContent.toLowerCase();
            const nameB = b.querySelector("h4").textContent.toLowerCase();
            return nameB.localeCompare(nameA);
          });
          break;
      }

      // Re-append the cards
      cards.forEach(card => grid.appendChild(card));
    });
  }
}

// ==================================
// ✅ MAIN INITIALIZATION
// ==================================
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all functions
  displayCart(); 
  initSearchFilter(); 
  updateCartIndicator(); 

  // Initialize hamburger menu
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("nav-active");
      hamburger.classList.toggle("active");
    });
  }
});
