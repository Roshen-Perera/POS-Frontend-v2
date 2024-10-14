loadTableProduct();

var recordIndex = undefined;

let isIDError = true;
let isNameError = true;
let isTypeError = true;
let isQtyError = true;
let isPriceError = true;

function validateID(){
    if ($('#pro-custom-id').val() === "") {
        $("#pro-custom-id").css({"border-color": "red"});
        alert("ID Missing");
        isIDError = false;
        return false;
    } else {
        $("#pro-custom-id").css({"border-color": "#32008E"});
        isIDError = true;
    }
}
function validateName(){
    var isValidName = new RegExp("\\b[A-Z][a-z]*( [A-Z][a-z]*)*\\b");
    if ($('#pro-custom-name').val() === "") {
        $("#pro-custom-name").css({"border-color": "red"});
        alert("Product Name Missing");
        isNameError = false;
        return false;
    } else if (!isValidName.test($("#pro-custom-name").val())) {
        $("#pro-custom-name").css({"border-color": "red"});
        alert("Product Name Invalid");
        isNameError = false;
        return false;
    } else {
        $("#pro-custom-name").css({"border-color": "#32008E"});
        isNameError = true;
    }
}
function validateType(){
    var isValidType = new RegExp("\\b[A-Z][a-z]*( [A-Z][a-z]*)*\\b");
    if ($('#pro-custom-type').val() === "") {
        $("#pro-custom-type").css({"border-color": "red"});
        alert("Product Type Missing");
        isTypeError = false;
        return false;
    } else if (!isValidType.test($("#pro-custom-type").val())) {
        $("#pro-custom-type").css({"border-color": "red"});
        alert("Product Type Invalid");
        isTypeError = false;
        return false;
    } else {
        $("#pro-custom-type").css({"border-color": "#32008E"});
        isTypeError = true;
    }
}
function validateQty(){
    var isValidQTY = new RegExp("^[0-9]+\\.?[0-9]*$");
    if ($('#pro-custom-qty').val() === "") {
        $("#pro-custom-qty").css({"border-color": "red"});
        alert("Product QTY Missing");
        isQtyError = false;
        return false;
    } else if (!isValidQTY.test($("#pro-custom-qty").val())) {
        $("#pro-custom-qty").css({"border-color": "red"});
        alert("Product QTY Invalid");
        isQtyError = false;
        return false;
    } else {
        $("#pro-custom-qty").css({"border-color": "#32008E"});
        isQtyError = true;
    }
}
function validatePrice(){
    var isValidPrice = new RegExp("^[0-9]+\\.?[0-9]*$");
    if ($('#pro-custom-price').val() === "") {
        $("#pro-custom-price").css({"border-color": "red"});
        alert("Product Price Missing");
        isPriceError = false;
        return false;
    } else if (!isValidPrice.test($("#pro-custom-price").val())) {
        $("#pro-custom-price").css({"border-color": "red"});
        alert("Product Price Invalid");
        isPriceError = false;
        return false;
    } else {
        $("#pro-custom-price").css({"border-color": "#32008E"});
        isPriceError = true;
    }
}

 export function loadTableProduct(){
    $('#product-table').empty();
    $.ajax({
        url: "http://localhost:8080/POS/api/v1/products",
        method: "GET",
        success: function (results) {
            $('#product-table').empty();
            results.forEach(function (post) {
                var record = `<tr>
                                <td>${post.productId}</td>     
                                <td>${post.productName}</td>
                                <td>${post.productType}</td>     
                                <td>${post.productQty}</td>
                                <td>${post.productPrice}</td>
                            </tr>`;
                $('#product-table').append(record);
            });
            $('#productCount').text(results.length);
        },
        error: function (error) {
            console.log(error);
            alert("An error occurred while fetching the posts.");
        }
    });
}

$('#btnSearchProduct').on('click', () => {
    let proId = $('#pro-custom-id').val();
    $.ajax({
        url: "http://localhost:8080/POS/api/v1/products/"+proId,
        type: "GET",
        headers: {"Content-Type": "application/json"},
        success: (res) => {
            if (res && JSON.stringify(res).toLowerCase().includes("not found")) {
                alert("Product not found");
            } else{
                console.log(JSON.stringify(res));
                $('#pro-custom-name').val(res.productName);
                $('#pro-custom-type').val(res.productType);
                $('#pro-custom-qty').val(res.productQty);
                $('#pro-custom-price').val(res.productPrice);
            }
        },
        error: (res) => {
            console.error(res);
        }
    });

    console.log('Selected product ID:', proId);

    // Find the selected product object
    // const res = products.find(product => product.proId === prodId);
    // console.log('Selected product:', res);
});

