$(document).ready(function () {

    // validation
    var validemail;
    var validname;
    var validpassword;
    var confirmpassword;

    $("#registeremail").keyup(function () {
        $("[class*='wrong']").removeClass('shakeit');
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($("#registeremail").val())) {
            $('.registerform .email .input').css({
                border: "2px solid red"
            })


            $('.registerform .email').addClass("wrongemail");
            validemail = false;
        } else {
            $('.registerform .email .input').css({
                border: "2px solid rgb(14, 173, 115)"
            })

            $('.registerform .email').removeClass("wrongemail");
            validemail = true;
        }
    });


    $("#registername").keyup(function () {
        $("[class*='wrong']").removeClass('shakeit');
        if (!/^[a-zA-Z]{3,}(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g.test($("#registername").val())) {
            $('.registerform .name .input').css({
                border: "2px solid red"
            })

            $('.registerform .name').addClass("wrongname");
            validname = false

        } else {
            $('.registerform .name .input').css({
                border: "2px solid rgb(14, 173, 115)"
            })
            $('.registerform .name').removeClass("wrongname");

            validname = true
        }
    });


    $("#registerpassword").keyup(function () {
        $("[class*='wrong']").removeClass('shakeit');

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/g.test($("#registerpassword").val())) {
            $('.registerform .password .input').css({
                border: "2px solid red"
            })
            $('.registerform .password').addClass("wrongpassword");

            validpassword = false


        } else {
            $('.registerform .password .input').css({
                border: "2px solid rgb(14, 173, 115)"
            })
            console.log('fale');
            $('.registerform .password').removeClass("wrongpassword");
            validpassword = true

        }
    });

    $("#registerconfirmpassword").keyup(function () {
        $("[class*='wrong']").removeClass('shakeit');

        var p1 = $("#registerpassword").val();
        var p2 = $("#registerconfirmpassword").val();

        if (p1 != p2) {
            console.log('true');

            $('.registerform .confirmpassword .input').css({
                border: "2px solid red"
            })
            $('.registerform .confirmpassword').addClass("wrongconfirmpassword");

            confirmpassword = false
            // $(".registerform .confirmpassword .input").toggleClass("shakeit");

        } else {
            $('.registerform .confirmpassword .input').css({
                border: "2px solid rgb(14, 173, 115)"
            })
            $('.registerform .confirmpassword').removeClass("wrongconfirmpassword");
            confirmpassword = true

        }
    });
    // validation done





    // <div class="spinner"></div>
    $('.user .username').html('<div class="spinner">\
    <div class="bounce1"></div>\
    <div class="bounce2"></div>\
    <div class="bounce3"></div>\
  </div>');
  $('.stock .products').html(' <div class="loader">Loading...</div>');



// APIs




    // to get stock on starting of site
    $.get("http://127.0.0.1:3000/stock", function (data, status, request) {
        console.log(data);
        var allstock = data['stockdata'];
        var stock = "";
        for (let val of allstock) {
            stock += `<div class="product">
                <i class="addtowishcartbutton fas fa-heart"></i>
                <img src="${val.image}" alt="">
                <div class="discription">
                    <div class="category"><span>${val.gender}</span>'s Collection</div>
                    <div class="name">${val.name}</div>
                    <div class="ratingandprice">
                        <div class="ratingdetail"><span class="rating">4.2</span><i class="fas fa-star"></i></div>
                        <div class="pricedetail">$<span class="price">${val.price}</span></div>
                    </div>
                    <div class="addtocart"><i class="fas fa-cart-plus"></i>Add to cart</div>
                </div>
            </div>`
        }

        $('.stock .products').html(stock);
        if (data.currentuser) {
            $('.user .username').html(data.currentuser.name);
            var scart = ""
            var totalprice = 0;
            if (data.currentuser.cart.length != 0) {
                for (const val of data.currentuser.cart) {
                    totalprice += Number(val.price);
                    scart += ` <div class="product">
                <img src="${val.image}" alt="">
                <div class="name">${val.name}</div>
                <div class="pricedetail">$<span class="price">${val.price}</span></div>
                <i class="removefromcart fas fa-trash"></i>
            </div>`
                }
                $('.checkoutarea .total').html(totalprice);
                $('.cart .products').append(scart);
            } else {
                $('.cart .products').append(' <div class="emptycart">\
                <img src="emptycart.png" alt="" >\
                <p>Add items</p>\
            </div>');
            }

            // wishcart
            var wcart = ""
            if (data.currentuser.wishcart.length != 0) {
                for (const val of data.currentuser.wishcart) {
                    console.log(val);
                    wcart += ` <div class="product">
                <img src="${val.image}" alt="">
                <div class="name">${val.name}</div>
                <div class="pricedetail">$<span class="price">${val.price}</span></div>
                <i class="addtocartbutton fas fa-cart-plus"></i>
                <i class="removefromwishcart fas fa-heart"></i>
            </div>`
                }

                $('.wishcart .products').append(wcart);
            } else {
                $('.wishcart .products').append(' <div class="emptycart">\
                <img src="emptywish.png" alt="" >\
                <p>Add items</p>\
            </div>');
            }
        } else {
            $('.user .username').html('login');
            $('.cart .products').html('<img src="loginplease.png">');
            $('.wishcart .products').html('<img src="loginplease.png">');

        }
    });



    // add to cart
    $('.stocck .products').click(function (e) {
        $(".cart .emptycart").remove();
        if (e.target.className == 'addtocart') {
            var item = $(e.target).parents('.product');
            var itemDetail = {
                'image': item.find("img").attr("src"),
                'name': item.find(".name").html(),
                'price': item.find(".price").html(),
            }
            console.log(itemDetail);
            $.put("http://127.0.0.1:3000/addtocart", itemDetail,
                function (data, textStatus, jqXHR) {
                    
                    if (data==true) {
                        var cart = `<div class="product">
                    <img src="${itemDetail.image}" alt="">
                    <div class="name">${itemDetail.name}</div>
                    <div class="pricedetail">$<span class="price">${itemDetail.price}</span></div>
                    <i class="removefromcart fas fa-trash"></i>
                </div>`
                        $(".cart .products").append(cart);
                        var total = $(".checkoutarea .total").html()
                        $(".checkoutarea .total").html(Number(total) + Number(itemDetail.price))
                    } 
                    else if(data==false) {
                        alert("item already exist")
                    }
                    else if(data=='loginplease'){
                        alert("login please")
                    }
                },
            );
        }
    });








    $('.stock .products').click(function (e) {
        $(".cart .emptycart").remove();
        if (e.target.className == 'addtocart') {
            var item = $(e.target).parents('.product');
            var itemDetail = {
                'image': item.find("img").attr("src"),
                'name': item.find(".name").html(),
                'price': item.find(".price").html(),
            }
            console.log(itemDetail);
            $.post("http://127.0.0.1:3000/addtocart", itemDetail,
                function (data, textStatus, jqXHR) {
                    
                    if (data==true) {
                        var cart = `<div class="product">
                    <img src="${itemDetail.image}" alt="">
                    <div class="name">${itemDetail.name}</div>
                    <div class="pricedetail">$<span class="price">${itemDetail.price}</span></div>
                    <i class="removefromcart fas fa-trash"></i>
                </div>`
                        $(".cart .products").append(cart);
                        var total = $(".checkoutarea .total").html()
                        $(".checkoutarea .total").html(Number(total) + Number(itemDetail.price))
                    } 
                    else if(data==false) {
                        alert("item already exist")
                    }
                    else if(data=='loginplease'){
                        alert("login please")
                    }
                },
            );
        }
    });



    //remove from cart

    $('.cartlinck .cart').click(function (e) {
        console.log('cart clicked');
        if (e.target.className == 'removefromcart fas fa-trash') {
            var item = $(e.target).parents('.product');
            var itemDetail = {
                'image': item.find("img").attr("src"),
                'name': item.find(".name").html(),
                'price': item.find(".price").html(),
            }
            console.log(itemDetail);
            $.delete("http://127.0.0.1:3000/removefromcart", itemDetail,
                function (data, textStatus, jqXHR) {
                    $(item).remove();
                    var total = $('.total').html() - itemDetail.price;
                    $('.total').html(total)


                },
            );
        }
    });




    $('.cartlink .cart').click(function (e) {
        console.log('cart clicked');
        if (e.target.className == 'removefromcart fas fa-trash') {
            var item = $(e.target).parents('.product');
            var itemDetail = {
                'image': item.find("img").attr("src"),
                'name': item.find(".name").html(),
                'price': item.find(".price").html(),
            }
            console.log(itemDetail);
            $.post("http://127.0.0.1:3000/removefromcart", itemDetail,
                function (data, textStatus, jqXHR) {
                    $(item).remove();
                    var total = $('.total').html() - itemDetail.price;
                    $('.total').html(total)


                },
            );
        }
    });

    // add to wish
    $('.stock .products').click(function (e) {
        $(".wishcart .emptycart").remove();
        if (e.target.className == 'addtowishcartbutton fas fa-heart') {
            var item = $(e.target).parents('.product');
            var itemDetail = {
                'image': item.find("img").attr("src"),
                'name': item.find(".name").html(),
                'price': item.find(".price").html(),
            }
            $.post("http://127.0.0.1:3000/addtowish", itemDetail,
                function (data, textStatus, jqXHR) {
                    if (data) {
                        var wishcart = ` <div class="product">
                    <img src="${itemDetail.image}" alt="">
                    <div class="name">${itemDetail.name}</div>
                    <div class="pricedetail">$<span class="price">${itemDetail.price}</span></div>
                    <i class="addtocartbutton fas fa-cart-plus"></i>
                    <i class="removefromwishcart fas fa-heart"></i>
                </div>`
                        $(".wishcart .products").append(wishcart);
                    } else {
                        alert("item already exist")
                    }
                },
            );
        }
    });

    // remove from wish
    $('.wishcart .products').click(function (e) {
        console.log('cart');
        if (e.target.className == 'removefromwishcart fas fa-heart') {
            var item = $(e.target).parents('.product');
            var itemDetail = {
                'image': item.find("img").attr("src"),
                'name': item.find(".name").html(),
                'price': item.find(".price").html(),
            }
            console.log(itemDetail);
            $.post("http://127.0.0.1:3000/removefromwish", itemDetail,
                function (data, textStatus, jqXHR) {
                    $(item).remove();
                },
            );
        }
    });

    // add to cart from wish
    $('.wishcart .products').click(function (e) {
        if (e.target.className == 'addtocartbutton fas fa-cart-plus') {
            ;
            
            var item = $(e.target).parents('.product');
            var itemDetail = {
                'image': item.find("img").attr("src"),
                'name': item.find(".name").html(),
                'price': item.find(".price").html(),
            }
            $.post("http://127.0.0.1:3000/addtocartfromwish", itemDetail,
                function (data, textStatus, jqXHR) {
                  

                    if (data) {
                        $(item).remove();
                        var gettotal=$('.total').html();
                        var total = (gettotal*1);
                        var cart = `<div class="product">
                    <img src="${itemDetail.image}" alt="">
                    <div class="name">${itemDetail.name}</div>
                    <div class="pricedetail">$<span class="price">${itemDetail.price}</span></div>
                    <i class="removefromcart fas fa-trash"></i>
                </div>`;
                        $(".cart .products").append(cart);
                       
                        total += (itemDetail.price*1)
                        $('.total').html(total)
                    } else {
                        alert("item already exist")
                    }
                },
            );
        }
    });



    //add new user
    $('#registerbutton').click(function (e) {
        if (validemail && validname && validpassword && confirmpassword) {
            var name = $('#registername').val().toLowerCase();
            var email = $('#registeremail').val().toLowerCase();
            var password = $('#registerpassword').val();
            var itemDetail = {
                name: name,
                email: email,
                password: password,
            }
            $.post("http://127.0.0.1:3000/register", itemDetail, function (data, textStatus, jqXHR) {
                if (data) {
                    $('.registermessagebar').css({
                        background: 'green',
                    })
                    $('.registermessagebar').html('successfuly created account');
                    $('.registermessagebar').addClass('registermessagebar-show');
                    
                } else {
                    $('.registermessagebar').css({
                        background: 'red'
                    })
                    $('.registermessagebar').addClass('registermessagebar-show');
                    $('.registermessagebar').html('email already used');

                }
            },
            );
        }
        else {
            $('.registermessagebar').html("invalid data")
            $('.registermessagebar').addClass('registermessagebar-show');
            $("[class*='wrong']").addClass('shakeit');
        }
    });


    $('#loginbutton').click(function (e) {

        var emails = $('#loginemail').val().toLowerCase();
        var passwords = $('#loginpassword').val();
        $.post("http://127.0.0.1:3000/login", {
            email: emails,
            password: passwords
        }, function (data, textStatus, jqXHR) {
            console.log(data);
            if (!data) {
                $(".loginform").addClass("wrongloginform");
                
                
                $('.loginmessagebar').html("no user matched")
                $('.loginmessagebar').addClass('loginmessagebar-show');
                $('.loginform .email .input,.loginform .password .input').css({
                    border: "2px solid red"
                })
            } else {
                $('.loginform .email .input,.loginform .password .input').css({
                    border: "2px solid green"
                })
                $('.loginmessagebar').css({
                    background: 'green',
                })
                $('.loginmessagebar').html("Logged in")
                $('.loginmessagebar').addClass('loginmessagebar-show');
                setTimeout(() => {
                    location.reload()
                }, 2000);
            }
        },
        );
    });


    // logout
    $('.user .logout').click(function (e) {
        $.get("http://127.0.0.1:3000/logout",
            function (data, textStatus, jqXHR) {
                location.reload()
            },
        );
    });


    $(".checkout").click(function (e) {
        $.get("http://127.0.0.1:3000/checkout",
            function (data, textStatus, jqXHR) {
                $('.cart .products').html("")
                $('.checkoutarea .total').html('0');
                $('.cart .products').append(' <div class="emptycart">\
                <img src="checkedout.png" alt="" >\
                <p>Successfully checkedout, Keep Shopping</p>\
            </div>');

            }
        );

    });




    // show/hide wish cart
    $('.wishlink .fa-heart').click(function (e) {
        $('.wishlink .wishcart').slideToggle();
    });


    // show/hide cart
    $('.cartlink>p').click(function (e) {
        $('.cartlink .cart').slideToggle();
    });
    $('.user').click(function (e) {
        $('.user-dropdown').slideToggle();
    });

    // show/hide login/register form
    $(".wrap .closeforms, .createaccount").click(function (e) {

        $(".wrap").toggleClass('wrap-show');
        $(".wrap input").val('');
        $('.loginmessagebar').removeClass('loginmessagebar-show');
        $('.registermessagebar').removeClass('registermessagebar-show');


    });

    // change arrow
    $(".arrow").click(function (e) {
        $(".loginform").toggleClass('loginform-hide');
        $(".updown").toggleClass('updownchanged');
        $(".fa-arrow-up").toggleClass('fa-arrow-upnew');
        $(".switchto").toggleClass('chamgecontent');
        $(".arrow").toggleClass('arrownew');
        $(".switchto").html('Register');
        $(".chamgecontent").html('Login');
        // switchto
    });


   

});