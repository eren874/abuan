// Products Array
const products = [
  { id: 1, name: 'Cap', price: 15.99, image: 'cap.jpg' },
  { id: 2, name: 'Bag', price: 49.99, image: 'bag.jpg' },
  { id: 3, name: 'T-Shirt', price: 19.5, image: 'tshirt.jpg' },
  { id: 4, name: 'Jeans', price: 39.99, image: 'jeans.jpg' },
  { id: 5, name: 'Shoes', price: 59.99, image: 'shoes.jpg' },
];

// Navigation and Page Controls
const navLinks = document.querySelectorAll('#nav-links .nav-link');
const pages = {
  home: document.getElementById('page-home'),
  products: document.getElementById('page-products'),
  cart: document.getElementById('page-cart'),
  checkout: document.getElementById('page-checkout'),
  contact: document.getElementById('page-contact'),
};
const cartCountElem = document.getElementById('cart-count');
const shopNowBtn = document.getElementById('shop-now-btn');
const continueShoppingBtn = document.getElementById('continue-shopping-btn');
const proceedCheckoutBtn = document.getElementById('proceed-checkout-btn');
const checkoutBackBtn = document.getElementById('checkout-back-btn');

// Cart State Management
let cart = JSON.parse(localStorage.getItem('shokippie-cart')) || [];

// Utility to save cart to localStorage
function saveCart() {
  localStorage.setItem('shokippie-cart', JSON.stringify(cart));
}

// Update cart count badge in navbar
function updateCartCount() {
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCountElem.textContent = count ? count : '';
  proceedCheckoutBtn.disabled = count === 0;
}

// Format price as USD currency string
function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

// Render products listing dynamically
function renderProducts() {
  const productsList = document.getElementById('products-list');
  productsList.innerHTML = '';
  products.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-6 col-md-4 col-lg-3 d-flex';
    const card = document.createElement('div');
    card.className = 'product-card flex-fill';
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `${product.name}, Price ${formatPrice(product.price)}`);

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    img.loading = 'lazy';
    img.draggable = false;
    card.appendChild(img);

    const name = document.createElement('h5');
    name.textContent = product.name;
    card.appendChild(name);

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = formatPrice(product.price);
    card.appendChild(price);

    const btn = document.createElement('button');
    btn.className = 'btn btn-primary btn-sm w-100';
    btn.textContent = 'Add to Cart';
    btn.setAttribute('aria-label', `Add ${product.name} to cart`);
    btn.addEventListener('click', () => {
      addToCart(product.id);
    });
    card.appendChild(btn);

    col.appendChild(card);
    productsList.appendChild(col);
  });
}

// Add item to cart or update quantity
function addToCart(productId, quantity = 1) {
  const index = cart.findIndex(item => item.id === productId);
  if (index !== -1) {
    cart[index].quantity += quantity;
  } else {
    const product = products.find(p => p.id === productId);
    if (product) {
      cart.push({ ...product, quantity: quantity });
    }
  }
  saveCart();
  updateCartCount();
  alert('Product added to cart.');
}

