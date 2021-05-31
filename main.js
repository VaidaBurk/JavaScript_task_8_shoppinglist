updateShoppingTable();
updateCartTable();
makeCategoriesList();

function addNewProduct() {

    let productList = JSON.parse(localStorage.getItem("productList") );
    let id = parseInt( localStorage.getItem("id") );
    
    let productId = id;
    let productName = document.getElementById("product-name").value; 
    let productQuantity = document.getElementById("product-quantity").value;
    let productCategory = document.querySelector('#product-category').value;
    
    let newProduct = {
        id: productId,
        name: productName,
        category: productCategory,
        quantity: productQuantity
    }
    
    productList.push(newProduct);

    localStorage.setItem("id", id + 1);
    localStorage.setItem("productList", JSON.stringify(productList));

    updateShoppingTable();
    makeCategoriesList();
    clearForm();
}


function updateShoppingTable() {

    let generatedHtml = "";

    let productList = JSON.parse( localStorage.getItem("productList") );
        if (productList === null) {
            localStorage.setItem("productList", JSON.stringify( [] ));
            localStorage.setItem("id", "1");
            return;
        }

    let selectedCategory = document.getElementById('category-options').value;

        for (let i = 0; i < productList.length; i++) {
            let product = productList[i];
            if (selectedCategory == product.category || selectedCategory == 0) {
            let tableRow = 
            `<tr id="row-${product.id}">
                <td id="name-${product.name}">${product.name}</td>
                <td>${product.category}</td>
                <td>${product.quantity}</td>
                <td>
                    <img src="./images/icons8_ok_24px.png" alt="done" class="in-cart pointer p-1" id="done-${product.id}">
                    <img src="./images/icons8_edit_24px.png" alt="edit" class="edit pointer p-1" id="edit-${product.id}">
                    <img src="./images/icons8_trash_can_24px.png" alt="edit" class="delete pointer p-1" id="delete-${product.id}">
                </td>
            </tr>`;
            generatedHtml = generatedHtml + tableRow;
            }
        }
    
    let tbodyElement = document.getElementById("products-table");
    tbodyElement.innerHTML = generatedHtml;

    activateDeleteButtons();
    activateInCartButtons();
    activateEditButtons();

    // document.getElementById("product-name").focus();
}

function clearForm() {
    document.getElementById("product-name").value = "";
    document.getElementById("product-quantity").value = "";
    document.querySelector('#product-category').value = 0;
}

function activateDeleteButtons() {
    let deleteButtons = document.getElementsByClassName("delete");
    for (let i = 0; i < deleteButtons.length; i++) {
        let deleteBtn = deleteButtons[i];
        deleteBtn.addEventListener("click", function() {
            deleteProductFromStorage(deleteBtn.id, "productList");
        });
    };   
};

function activateCartDeleteButtons() {
    let deleteButtons = document.getElementsByClassName("cart-delete");
    for (let i = 0; i < deleteButtons.length; i++) {
        let deleteBtn = deleteButtons[i];
        deleteBtn.addEventListener("click", function() {
            deleteProductFromStorage(deleteBtn.id, "cartProductList");
        });
    };   
};

function deleteProductFromStorage(id, listName) {
    const products = JSON.parse( localStorage.getItem(listName) );    
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        if (`delete-${product.id}` == id){
            products.splice(i, 1);
        }
    }

    localStorage.setItem(listName, JSON.stringify(products));
    updateShoppingTable();
    updateCartTable();
    makeCategoriesList();
};

function activateInCartButtons() {
    let inCartButtons = document.getElementsByClassName("in-cart");
    for (let i = 0; i < inCartButtons.length; i++) {
        let inCartBtn = inCartButtons[i];
        inCartBtn.addEventListener("click", function() {
            moveToOtherList(inCartBtn.id, "productList", "cartProductList");
            }
        );
    }
}

function activateUndoButtons() {
    let undoButtons = document.getElementsByClassName("undo");
    for (let i = 0; i < undoButtons.length; i++) {
        let undoBtn = undoButtons[i];
        undoBtn.addEventListener("click", function() {
            console.log(undoBtn.id)
            moveToOtherList(undoBtn.id, "cartProductList", "productList");
            }
        );
    }
}

function moveToOtherList(id, takeFromList, putToList) {
    const fromList = JSON.parse( localStorage.getItem(takeFromList) );
    const toList = JSON.parse( localStorage.getItem(putToList) );
    for (let i = 0; i < fromList.length; i++) {
        let product = fromList[i];
        if (`done-${product.id}` == id || `undo-${product.id}` == id) { 
            toList.push(product);
            deleteProductFromStorage(`delete-${product.id}`, takeFromList);
        }
    }   
    localStorage.setItem(putToList, JSON.stringify(toList));
    updateCartTable();
    updateShoppingTable();
    makeCategoriesList();
}

