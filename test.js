$(function() {
    var selector = '.nav li a';
    $('.nav li a, button.submit a').click(function(event) {
        $(selector).removeClass('arrow');
        $('a[href="' + this.hash + '"]').addClass('arrow');
        if (this.hash !== "") {
            event.preventDefault();
            hash = this.hash;
            $('html, body').animate({
                scrollLeft: $(hash).offset().left
            }, 700, function() {
                window.location.hash = hash;
            });
        }
    });

    var productPricing = function() {
        var productTotalPrice = 0,
            totalNumberOfProducts = 0,
            productDiscount = 165.99,
            totalDiscount = 0;
        $(".itemPrice").each(function(i) {
            totalNumberOfProducts++;
            totalDiscount = productDiscount.toFixed(2) * totalNumberOfProducts;
            productTotalPrice += parseFloat($(this).text());
            $("td.subtotal").text("$" + productTotalPrice.toFixed(2));
            $("td.productDiscount").text("$" + totalDiscount);
        });
        $("td.totalPrice").text("$" + (productTotalPrice - totalDiscount).toFixed(2));
    }
    productPricing();

    $(".remove a").on("click", function(event) {
        $(this).closest(".item").remove();
        productPricing();
        event.preventDefault();
    });

    $(".giftCard input, .discountCode input, label.location").hide();
    $(".discountCode a").click(function() {
        $(".discountCode input").toggle(300);
    });
    $(".giftCard a").click(function() {
        $(".giftCard input").toggle(300);
    });

    countryUrl = 'http://ipinfo.io';

    $.getJSON(countryUrl, function(data) {
        country = data.country.toLowerCase();
    });

    $(".zipError").hide(200);

    $("#zipCode").bind("input propertychange", function() {
        if ($("#zipCode").val() === '') {
            $(".zipError").hide(200);
        }
        zipCode = $("#zipCode").val();
        if (country === "us" && zipCode.length >= 5 || country !== "us" && zipCode.length >= 4) {
            var zipRequest = new XMLHttpRequest();
            zipRequest.open("GET", "https://api.zippopotam.us/" + country + "/" + zipCode, true);
            zipRequest.onreadystatechange = function() {
                if (zipRequest.status === 200) {
                    data = JSON.parse(zipRequest.responseText);
                    city = data.places[0]["place name"];
                    state = data.places[0].state;
                    $("#city").val(city);
                    $("#state").val(state);
                } else {
                    $(".zipError").show(200).css("color", "#e97b7b");
                    $("#city, #state").val('');
                }
            };
            zipRequest.send();
        }
    });
    var yearGenerator = function() {
        month = new Date().getMonth();
        year = new Date().getFullYear();
        $("select.month").val(month);
        for (var i = year; i < year + 15; i++) {
            $("select.year").append('<option value="' + i + '">' + i + '</option>');
        }
    }
    yearGenerator();
});