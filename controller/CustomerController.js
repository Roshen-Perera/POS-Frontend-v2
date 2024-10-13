
var recordIndex = undefined;

loadTableCustomer();

$("#customerIdCheck").hide();
let isError = true;

$("#customerUserCheck").hide();
let usernameError = true;

$("#customerAddressCheck").hide();
let addressError = true;

$("#customerMobileCheck").hide();
let mobileError = true;

function validateID(){
    if ($('#cus-custom-id').val() === "") {
        $("#cus-custom-id").css({"border-color": "red"});
        $("#idCheck").show();
        isError = false;
        return false;
    } else {
        $("#cus-custom-id").css({"border-color": "#32008E"});
        $("#idCheck").hide();
        isError = true;
    }
}

function validateName(){
    var isValidCustomerName = new RegExp("\\b[A-Z][a-z]*( [A-Z][a-z]*)*\\b");
    if ($('#cus-custom-user').val() === "") {
        $("#cus-custom-user").css({"border-color": "red"});
        $("#userCheck").show()
        alert("Customer Name Missing");
        return false;
    } else if (!isValidCustomerName.test($('#cus-custom-user').val())) {
        $("#cus-custom-user").css({"border-color": "red"});
        alert("Customer Name Invalid");
        usernameError = false;
        return false;
    } else {
        $("#cus-custom-user").css({"border-color": "#32008E"});
        $("#userCheck").hide();
        usernameError = true;
    }
}

function validateAddress(){
    var isValidCustomerAddress = new RegExp("^[A-Za-z0-9'\\/\\.,\\s]{5,}$");
    if ($("#cus-custom-address").val() === "") {
        $("#cus-custom-address").css({"border-color": "red"});
        alert("Customer Address Missing");
        addressError = false;
        return false;
    } else if (!isValidCustomerAddress.test($("#cus-custom-address").val())) {
        $("#cus-custom-address").css({"border-color": "red"});
        alert("Customer Address Invalid");
        addressError = false;
        return false;
    } else {
        $("#cus-custom-address").css({"border-color": "#32008E"});
        $("#addressCheck").hide();
        addressError = true;
    }
}

function validateMobile(){
    var isValidPhoneNumber = new RegExp("^(?:0|94|\\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\\d)\\d{6}$");
    if ($("#cus-custom-mobile").val() === "") {
        $("#cus-custom-mobile").css({"border-color": "red"});
        alert("Customer Mobile Missing");
        mobileError = false;
        return false;
    } else if (!isValidPhoneNumber.test($("#cus-custom-mobile").val())) {
        $("#cus-custom-mobile").css({"border-color": "red"});
        alert("Customer Mobile Invalid");
        mobileError = false;
        return false;
    } else {
        $("#cus-custom-mobile").css({"border-color": "#32008E"});
        $("#mobileCheck").hide();
        mobileError = true;
    }
}

/*
$("#cus-custom-user").keyup(function () {
    validateName();
});
$("#cus-custom-address").keyup(function () {
    validateAddress();
});
$("#cus-custom-mobile").keyup(function () {
    validateMobile();
})

*/

export function loadTableCustomer() {
    $('#customer-table').empty();
    $.ajax({
        url: "http://localhost:8080/POS/api/v1/customers",
        method: "GET",
        success: function (results) {
            $('#customer-table').empty();
            results.forEach(function (post) {
                var record = `<tr>
                                <td class = "">${post.id}</td>     
                                <td class = "">${post.name}</td>
                                <td class = "">${post.address}</td>     
                                <td class = "">${post.phone}</td>
                            </tr>`;
                $('#customer-table').append(record);
            });
            $('#customerCount').text(results.length);
        },
        error: function (error) {
            console.log(error);
            alert("An error occurred while fetching the posts.");
        }
    });
}

$("#customer-table").on('click', 'tr', function () {
    recordIndex = $(this).index();
    console.log(recordIndex);

    // Assuming your table cells (td) are in the same order as: ID, Name, Address, Phone
    let customerId = $(this).find("td:eq(0)").text();  // first cell for customer ID
    let customerName = $(this).find("td:eq(1)").text();  // second cell for customer Name
    let customerAddress = $(this).find("td:eq(2)").text();  // third cell for customer Address
    let customerMobile = $(this).find("td:eq(3)").text();  // fourth cell for customer Phone

    // Setting the values in the form fields
    $("#cus-custom-id").val(customerId);
    $("#cus-custom-user").val(customerName);
    $("#cus-custom-address").val(customerAddress);
    $("#cus-custom-mobile").val(customerMobile);

    // Debugging logs
    console.log(customerId);
    console.log(customerName);
    console.log(customerAddress);
    console.log(customerMobile);
});


$('#btnSearchCustomer').on('click', () => {
    let cusId = $('#cus-custom-id').val();
    $.ajax({
        url: "http://localhost:8080/POS/api/v1/customers/"+cusId,
        type: "GET",
        headers: {"Content-Type": "application/json"},
        success: (res) => {
            
            if (res && JSON.stringify(res).toLowerCase().includes("not found")) {
                alert("Customer ID not found");
            } else {
                console.log(JSON.stringify(res));
                $('#cus-custom-user').val(res.name);
                $('#cus-custom-address').val(res.address);
                $('#cus-custom-mobile').val(res.phone);
            }
            
        },
        error: (res) => {
            console.error(res);
        }
    });
    console.log('Selected product ID:', cusId);
    // Find the selected product object
    // const selectedProduct = customers.find(customer => customer.cusId === cusId);
    // console.log('Selected product:', selectedProduct);
});

