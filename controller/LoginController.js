$('#login-btn').click(function(e) {
    e.preventDefault();

    var loginUsername = $('#login-custom-user').val();
    var loginPassword = $('#login-custom-pw').val();

    console.log("Username:", loginUsername);
    console.log("Password:", loginPassword);

    if ($('#login-custom-user').val() === "" && $('#login-custom-pw').val() === "") {
        alert("Please enter username and password");
        console.log("Empty fields detected");
        return false;
    }

    var settings = {
        "url": "http://localhost:8080/POS/api/v1/users",
        "method": "PUT",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "userName": loginUsername,
          "password": loginPassword
        }),
        "dataType": "text"
      };
      
      // Make the AJAX request
      $.ajax(settings)
        .done(function(response) {
          console.log("Response:", response);
          if (response === "Access granted") {
            console.log("Login successful!");
              $("#navigation").css({ display: "block" });
              $("#login-page").css({ display: "none" });
              $("#register-page").css({ display: "none" });
              $("#dashboard-page").css({ display: "block" });
              $("#customer-page").css({ display: "none" });
              $("#product-page").css({ display: "none" });
              $("#order-page").css({ display: "none" });
              $("#neworder-page").css({ display: "none" });
          } else {
            console.log("Invalid login credentials");
            alert("Invalid username or password");
          }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          console.error("Error:", textStatus, errorThrown);
          alert("There was an error logging in. Please try again.");
        });
      
});


