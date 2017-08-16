var cart = [];
var total = 0;
function Item(name, price, quantity, subtotal) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
	this.subtotal = subtotal;
}

function addItemToCart(name, price, quantity, subtotal) {
        for (var i in cart) {
            if (cart[i].name === name) {
                cart[i].quantity += quantity;
				cart[i].subtotal = 
					(parseFloat(cart[i].quantity) * parseFloat(cart[i].price)).toFixed(2);
				displayToCart();
                return;
            }
        }
        var item = new Item(name, price, quantity, price);
        cart.push(item);
		displayToCart();
};

function updateQuantity(quantities){
	var name = quantities.getAttribute("game-name");
	var newQuantity = quantities.value;
	for (var i in cart) {
        if (cart[i].name === name) {
            cart[i].quantity = parseInt(newQuantity);
			if (cart[i].quantity === 0) {
                cart.splice(i, 1);
				displayToCart()
				break;
            }
			else if (cart[i].quantity < 0) {
				cart.splice(i, 1);
				displayToCart()
				break;
			}
			cart[i].subtotal = 
				(parseFloat(cart[i].quantity) * parseFloat(cart[i].price)).toFixed(2);
			displayToCart();
            break;
        }
    }
}

function removeItemFromCart(item){
	var p = item.parentNode.parentNode;
    p.parentNode.removeChild(p);
	var name = item.getAttribute("game-name");
    for (var i in cart) {
        if (cart[i].name === name) {
			total-=cart[i].subtotal;
			document.getElementById("totalPrice").innerHTML= "Total: $"+ total.toFixed(2).toString();
            cart.splice(i, 1);
            break;
        }
    }
}

function displayToCart(){
	total=0;
	var elmtTable = document.getElementById('shoppingCart');
	var tableRows = elmtTable.getElementsByTagName('tr');
	var rowCount = tableRows.length;
	while(--rowCount) 
		elmtTable.deleteRow(rowCount); 
	for(var i in cart){
		var table = document.getElementById("shoppingCart");
		var row = table.insertRow(1);
		var name = row.insertCell(0);
		var price = row.insertCell(1);
		var quantity = row.insertCell(2);
		var subtotal = row.insertCell(3);
		var action = row.insertCell(4);
		name.innerHTML = cart[i].name;
		price.innerHTML = "$" + cart[i].price;
		quantity.innerHTML = "<input class='quantity-input' type='number' game-name='"
							+ cart[i].name +"' value='"+cart[i].quantity+"' onchange='updateQuantity(this)'>";
		subtotal.innerHTML = "$" + cart[i].subtotal;
		action.innerHTML = "<button onclick='removeItemFromCart(this)' game-name='"+cart[i].name+"'>Delete</button>";
		total+=parseFloat(cart[i].subtotal);
		console.log(total.toFixed(2));
	}
	document.getElementById("totalPrice").innerHTML= "Total: $"+ total.toFixed(2).toString();
}

function checkOut(){
	if(cart.length <= 0){
		alert("You haven't added anything to the shopping cart");
		window.location.href = "index.html";
	}
	else{
		var ccname = document.getElementById("ccname").value;
		var ccnumber = document.getElementById("ccnumber").value;
		var expireMM = document.getElementById("expireMM").value;
		var expireYYYY = document.getElementById("expireYYYY").value;
		var securitycode= document.getElementById("securityCode").value;
		var ccInfo ={name:ccname,creditCardNum:ccnumber, expiration:expireMM+"/"+expireYYYY,
						securityCode:securitycode};
		var address1 = document.getElementById("a1").value;
		var address2 = document.getElementById("a2").value;
		var city = document.getElementById("city").value;
		var zipCode = document.getElementById("zipCode").value;
		var state = document.getElementById("states").value;
		var customerBillingInfo ={address1:address1,address2:address2, city:city,state:state,
						zipCode:zipCode};
		var address1SA = document.getElementById("a1SA").value;
		var address2SA = document.getElementById("a2SA").value;
		var citySA = document.getElementById("citySA").value;
		var zipCodeSA = document.getElementById("zipCodeSA").value;
		var stateSA = document.getElementById("statesSA").value;
		var customerShippingInfo ={address1:address1SA,address2:address2SA, city:citySA,state:stateSA,
						zipCode:zipCodeSA};
		var totalPrice = document.getElementById("totalPrice").value;
		$.ajax({
			url: 'checkout.php',
			type: 'post',
			data: {"cart" : JSON.stringify(cart),"totalPrice": JSON.stringify(total.toFixed(2).toString()),
					"ccInfo":JSON.stringify(ccInfo),"csmtblInfo":JSON.stringify(customerBillingInfo),
					"csmtspInfo":JSON.stringify(customerShippingInfo)},
			success: function(data) {
				console.log(data);
			}
		});
		alert("Thank You! Your Order Has Been successfully placed");
		window.location.href = "index.html";
	}
}

function SASA(){
	if(document.getElementById("sameAsShippingAddress").checked){
		var address1 = document.getElementById("a1").value;
		var address2 = document.getElementById("a2").value;
		var city = document.getElementById("city").value;
		var zipCode = document.getElementById("zipCode").value;
		var state = document.getElementById("states").value;
		document.getElementById("a1SA").value = address1;
		document.getElementById("a2SA").value = address2;
		document.getElementById("citySA").value = city;
		document.getElementById("zipCodeSA").value = zipCode;
		document.getElementById("statesSA").value = state;
	}
	else{
		document.getElementById("a1SA").value = "";
		document.getElementById("a2SA").value = "";
		document.getElementById("citySA").value = "";
		document.getElementById("zipCodeSA").value = "";
		document.getElementById("statesSA").value = "AL";
	}
}

$(document).ready(function(){
	$(".shoppingCartPage").hide();
	$(".add-to-cart").click(function(event){
		$("#indexPage").hide();
		$(".shoppingCartPage").show();
		var name = $(this).attr("game-name");
        var price = Number($(this).attr("game-price"));
        addItemToCart(name, price, 1, price);
		console.log(cart);
    });
	
	$("#sc").click(function(event){
		$("#indexPage").hide();
		$(".shoppingCartPage").show();
    });
	
	$("#continue,#home,#game,#reviews,#news,#about,#contact,#title").click(function(event){
		$(".shoppingCartPage").hide();
		$("#indexPage").show();
    });
	$('#sameAsShippingAddress').click(function() {
		SASA();
	});
});