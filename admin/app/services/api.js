class Api {
    fetchData() {
        const promise = axios({
            url: "https://6759bf4b099e3090dbe2cbe5.mockapi.io/api/Product",
            method: "GET",
        });

        return promise;
    }

    deleteDataById(id) {
        const promise = axios({
            url: `https://6759bf4b099e3090dbe2cbe5.mockapi.io/api/Product/${id}`,
            method: "DELETE",
        });

        return promise;
    }

    addData(product) {
        const promise = axios({
            url: "https://6759bf4b099e3090dbe2cbe5.mockapi.io/api/Product",
            method: "POST",
            data: product,
        });

        return promise;
    }

    getDataById(id) {
        const promise = axios({
            url: `https://6759bf4b099e3090dbe2cbe5.mockapi.io/api/Product/${id}`,
            method: "GET",
        });

        return promise;
    }

    updateData(product) {
        const promise = axios({
            url: `https://6759bf4b099e3090dbe2cbe5.mockapi.io/api/Product/${product.id}`,
            method: `PUT`,
            data: product,
        });

        return promise;
    }
}
export default new Api();