$('#customer-add-btn').on('click', () => {
    validateID();
    validateName();
    validateAddress();
    validateMobile();
    if (isError === true && usernameError === true && addressError === true && mobileError === true) {
        console.log(isError);
        console.log(usernameError);
        console.log(addressError);
        console.log(mobileError);
        let customerId = $('#cus-custom-id').val();
        let customerName = $('#cus-custom-user').val();
        let customerAddress = $('#cus-custom-address').val();
        let customerMobile = $('#cus-custom-mobile').val();

        // var record = `<tr>
        //                     <td class="cus_id" scope="row">${customerId}</td>
        //                     <td class="cus_name">${customerName}</td>
        //                     <td class="cus_address">${customerAddress}</td>
        //                     <td class="cus_mobile">${customerMobile}</td>
        //                 </tr>`
        // $('#customer-table').append(record);
        //
        // let customer = new CustomerModel(customerId, customerName, customerAddress, customerMobile);

        // let customer = {
        //     id: customerId,
        //     name: customerName,
        //     address: customerAddress,
        //     phone: customerMobile
        // }
        // const customerJSON = JSON.stringify(customer)
        // console.log(customerJSON);
        // $.ajax({
        //     url: "http://localhost:8081/POS_BackEnd/customer",
        //     type: "POST",
        //     data : customerJSON,
        //     headers: {"Content-Type": "application/json"},
        //     success: (res) => {
        //         console.log(JSON.stringify(res));
        //         loadTableCustomer();
        //     },
        //     error: (res) => {
        //         console.error(res);
        //     }
        // });

        $.ajax({
            url: "http://localhost:8080/POS/api/v1/customers/"+customerId,
            type: "GET",
            headers: {"Content-Type": "application/json"},
            success: (res) => {
                
                if (res && JSON.stringify(res).toLowerCase().includes("not found")) {
                    var form = new FormData();
                    form.append("customerId", customerId);
                    form.append("name", customerName);
                    form.append("address", customerAddress);
                    form.append("phone", customerMobile);

                    var settings = {
                    "url": "http://localhost:8080/POS/api/v1/customers",
                    "method": "POST",
                    "timeout": 0,
                    "processData": false,
                    "mimeType": "multipart/form-data",
                    "contentType": false,
                    "data": form
                    };

                    $.ajax(settings).done(function (response) {
                    console.log(response);
                    });
                    alert("Customer Added");
                    loadTableCustomer();
                } else {
                    alert("Customer ID already exists");
                }
            },
            error: (res) => {
                console.error(res);
            }
        });
        //customers.push(customer)

        //totalCustomers();
        //console.log(customer);
        clearFields();
    } else {
        return false;
    }
});

$("#customer-update-btn").on('click', () => {
    validateID();
    validateName();
    validateAddress();
    validateMobile();
    if (isError === true && usernameError === true && addressError === true && mobileError === true) {
        var customerId = $('#cus-custom-id').val();
        var customerName = $('#cus-custom-user').val();
        var customerAddress = $('#cus-custom-address').val();
        var customerMobile = $('#cus-custom-mobile').val();

        // let customer = {
        //     id: customerId,
        //     name: customerName,
        //     address: customerAddress,
        //     phone: customerMobile
        // }
        // const customerJSON = JSON.stringify(customer)
        // console.log(customerJSON);
        // $.ajax({
        //     url: "http://localhost:8081/POS_BackEnd/customer",
        //     type: "PUT",
        //     data : customerJSON,
        //     headers: {"Content-Type": "application/json"},
        //     success: (res) => {
        //         console.log(JSON.stringify(res));
        //         loadTableCustomer();
        //     },
        //     error: (res) => {
        //         console.error(res);
        //     }
        // });

        $.ajax({
            url: "http://localhost:8080/POS/api/v1/customers/"+customerId,
            type: "GET",
            headers: {"Content-Type": "application/json"},
            success: (res) => {
                if (res && JSON.stringify(res).toLowerCase().includes("not found")) {
                    alert("Customer ID not found");
                } else {
                    var form = new FormData();
                    form.append("customerId", customerId);
                    form.append("name", customerName);
                    form.append("address", customerAddress);
                    form.append("phone", customerMobile);

                    var settings = {
                        "url": "http://localhost:8080/POS/api/v1/customers",
                        "method": "PATCH",
                        "timeout": 0,
                        "processData": false,
                        "mimeType": "multipart/form-data",
                        "contentType": false,
                        "data": form
                    };

                    $.ajax(settings).done(function (response) {
                        console.log(response);
                        console.log("Customer Updated");
                        alert("Customer Updated");
                        loadTableCustomer();
                    });
                }
            },
            error: (res) => {
                console.error(res);
            }
        });
        clearFields();
    } else {
        return false;
    }
});

$('#customer-delete-btn').on('click', () => {
    // customers.splice(recordIndex, 1);

    let customerId = $('#cus-custom-id').val();

    $.ajax({
        url: "http://localhost:8080/POS/api/v1/customers/"+customerId,
        type: "GET",
        headers: {"Content-Type": "application/json"},
        success: (res) => {
            if (res && JSON.stringify(res).toLowerCase().includes("not found")) {
                alert("Customer ID not found");
            } else {
                var settings = {
                    "url": "http://localhost:8080/POS/api/v1/customers/"+customerId,
                    "method": "DELETE",
                    "timeout": 0,
                };
                  
                $.ajax(settings).done(function (response) {
                    console.log(response);
                    alert("Customer Deleted");
                    loadTableCustomer();
                });
            }
        },
        error: (res) => {
            console.error(res);
        }
    });
    clearFields();
});

$('#customer-clear-btn').on('click', () => {
    clearFields();
});

$('#btnGetAllCustomer').on('click', () => {
    loadTableCustomer();
});

function clearFields() {
    $('#cus-custom-id').val('');
    $('#cus-custom-user').val('');
    $('#cus-custom-address').val('');
    $('#cus-custom-mobile').val('');
}