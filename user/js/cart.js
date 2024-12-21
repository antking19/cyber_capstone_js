let cart = JSON.parse(localStorage.getItem("cart")) || [];

export const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
};

export const removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    saveCart();
};

export const updateQuantity = (id, quantity) => {
    const product = cart.find(item => item.id === id);
    if (product) {
        product.quantity = quantity;
        if (product.quantity <= 0) removeFromCart(id);
    }
    saveCart();
};

export const clearCart = () => {
    cart = [];
    saveCart();
};

const saveCart = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

export const getCart = () => cart;
