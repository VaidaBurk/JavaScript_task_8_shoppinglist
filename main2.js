// let productsList = [];
//let id = 0

updateShoppingTable();
updateCartTable();


function addNewProduct() {

    let productsList = JSON.parse(localStorage.getItem("productsList") );
    let id = parseInt( localStorage.getItem("id") );
    //id++;
    
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
    
    productsList.push(newProduct);

    localStorage.setItem("id", id + 1);
    localStorage.setItem("productsList", JSON.stringify(productsList));

    updateShoppingTable();
    clearForm();
}


function updateShoppingTable() {

    let generatedHtml = "";

    let productsList = JSON.parse( localStorage.getItem("productsList") );
        if (productsList === null) {
            localStorage.setItem("productsList", JSON.stringify( [] ));
            localStorage.setItem("id", "1");
            return;
        }


    for (let i = 0; i < productsList.length; i++) {
        let product = productsList[i];
        let tableRow = 
        `<tr id="row-${product.id}">
            <td>${product.id}</td>
            <td id="name-${product.name}">${product.name}</td>
            <td>${product.category}</td>
            <td>${product.quantity}</td>
            <td>
                <div class="in-cart btn btn-outline-success btn-sm" id="done-${product.id}">In Cart</div>
                <div class="edit btn btn-outline-info btn-sm" id="edit-${product.id}">Edit</div>
                <div class="delete btn btn-outline-danger btn-sm" id="delete-${product.id}">Delete</div>
            </td>
        </tr>`;

        generatedHtml = generatedHtml + tableRow;               // merge generated table
    }

    let tbodyElement = document.getElementById("products-table");      // get tbody of table
    tbodyElement.innerHTML = generatedHtml;                         // modify tbody.innerHtml into our newly generated one

    activateDeleteButtons();
    activateInCartButtons();
    activateEditButtons();

    document.getElementById("product-name").focus();
}


function clearForm() {
    document.getElementById("product-name").value = "";
    document.getElementById("product-quantity").value = "";
    document.querySelector('#product-category').value = "Choose category...";
}


function activateDeleteButtons() {

    let deleteButtons = document.getElementsByClassName("delete");
    for (let i = 0; i < deleteButtons.length; i++) {
        let deleteBtn = deleteButtons[i];
        deleteBtn.addEventListener("click", function() {
        deleteEntry(deleteBtn.id);
        });
    };   
};


function deleteEntry(id) {
    let productsList = JSON.parse( localStorage.getItem("productsList") );
    for (let i = 0; i < productsList.length; i++) {
        let product = productsList[i];
        if (`delete-${product.id}` == id){
            productsList.splice(i, 1);
        };    
    };
    localStorage.setItem("productsList", JSON.stringify(productsList));
    updateShoppingTable();

    let cartProductList = JSON.parse( localStorage.getItem("cartProductList") );
    for (let i = 0; i < cartProductList.length; i++) {
        let cartProduct = cartProductList[i];
        if (`done-${cartProduct.id}` == id){
            cartProductList.splice(i, 1);
        };    
    };
    localStorage.setItem("cartProductList", JSON.stringify(cartProductList));
    updateCartTable();

};


function activateInCartButtons() {

    let inCartButtons = document.getElementsByClassName("in-cart");

    for (let i = 0; i < inCartButtons.length; i++) {
        
        let inCartBtn = inCartButtons[i];
        
        inCartBtn.addEventListener("click", function() {
            console.log(inCartBtn.id);
            moveToCart(inCartBtn.id);
            }
        );
    }
}


function moveToCart(id) {

    let productsList = JSON.parse( localStorage.getItem("productsList") );
    let cartProductList = JSON.parse( localStorage.getItem("cartProductList") );
    for (let i = 0; i < productsList.length; i++) {
        let product = productsList[i];
        if (`done-${product.id}` == id) { 
            cartProductList.push(product);
            deleteEntry(`delete-${product.id}`);
            product.id = `C${product.id}`
        }
    }   
    localStorage.setItem("cartProductList", JSON.stringify(cartProductList));
    //localStorage.setItem("productsList", JSON.stringify(productsList));
    updateCartTable();
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
        <tr class="table-primary">
            <td>${cartProduct.id}</td>
            <td class="text-decoration-line-through">${cartProduct.name}</td>
            <td>${cartProduct.category}</td>
            <td>${cartProduct.quantity}</td>
            <td>
                <div class="in-cart btn btn-outline-success btn-sm" id="done-${cartProduct.id}">Back to List</div>
                <div class="delete btn btn-outline-danger btn-sm" id="delete-${cartProduct.id}">Delete</div>
                <img src="./images/icons8_delete_100px.png" style="width: 30px" alt="Delete" class="delete" id="delete-${cartProduct.id}">
            </td>
        </tr>`

    cartTableBodyHtml += cartTableRow;
    }  

    document.getElementById("incart-table").innerHTML = cartTableBodyHtml;
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

    let productsList = JSON.parse( localStorage.getItem("productsList") );

    for (let i = 0; i < productsList.length; i++) {

        if (`edit-${productsList[i].id}` == id) {
            activateEditMode(productsList[i]);
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

    let productsList = JSON.parse( localStorage.getItem("productsList") );
    
    let product = {
            id: document.getElementById("product-id").value,
            name: document.getElementById("product-name").value,
            quantity: document.getElementById("product-quantity").value,
            category: document.querySelector('#product-category').value
        }
        
    for (let i = 0; i < productsList.length; i++) {
        if (productsList[i].id == product.id) {
            productsList[i] = product;
            break;
        }
    }
    localStorage.setItem("productsList", JSON.stringify(productsList));

    updateShoppingTable();

    document.getElementById("update-button").style = "display: none";
    document.getElementById("add-button").style = "";

    clearForm();
    document.getElementById("product-name").focus();
};


hideBtn.addEventListener("click", function() {
    //document.getElementById("form").classList = "hidden";
    //document.getElementById("add-button").style = "display: none";
    });


// Kategorijos!!!
let productsList = JSON.parse( localStorage.getItem("productsList") );
let categories = [];
productsList.forEach(item => {
    if (!categories.includes(item.category))
    categories.push(item.category);
    console.log(categories)
})