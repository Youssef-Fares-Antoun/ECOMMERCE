// Get cart items from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Cart container (only exists on cart.html)
let cartContainer = document.getElementById('cartItems');

if (cartContainer) {
  // Clear existing content
  cartContainer.innerHTML = "";

  // Render each cart item
  cart.forEach(item => {
    // Create item container
    let itemDiv = document.createElement('div');
    itemDiv.classList.add('cart-item');

    // Make sure image path is correct relative to cart.html
    let imgPath = item.image;
    if (!imgPath.startsWith('/') && !imgPath.startsWith('http')) {
      imgPath = imgPath.replace(/^(\.\.\/)+/, ''); // Remove any '../' from relative paths
      imgPath = 'images/' + imgPath.split('/').pop(); // Use only the filename
    }

    // Set inner HTML
    itemDiv.innerHTML = `
      <img src="${imgPath}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">LE ${item.price}</p>
        <p class="cart-item-quantity">Quantity: ${item.quantity}</p>
      </div>
    `;

    cartContainer.appendChild(itemDiv);
  });
}

// ✅ Update cart indicator (green dot)
function updateCartIndicator() {
  const indicator = document.getElementById("cart-indicator") || document.getElementById("cart-count");
  if (!indicator) return; // safeguard if element missing

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  if (cart.length > 0) {
    indicator.classList.add("active");
    indicator.style.display = 'block';
  } else {
    indicator.classList.remove("active");
    indicator.style.display = 'none';
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", updateCartIndicator);