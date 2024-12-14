import Api from "./../services/api.js";
import Product from "./../models/Product.js";
import Validation from "../models/validation.js";

export const getEleId = (id) => document.getElementById(id);

// create new object from class Validation
const validation = new Validation();

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

    closeInvalid();
};
window.handleEdit = handleEdit;

/**
 * getInfoProduct
 */
const getInfoProduct = (id) => {
    const name = getEleId("productName").value;
    const price = getEleId("productPrice").value;
    const screen = getEleId("productScreen").value;
    const backCamera = getEleId("productBackCamera").value;
    const frontCamera = getEleId("productFrontCamera").value;
    const img = getEleId("productImg").value;
    const type = getEleId("productType").value;
    const desc = getEleId("productDesc").value;

    let isValid = true;
    isValid &= validation.checkEmpty(
        name,
        "invalidName",
        "Mời bạn nhập tên sản phẩm"
    );

    isValid &=
        validation.checkEmpty(
            price,
            "invalidPrice",
            "Mời bạn nhập giá sản phẩm"
        ) &&
        validation.checkNumberPrice(
            price,
            "invalidPrice",
            "Mời bạn nhập giá tiền là số"
        );

    isValid &= validation.checkEmpty(
        screen,
        "invalidScreen",
        "Mời bạn nhập màn hình"
    );

    isValid &= validation.checkEmpty(
        backCamera,
        "invalidBackCamera",
        "Mời bạn nhập camera sau"
    );

    isValid &= validation.checkEmpty(
        frontCamera,
        "invalidFrontCamera",
        "Mời bạn nhập camera trước"
    );

    isValid &= validation.checkEmpty(
        img,
        "invalidImg",
        "Mời bạn nhập hình ảnh"
    );

    isValid &= validation.checkSelect(
        "productType",
        "invalidType",
        "Mời bạn chọn loại sản phẩm"
    );

    isValid &= validation.checkEmpty(desc, "invalidDesc", "Mời bạn nhập mô tả");
    if (!isValid) return null;

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

    return product;
};

/**
 * handleUpdate
 */
const handleUpdate = (id) => {
    const product = getInfoProduct(id);

    if (product === null) return;

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

    getEleId("formProduct").reset();

    closeInvalid();
});

const handleAdd = () => {
    const product = getInfoProduct("");

    if (product === null) return;

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

/**
 * Filter Price
 */
getEleId("filterPrice").addEventListener("change", () => {
    const type = getEleId("filterPrice").value;

    const promise = Api.fetchData();

    promise
        .then((result) => {
            const productFilter = filterProduct(type, result.data);
            renderListProduct(productFilter);
        })
        .catch((error) => console.log(error));
});

const filterProduct = (type, productList) => {
    if (type === "all") {
        return productList;
    } else {
        if (type === "giamDan") {
            for (let i = 0; i < productList.length; i++) {
                for (let j = i + 1; j < productList.length; j++) {
                    if (productList[i].price < productList[j].price) {
                        let temp = productList[i];
                        productList[i] = productList[j];
                        productList[j] = temp;
                    }
                }
            }
            return productList;
        }
        if (type === "tangDan") {
            for (let i = 0; i < productList.length; i++) {
                for (let j = i + 1; j < productList.length; j++) {
                    if (productList[i].price > productList[j].price) {
                        let temp = productList[i];
                        productList[i] = productList[j];
                        productList[j] = temp;
                    }
                }
            }
            return productList;
        }
    }
};

const closeInvalid = () => {
    getEleId("invalidName").innerHTML = "";
    getEleId("invalidName").style.display = "none";
    getEleId("invalidPrice").innerHTML = "";
    getEleId("invalidPrice").style.display = "none";
    getEleId("invalidScreen").innerHTML = "";
    getEleId("invalidScreen").style.display = "none";
    getEleId("invalidBackCamera").innerHTML = "";
    getEleId("invalidBackCamera").style.display = "none";
    getEleId("invalidFrontCamera").innerHTML = "";
    getEleId("invalidFrontCamera").style.display = "none";
    getEleId("invalidImg").innerHTML = "";
    getEleId("invalidImg").style.display = "none";
    getEleId("invalidType").innerHTML = "";
    getEleId("invalidType").style.display = "none";
    getEleId("invalidDesc").innerHTML = "";
    getEleId("invalidDesc").style.display = "none";
};