// Render cart items in the cart page
function renderCart() {
  const cartBody = document.getElementById('cart-items-body');
  const emptyMsg = document.getElementById('empty-cart-msg');
  cartBody.innerHTML = '';
  if (cart.length === 0) {
    emptyMsg.classList.remove('d-none');
    proceedCheckoutBtn.disabled = true;
    return;
  } else {
    emptyMsg.classList.add('d-none');
    proceedCheckoutBtn.disabled = false;
  }
  cart.forEach(item => {
    const tr = document.createElement('tr');
    // Product name
    const tdName = document.createElement('td');
    tdName.textContent = item.name;
    tr.appendChild(tdName);

    // Product image (hide on xs)
    const tdImg = document.createElement('td');
    tdImg.className = 'd-none d-md-table-cell';
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    tdImg.appendChild(img);
    tr.appendChild(tdImg);

    // Price
    const tdPrice = document.createElement('td');
    tdPrice.textContent = formatPrice(item.price);
    tr.appendChild(tdPrice);

    // Quantity input
    const tdQty = document.createElement('td');
    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.min = '1';
    qtyInput.value = item.quantity;
    qtyInput.setAttribute('aria-label', `Quantity for ${item.name}`);
    qtyInput.className = 'form-control form-control-sm';
    qtyInput.style.maxWidth = '80px';
    qtyInput.addEventListener('change', (e) => {
      let val = parseInt(e.target.value, 10);
      if (isNaN(val) || val < 1) {
        val = 1;
        e.target.value = 1;
      }
      updateCartItemQuantity(item.id, val);
    });
    tdQty.appendChild(qtyInput);
    tr.appendChild(tdQty);

    // Subtotal
    const tdSubtotal = document.createElement('td');
    tdSubtotal.textContent = formatPrice(item.price * item.quantity);
    tdSubtotal.id = `subtotal-${item.id}`;
    tr.appendChild(tdSubtotal);

    // Remove button
    const tdRemove = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-danger btn-sm';
    removeBtn.setAttribute('aria-label', `Remove ${item.name} from cart`);
    removeBtn.innerHTML = '&times;';
    removeBtn.addEventListener('click', () => {
      removeFromCart(item.id);
    });
    tdRemove.appendChild(removeBtn);
    tr.appendChild(tdRemove);

    cartBody.appendChild(tr);
  });
  updateCartTotal();
}

// Update quantity of product in cart
function updateCartItemQuantity(productId, quantity) {
  const index = cart.findIndex(item => item.id === productId);
  if (index !== -1) {
    cart[index].quantity = quantity;
    saveCart();
    renderCart();
    updateCartCount();
  }
}

// Remove product from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  renderCart();
  updateCartCount();
}

// Calculate and update total price in cart page
function updateCartTotal() {
  const cartTotalElem = document.getElementById('cart-total');
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotalElem.textContent = formatPrice(total);
}

// Navigation for single page sections
function showPage(page) {
  Object.entries(pages).forEach(([key, elem]) => {
    if (key === page) {
      elem.classList.remove('d-none');
    } else {
      elem.classList.add('d-none');
    }
  });
  navLinks.forEach(link => {
    if (link.getAttribute('data-page') === page) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
  if (page === 'products') renderProducts();
  if (page === 'cart') renderCart();
  if (page === 'checkout') {
    // Reset checkout form and messages
    document.getElementById('checkout-form').reset();
    document.getElementById('order-success-msg').classList.add('d-none');
  }
  // Focus main heading on page switch for accessibility
  setTimeout(() => {
    const heading = document.querySelector(`#page-${page} h2,h1`);
    if (heading) heading.focus();
  }, 100);
}

// Event Listeners setup
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = e.target.getAttribute('data-page');
    showPage(page);
  });
});
shopNowBtn.addEventListener('click', () => showPage('products'));
continueShoppingBtn.addEventListener('click', () => showPage('products'));
proceedCheckoutBtn.addEventListener('click', () => showPage('checkout'));
checkoutBackBtn.addEventListener('click', () => showPage('cart'));

// Checkout form submission & validation
const checkoutForm = document.getElementById('checkout-form');
checkoutForm.addEventListener('submit', function(e){
  e.preventDefault();
  if (!checkoutForm.checkValidity()) {
    checkoutForm.classList.add('was-validated');
    return;
  }
  // Check cart is not empty
  if (cart.length === 0) {
    alert('Your cart is empty. Please add some products before checking out.');
    showPage('products');
    return;
  }

  // Simulate order processing
  document.getElementById('order-success-msg').classList.remove('d-none');
  cart = [];
  saveCart();
  updateCartCount();
  renderCart();
  checkoutForm.classList.remove('was-validated');
  checkoutForm.reset();

  // Focus on success message for screen readers
  document.getElementById('order-success-msg').focus();
});

// Contact form validation and submission simulation
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', function(e){
  e.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.classList.add('was-validated');
    return;
  }
  // Simulate form submission success
  document.getElementById('contact-success-msg').classList.remove('d-none');
  contactForm.classList.remove('was-validated');
  contactForm.reset();

  // Focus on success message for accessibility
  document.getElementById('contact-success-msg').focus();
});

// Initialization
updateCartCount();
renderProducts();
showPage('home');
