const apiURL = "https://63fca4e9859df29986c363be.mockapi.io/products"; // Link MockAPI
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Product class
class Product {
    constructor(id, name, price, type) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.type = type;
    }
}

// Cart item class
class CartItem {
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
    }
}

// Fetch products from MockAPI
async function fetchProducts() {
    const response = await fetch(apiURL);
    products = await response.json();
    renderProducts(products);
}

// Render product list
function renderProducts(productArray) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    productArray.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <p>Type: ${product.type}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productDiv);
    });
}

// Filter products by type
function filterProducts() {
    const filterValue = document.getElementById('filter').value;
    const filteredProducts = filterValue ? products.filter(p => p.type === filterValue) : products;
    renderProducts(filteredProducts);
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingCartItem = cart.find(item => item.product.id === productId);

    if (existingCartItem) {
        existingCartItem.quantity += 1;
    } else {
        cart.push(new CartItem(product, 1));
    }

    saveCart();
    renderCart();
}

// Render cart
function renderCart() {
    const cartDiv = document.getElementById('cart');
    cartDiv.innerHTML = '';

    cart.forEach((item, index) => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <p>${item.product.name} - $${item.product.price} x ${item.quantity}</p>
            <button onclick="updateQuantity(${index}, 1)">+</button>
            <button onclick="updateQuantity(${index}, -1)">-</button>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartDiv.appendChild(cartItemDiv);
    });

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const totalDiv = document.createElement('div');
    totalDiv.className = 'total';
    totalDiv.innerText = `Total: $${total}`;
    cartDiv.appendChild(totalDiv);
}

// Update quantity in cart
function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    renderCart();
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

// Checkout and clear cart
function checkout() {
    alert('Thank you for your purchase!');
    cart = [];
    saveCart();
    renderCart();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Initialize
fetchProducts();
renderCart();
