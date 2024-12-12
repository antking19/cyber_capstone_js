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
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="handleEdit('${id}')">Edit</button>
                    <button class="btn btn-danger" onclick="handleDelete('${id}')">Delete</button>
                </td>
            </tr>
        `;
    });

    getEleId("tblProductList").innerHTML = content;
};

/**
 * handleEdit
 */
const handleEdit = (id) => {
    document.getElementsByClassName("modal-title")[0].innerHTML =
        "Sửa Sản Phẩm";
    const updateButton = `<button class="btn btn-success" onclick="handleUpdate('${id}')">Cập Nhật</button>`;
    document.getElementsByClassName("modal-footer")[0].innerHTML = updateButton;

    const promise = Api.getDataById(id);

    promise
        .then((result) => {
            const { data } = result;
            getEleId("productName").value = data.name;
            getEleId("productPrice").value = data.price;
            getEleId("productScreen").value = data.screen;
            getEleId("productBackCamera").value = data.backCamera;
            getEleId("productFrontCamera").value = data.frontCamera;
            getEleId("productImg").value = data.img;
            getEleId("productType").value = data.type;
            getEleId("productDesc").value = data.desc;
        })
        .catch((error) => {
            console.log(error);
        });
};
window.handleEdit = handleEdit;

/**
 * handleUpdate
 */
const handleUpdate = (id) => {
    const name = getEleId("productName").value;
    const price = getEleId("productPrice").value;
    const screen = getEleId("productScreen").value;
    const backCamera = getEleId("productBackCamera").value;
    const frontCamera = getEleId("productFrontCamera").value;
    const img = getEleId("productImg").value;
    const type = getEleId("productType").value;
    const desc = getEleId("productDesc").value;

    const product = new Product(
        id,
        name,
        price,
        screen,
        backCamera,
        frontCamera,
        img,
        desc,
        type
    );

    const promise = Api.updateData(product);

    promise
        .then((result) => {
            alert(`Update product id: ${result.data.id}`);
            getListProduct();
            document.getElementsByClassName("btn-close")[0].click();
        })
        .catch((error) => {
            console.log(error);
        });
};
window.handleUpdate = handleUpdate;

getEleId("btnAddProduct").addEventListener("click", () => {
    document.getElementsByClassName("modal-title")[0].innerHTML =
        "Thêm Sản Phẩm";
    const addButton = `<button class="btn btn-success" onclick="handleAdd()">Thêm</button>`;
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
            renderListProduct(result.data);
        })
        .catch((error) => {
            console.log(error);
        });
};

getListProduct();

/**
 * Search Product
 */
getEleId("searchProduct").addEventListener("keyup", () => {
    const keyword = getEleId("searchProduct").value;

    const promise = Api.fetchData();

    promise
        .then((result) => {
            const productSearch = searchProduct(keyword, result.data);
            if (productSearch.length > 0) {
                renderListProduct(productSearch);
            }
        })
        .catch((error) => {
            console.log(error);
        });
});

const searchProduct = (keyword, productList) => {
    let result = [];
    for (let i = 0; i < productList.length; i++) {
        const product = productList[i];
        const keywordLowerCase = keyword.toLowerCase();
        const productLowerCase = product.name.toLowerCase();

        if (productLowerCase.indexOf(keywordLowerCase) !== -1) {
            result.push(product);
        }
    }
    return result;
};