function updateCartTable() {
    let cartProductList = JSON.parse( localStorage.getItem("cartProductList") );
        if (cartProductList === null) {
            localStorage.setItem("cartProductList", JSON.stringify( [] ));
            return;
        }
    let cartTableBodyHtml = "";
    for (let i = 0; i < cartProductList.length; i++) {
        let cartProduct = cartProductList[i];
        let cartTableRow = `
        <tr>
            <td class="text-decoration-line-through">${cartProduct.name}</td>
            <td>${cartProduct.category}</td>
            <td>${cartProduct.quantity}</td>
            <td>
                <img src="./images/icons8_upward_arrow_24px.png" alt="undo" class="undo pointer p-1" 
                id="undo-${cartProduct.id}">
                <img src="./images/icons8_unavailable_24px.png" alt="delete" class="cart-delete pointer p-1" 
                id="delete-${cartProduct.id}">
            </td>
        </tr>`
    cartTableBodyHtml += cartTableRow;
    }  
    document.getElementById("incart-table").innerHTML = cartTableBodyHtml;
    activateCartDeleteButtons();
    activateUndoButtons();

    let clearTableBtn = document.getElementById("clearTableBtn");
    if (cartProductList.length == 0) {
        clearTableBtn.classList.add("hidden");
    }
    else {clearTableBtn.classList.remove("hidden");}
}

function activateEditButtons() {
    let editButtons = document.getElementsByClassName("edit");
    for (let i = 0; i < editButtons.length; i++) {
        let editBtn = editButtons[i];
        editBtn.addEventListener("click", function() {
            editProduct(editBtn.id);
            }
        );
    }
}

function editProduct(id) {
    let productList = JSON.parse( localStorage.getItem("productList") );
    for (let i = 0; i < productList.length; i++) {
        if (`edit-${productList[i].id}` == id) {
            activateEditMode(productList[i]);
        }     
    }
}

function activateEditMode(product) {
    document.getElementById("product-id").value = product.id;
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-quantity").value = product.quantity;
    document.querySelector('#product-category').value = product.category;
    document.getElementById("update-button").style = "";
    document.getElementById("add-button").style = "display: none";
};

function saveEditedProduct() {
    let productList = JSON.parse( localStorage.getItem("productList") );
    let product = {
            id: document.getElementById("product-id").value,
            name: document.getElementById("product-name").value,
            quantity: document.getElementById("product-quantity").value,
            category: document.querySelector('#product-category').value
        }
    for (let i = 0; i < productList.length; i++) {
        if (productList[i].id == product.id) {
            productList[i] = product;
            break;
        }
    }
    localStorage.setItem("productList", JSON.stringify(productList));
    document.getElementById("update-button").style = "display: none";
    document.getElementById("add-button").style = "";
    updateShoppingTable();
    clearForm();
    document.getElementById("product-name").focus();
};

// Kategorijos!!!
function makeCategoriesList() {
    let productList = JSON.parse( localStorage.getItem("productList") );
    let categories = [];
    productList.forEach(product => {
        if (!categories.includes(product.category))
        categories.push(product.category);
    });
    let HTML = "<option value=0 selected>All categories</option>";
    categories.forEach(category => {
        HTML += `<option value="${category}">${category}</option>`
    });
    document.getElementById("category-options").innerHTML = HTML;
    localStorage.setItem("categories", JSON.stringify(categories));
}

let select = document.getElementById("category-options");
    select.addEventListener('change', function() {
        updateShoppingTable();
    }
)

hideBtn.addEventListener("click", function() {
    document.getElementById("form").classList.add("hidden");
    document.getElementById("showBtn").classList.remove("hidden");
    document.getElementById("hideBtn").classList.add("hidden");
});


showBtn.addEventListener("click", function() {
    document.getElementById("form").classList.remove("hidden");
    document.getElementById("showBtn").classList.add("hidden");
    document.getElementById("hideBtn").classList.remove("hidden");
});

clearTableBtn.addEventListener("click", function() {
    clearCartTable();
});

function clearCartTable() {
    let cartProductList = JSON.parse( localStorage.getItem("cartProductList") );
    console.log(cartProductList.length);
    cartProductList.length = 0;
    localStorage.setItem("cartProductList", JSON.stringify(cartProductList));
    updateCartTable();
}