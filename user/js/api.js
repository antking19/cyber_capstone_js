const API_URL = "https://6759bf4b099e3090dbe2cbe5.mockapi.io/api/Product";

export const fetchProducts = async () => {
    const response = await fetch(API_URL);
    return response.json();
};