$('#product-add-btn').on('click', () => {
    validateID();
    validateName();
    validateType();
    validatePrice();
    validateQty();

    if (isIDError === true && isNameError === true && isTypeError === true && isPriceError === true && isQtyError === true) {
        var productId = $('#pro-custom-id').val();
        var productName = $('#pro-custom-name').val();
        var productType = $('#pro-custom-type').val();
        var productQty = $('#pro-custom-qty').val();
        var productPrice = $('#pro-custom-price').val();

        $.ajax({
            url: "http://localhost:8080/POS/api/v1/products/"+productId,
            type: "GET",
            headers: {"Content-Type": "application/json"},
            success: (res) => {
                if (res && JSON.stringify(res).toLowerCase().includes("not found")) {
                    var form = new FormData();
                    form.append("id", productId);
                    form.append("name", productName);
                    form.append("type", productType);
                    form.append("qty", productQty);
                    form.append("price", productPrice);
                    

                    var settings = {
                        "url": "http://localhost:8080/POS/api/v1/products",
                        "method": "POST",
                        "timeout": 0,
                        "processData": false,
                        "mimeType": "multipart/form-data",
                        "contentType": false,
                        "data": form
                    };

                    $.ajax(settings).done(function (response) {
                        console.log(response);
                        loadTableProduct();
                        alert("Product Added Successfully");
                    });

                } else{
                    alert("Product already exists");
                }
            },
            error: (res) => {
                console.error(res);
            }
        });

        
        //totalProducts();
        clearFields();
    } else {
        return false;
    }
});


$("#product-table").on('click', 'tr',function()  {
    // console.log("Adoo");
    recordIndex = $(this).index();
    console.log(recordIndex);

    let productId = $(this).find("td:eq(0)").text();
    let productName = $(this).find("td:eq(1)").text();
    let productType = $(this).find("td:eq(2)").text();
    let productQty = $(this).find("td:eq(3)").text();
    let productPrice = $(this).find("td:eq(4)").text();

    $("#pro-custom-id").val(productId);
    $("#pro-custom-name").val(productName);
    $("#pro-custom-type").val(productType);
    $("#pro-custom-qty").val(productQty);
    $("#pro-custom-price").val(productPrice);

    console.log(productId);
    console.log(productName);
    console.log(productType);
    console.log(productQty);
    console.log(productPrice);

});

$("#product-update-btn").on('click', () => {
    var productId = $('#pro-custom-id').val();
    var productName = $('#pro-custom-name').val();
    var productType = $('#pro-custom-type').val();
    var productQty = $('#pro-custom-qty').val();
    var productPrice = $('#pro-custom-price').val();

    $.ajax({
        url: "http://localhost:8080/POS/api/v1/products/"+productId,
        type: "GET",
        headers: {"Content-Type": "application/json"},
        success: (res) => {
            if (res && JSON.stringify(res).toLowerCase().includes("not found")) {
                alert("Product not found");
            } else{
                var form = new FormData();
                form.append("id", productId);
                form.append("name", productName);
                form.append("type", productType);
                form.append("qty", productQty);
                form.append("price", productPrice);
                
                var settings = {
                    "url": "http://localhost:8080/POS/api/v1/products",
                    "method": "PATCH",
                    "timeout": 0,
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form
                };

                $.ajax(settings).done(function (response) {
                    console.log(response);
                    loadTableProduct();
                    alert("Product Updated Successfully");
                });
            }
        },
        error: (res) => {
            console.error(res);
        }
    });
    clearFields();
});

$('#product-delete-btn').on('click', () => {
    // products.splice(recordIndex, 1);
    let productId = $('#pro-custom-id').val();

    $.ajax({
        url: "http://localhost:8080/POS/api/v1/products/"+productId,
        type: "GET",
        headers: {"Content-Type": "application/json"},
        success: (res) => {
            if (res && JSON.stringify(res).toLowerCase().includes("not found")) {
                alert("Product not found");
            } else{
                var settings = {
                    "url": "http://localhost:8080/POS/api/v1/products/"+productId,
                    "method": "DELETE",
                    "timeout": 0,
                  };
                  
                  $.ajax(settings).done(function (response) {
                    console.log(response);
                    loadTableProduct();
                    alert("Product Deleted Successfully");
                  });
            }
        },
        error: (res) => {
            console.error(res);
        }
    });
    clearFields();
});

$('#product-clear-btn').on('click', () => {
    clearFields();
});

$('#btnGetAllProducts').on('click', () => {
    loadTableProduct();
});

function clearFields() {
    $('#pro-custom-id').val("");
    $('#pro-custom-name').val("");
    $('#pro-custom-type').val("");
    $('#pro-custom-qty').val("");
    $('#pro-custom-price').val("");
}


