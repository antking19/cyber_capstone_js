import Api from "./../services/api.js";
import Product from "./../models/Product.js";

const getEleId = (id) => document.getElementById(id);

const renderListProduct = (data) => {
    let content = "";
    data.forEach((product, i) => {
        const {
            id,
            name,
            price,
            screen,
            backCamera,
            frontCamera,
            img,
            desc,
            type,
        } = product;
        content += `
            <tr>
                <th>${i + 1}</th>
                <td>${name}</td>
                <td>${price}</td>
                <td>${screen}</td>
                <td>${backCamera}</td>
                <td>${frontCamera}</td>
                <td>
                    <img src="${img}" alt="" width="50">
                </td>
                <td>${desc}</td>
                <td>${type}</td>
                <td>
                    <button class="btn btn-primary">Edit</button>
                    <button class="btn btn-danger" onclick="handleDelete('${id}')">Delete</button>
                </td>
            </tr>
        `;
    });

    getEleId("tblProductList").innerHTML = content;
};

getEleId("btnAddProduct").addEventListener("click", () => {
    document.getElementsByClassName("modal-title")[0].innerHTML =
        "Thêm Sản Phẩm";
    const addButton = `<button class="btn btn-warning" onclick="handleAdd()">Thêm</button>`;
    document.getElementsByClassName("modal-footer")[0].innerHTML = addButton;
});

const handleAdd = () => {
    const name = getEleId("productName").value;
    const price = getEleId("productPrice").value;
    const screen = getEleId("productScreen").value;
    const backCamera = getEleId("productBackCamera").value;
    const frontCamera = getEleId("productFrontCamera").value;
    const img = getEleId("productImg").value;
    const type = getEleId("productType").value;
    const desc = getEleId("productDesc").value;

    const product = new Product(
        "",
        name,
        price,
        screen,
        backCamera,
        frontCamera,
        img,
        desc,
        type
    );

    const promise = Api.addData(product);

    promise
        .then((result) => {
            alert("Add product success!");
            getListProduct();
            document.getElementsByClassName("btn-close")[0].click();
        })
        .catch((error) => {
            console.log(error);
        });
};
window.handleAdd = handleAdd;

/**
 * handleDelete
 */
const handleDelete = (id) => {
    const promise = Api.deleteDataById(id);

    promise
        .then((result) => {
            alert(`Delete product id: ${result.data.id} success!`);
            getListProduct();
        })
        .catch((error) => {
            console.log(error);
        });
};
window.handleDelete = handleDelete;

const getListProduct = () => {
    const promise = Api.fetchData();

    promise
        .then((result) => {
            console.log(result.data);
            renderListProduct(result.data);
        })
        .catch((error) => {
            console.log(error);
        });
};

getListProduct();
