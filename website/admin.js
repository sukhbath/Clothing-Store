$(document).ready(function () {

    $.get("http://127.0.0.1:3000/adminstock", function (data, textStatus, jqXHR) {
        console.log(data);
        var stock = ""
        for (const val of data.stockdata) {
            stock += `<div class="product">
               <img src="${val.image}" alt="">
               <div class="gender"><span>${val.gender}</span>'s Collection</div>
               <div class="name">${val.name}</div>
               <div class="ratingdetail"><span class="rating">4.2</span><i class="fas fa-star"></i></div>
               <div class="pricedetail">$<span class="price">${val.price}</span></div>
               <div class="edit"><i class="far fa-edit"></i></div>
           </div>`
        }
        $(".allproducts .products").html(stock);
    },
    );





// show all users
    $('.userbutton').click(function (e) {
        $('.userbutton').addClass('afterbutton');
        $('.productbutton').removeClass('afterbutton');
        $.get("http://127.0.0.1:3000/adminusers", function (data, textStatus, jqXHR) {
            var users = ""
            for (const val of data) {
                users += `<div class="user">
            <div class="userimg">${val.name.split(" ")[0][0]}${val.name.split(" ")[0][1]}</div>
            <div class="name">${val.name}</div>
            <div class="email">${val.email}</div>
            <div class="password">${val.password}</div>
            <div class="edit"><i class="far fa-edit"></i></div>
        </div>`
            }
            $(".allproducts .users").html(users);
            $(".allproducts .products").html('');

        },
        );
    });



// show all products
    $('.productbutton').click(function (e) {
        $('.productbutton').addClass('afterbutton');
        $('.userbutton').removeClass('afterbutton');
        $.get("http://127.0.0.1:3000/adminstock", function (data, textStatus, jqXHR) {
            console.log(data);
            var stock = ""
            for (const val of data.stockdata) {
                stock += `<div class="product">
               <img src="${val.image}" alt="">
               <div class="gender"><span>${val.gender}</span>'s Collection</div>
               <div class="name">${val.name}</div>
               <div class="ratingdetail"><span class="rating">4.2</span><i class="fas fa-star"></i></div>
               <div class="pricedetail">$<span class="price">${val.price}</span></div>
               <div class="edit"><i class="far fa-edit"></i></div>
           </div>`
            }
            $(".allproducts .products").html(stock);
            $(".allproducts .users").html('');

        },
        );
    });







// update products
    var currentdata;
    $('.products').click(function (e) {
        
        if (e.target.className == 'far fa-edit') {
            $('.productchangeform').css({
                display: "flex"
            });
            var item = $(e.target).parents('.product');
            currentdata = {
                'image': item.find("img").attr("src").trim(),
                'name': item.find(".name").html().trim(),
                'price': (item.find(".price").html()),
                'gender': item.find(".gender span").html().trim(),
            }
            console.log(currentdata);
            $("#changename").val(currentdata.name);
            $("#changegender").val(currentdata.gender);
            $("#changeprice").val(currentdata.price);
        }
    });

    $('.productchangeform .changeproductdata').click(function (e) {
        var newdata = {
            'name': $("#changename").val(),
            'gender': $("#changegender").val(),
            'price': $("#changeprice").val()
        }
        console.log(newdata);
        
        if (true) {
            $.post("http://127.0.0.1:3000/adminchange", {
                data: [currentdata, newdata]
            },
                function (data, textStatus, jqXHR) {
                    console.log(data);
                    $('.productchangeform .messagebar').html('Product information updated');
                    $('.productchangeform .messagebar').addClass('messagebar-show');
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                },
            );
        }
    });


    $('.productchangeform .closeforms').click(function (e) {
        $('.productchangeform').css({ display: "none" });
        $('.productchangeform .messagebar').removeClass('messagebar-show')
    });



    var currentuser;
    $('.users').click(function (e) {
        if (e.target.className == 'far fa-edit') {
            $('.userchangeform').css({
                display: "flex"
            });
            var item = $(e.target).parents('.user');
            currentuser = {
                'name': item.find(".name").html().trim(),
                'email': (item.find(".email").html()),
                'password': item.find(".password").html().trim(),
            }

            $("#changeuname").val(currentuser.name);
            $("#changeupassword").val(currentuser.password);
            console.log("done");

        }
    });

    $('.userchangeform .changeproductdata').click(function (e) {
        var newuser = {
            'name': $("#changeuname").val(),
            'password': $("#changeupassword").val()
        }

        $.post("http://127.0.0.1:3000/adminuchange", {
            data: [currentuser, newuser]
        },
            function (data, textStatus, jqXHR) {
                if (data) {
                    console.log(data);
                    $('.userchangeform .messagebar').css('backgroundColor', 'green');
                    $('.userchangeform .messagebar').html('user information updated');
                    $('.userchangeform .messagebar').addClass('umessagebar-show');
                    setTimeout(() => {
                        location.reload()
                    }, 2000);
                }
            },
        );

        $('.userchangeform .closeforms').click(function (e) {
            $('.userchangeform').css({ display: "none" });
            $('.userchangeform .messagebar').removeClass('umessagebar-show')
        });


    });


});

