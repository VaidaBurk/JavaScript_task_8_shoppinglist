// let productsList = [];
//let id = 0

updateShoppingTable();


function addNewProduct() {

    let productsList = JSON.parse( sessionStorage.getItem("productsList") );
    let id = parseInt( sessionStorage.getItem("id") );
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

    sessionStorage.setItem("id", id + 1);
    sessionStorage.setItem("productsList", JSON.stringify(productsList));

    updateShoppingTable();
    clearForm();
}


function updateShoppingTable() {

    let generatedHtml = "";

    let productsList = JSON.parse( sessionStorage.getItem("productsList") );
        if (productsList === null) {
            sessionStorage.setItem("productsList", JSON.stringify( [] ));
            sessionStorage.setItem("id", "1");
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
            console.log(deleteBtn.id);
            deleteEntry(deleteBtn.id);
            }
        );
    };   
};


function deleteEntry(id) {
    console.log(id);
    let productsList = JSON.parse( sessionStorage.getItem("productsList") );

    for (let i = 0; i < productsList.length; i++) {
        let product = productsList[i];
        if (`delete-${product.id}` == id){
            productsList.splice(i, 1);
        };    
    };
    
    sessionStorage.setItem("productsList", JSON.stringify(productsList)) ;

    updateShoppingTable();
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
    console.log(id);
    let productsList = JSON.parse( sessionStorage.getItem("productsList") );

    for (let i = 0; i < productsList.length; i++) {
        let product = productsList[i];
        if (`done-${product.id}` == id){
            
            document.getElementById(`row-${product.id}`).classList.add("table-success");
            document.getElementById(`name-${product.name}`).classList.add("text-decoration-line-through");
        }  
    }
    
    sessionStorage.setItem("productsList", JSON.stringify(productsList)) ;
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

    let productsList = JSON.parse( sessionStorage.getItem("productsList") );

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

    let productsList = JSON.parse( sessionStorage.getItem("productsList") );
    
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
    sessionStorage.setItem("productsList", JSON.stringify(productsList));

    updateShoppingTable();

    document.getElementById("update-button").style = "display: none";
    document.getElementById("add-button").style = "";

    clearForm();
    document.getElementById("product-name").focus();

};