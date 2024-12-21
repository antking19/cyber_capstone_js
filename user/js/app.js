import { fetchProducts } from "./api.js";
import { addToCart, getCart, updateQuantity, clearCart } from "./cart.js";

const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart-list");
const totalPrice = document.getElementById("total-price");

const renderProducts = (products) => {
    productList.innerHTML = products.map(product => `
        <div class="product">
            <h3>${product.name}</h3>
            <p>${product.price} VND</p>
            <button onclick="handleAddToCart(${product.id})">Thêm vào giỏ</button>
        </div>
    `).join("");
};

const renderCart = () => {
    const cart = getCart();
    cartList.innerHTML = cart.map(item => `
        <div>
            <p>${item.name} x ${item.quantity}</p>
            <button onclick="handleUpdateQuantity(${item.id}, -1)">-</button>
            <button onclick="handleUpdateQuantity(${item.id}, 1)">+</button>
        </div>
    `).join("");
    totalPrice.textContent = `Tổng tiền: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)} VND`;
};

window.handleAddToCart = (id) => {
    fetchProducts().then(products => {
        const product = products.find(p => p.id === id);
        addToCart(product);
        renderCart();
    });
};

window.handleUpdateQuantity = (id, delta) => {
    const cart = getCart();
    const item = cart.find(item => item.id === id);
    if (item) updateQuantity(id, item.quantity + delta);
    renderCart();
};

document.getElementById("checkout").addEventListener("click", () => {
    clearCart();
    renderCart();
});

fetchProducts().then(renderProducts);
