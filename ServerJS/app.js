const express = require('express');
const mySql = require('mysql');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://sukh:sukh@cluster0-7nszg.mongodb.net/test?retryWrites=true&w=majority";
const app = express();
const port = 3000;
// var con = mySql.createConnection({
//     host: "127.0.0.1",
//     port: "3306",
//     user: "myDBuser",
//     password: "123",
//     database: "mydatabase"
// });
// con.connect(function (err,res) {
//     if (err) {
//         console.log("Error Connection DB");
//         res.status(500).send('Something broke!')
//         console.log(err);
//     } else {
//         console.log("Connection With DB Sucess");
//     }
// });



app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


/*starts here*/
//to get all the stock data from database
app.get('/stock', function (req, res) {
    console.log('stock requested');
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("project");
        dbo.collection("products").find({}).toArray(function (err, stock) {
            if (err) throw err;
            stockdata = stock;
        })
        dbo.collection("users").findOne({ "currentuser": true }, { useUnifiedTopology: true }, function (err, user) {
            if (err) throw err;
            if (user != null) {
                res.status(200).send({ stockdata: stockdata, currentuser: user });
                db.close();
            }
            else {
                res.status(200).send({ stockdata: stockdata })
            }
        });
    });
})

//to register the user
//the Name,Email and Password will be taken from the user and will be inserted in
//User's collection
app.post('/register', function (req, res) {
    var data = req.body;
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("project");
        console.log(data);

        dbo.collection("users").findOne({ email: data.email }, function (err, user) {
            if (err) throw err
            if (user == null) {
                var info = {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    currentuser: false,
                    cart: [],
                    wishcart: [],
                }
                dbo.collection('users').insertOne(info, function (err, resp) {
                    if (err) throw err;
                    console.log('new user inserted');
                    res.send(true)
                    db.close();
                })
            } else {
                console.log(user);
                res.send(false)
            }
        })
    });
});






//login
app.post('/login', function (req, res) {
    var data = req.body;
    console.log(data);

    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("project");
        dbo.collection("users").updateMany({}, { "$set": { "currentuser": false } }, function (err, res) {
            if (err) throw err
        });


        dbo.collection("users").findOne(data, function (err, user) {
            if (user != null) {
                console.log('user exists');
                dbo.collection("users").updateOne(user, { "$set": { "currentuser": true } }, function (err, ress) {
                    if (err) throw err;
                    res.status(200).send({ currentuser: user });
                    db.close();
                })
            } else {
                console.log('user not exists');
                res.status(200).send(false);
            }
        })
    });
})

//logout
app.get('/logout', function (req, res) {
    var data = req.body;
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("project");
        dbo.collection("users").updateMany({}, { "$set": { "currentuser": false } }, function (err, user) {
            if (err) throw err;
        })
    });
    res.send('logged out')
})

app.put('/addtocarrt', function (req, res) {
    var data = req.body;
    console.log(data);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("project");
        dbo.collection("users").findOne({ "currentuser": true }, function (err, user) {
            if (err) throw err;

            //to check if any one is logged in or not
            if (user != null) {
                var found = false;

                //to check if the item is already in cart
                for (const val of user.cart) {
                    if ((val.name == data.name) && (val.image == data.image) && (val.price == data.price)) {
                        console.log(val.name);
                        console.log(data.name);
                        found = true;
                        break;
                    }
                }
                if (found) {
                    res.send(false)
                } else {
                    dbo.collection("users").updateOne({ "currentuser": true }, { $push: { cart: data } }, function (err, ress) {
                        if (err) throw err;
                        res.send(true)
                        console.log(true);
                        db.close();
                    });
                }
            } else {
                res.send('loginplease')
            }
        });
    })
});



app.delete('/removefromcarrt', function (req, res) {
    var data = req.body;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log('removing');
        console.log(data);
        var dbo = db.db("project");
        dbo.collection("users").updateMany({ "currentuser": true }, { $pull: { cart: data } }, function (err, res) {
            if (err) throw err;
            console.log('removed');
            db.close();
        });
    });
    res.send(true)
})







// add to wish
app.post('/addtowish', function (req, res) {
    var data = req.body;
    console.log(data);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("project");
        dbo.collection("users").findOne({ "currentuser": true }, function (err, user) {
            if (err) throw err;
            var found = false;
            for (const val of user.wishcart) {
                if ((val.name == data.name) && (val.image == data.image) && (val.price == data.price)) {
                    console.log(val.name);
                    console.log(data.name);
                    found = true;
                    break;
                }
            }
            if (found) {
                res.send(false)
            } else {
                dbo.collection("users").updateOne({ "currentuser": true }, { $push: { wishcart: data } }, function (err, ress) {
                    if (err) throw err;
                    res.send(true)
                    console.log('added');
                    db.close();
                });
            }
        });
    })
});

// remove from wish
app.post('/removefromwish', function (req, res) {
    var data = req.body;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log('removing');
        console.log(data);
        var dbo = db.db("project");
        dbo.collection("users").updateMany({ "currentuser": true }, { $pull: { wishcart: data } }, function (err, res) {
            if (err) throw err;
            console.log('removed');
            db.close();
        });
    });
    res.send(data)
})


// add to cart from wish
app.post('/addtocartfromwish', function (req, res) {
    var data = req.body;
    console.log(data);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("project");
        dbo.collection("users").findOne({ "currentuser": true }, function (err, user) {
            // dbo.collection("users").findOne({ $and: [ { "currentuser": true }, { cart: data } ] }, function (err, user) {
            if (err) throw err;
            var found = false;
            for (const val of user.cart) {
                if ((val.name == data.name) && (val.image == data.image) && (val.price == data.price)) {
                    console.log(val.name);
                    console.log(data.name);
                    found = true;
                    break;
                }
            }

            if (found) {
                res.send(false)
            } else {
                dbo.collection("users").updateOne({ "currentuser": true }, { $push: { cart: data } }, function (err, ress) {
                    if (err) throw err;
                    dbo.collection("users").updateOne({ "currentuser": true }, { $pull: { wishcart: data } }, function (err, ress) {
                        if (err) throw err;
                        res.send(true)
                        console.log('added from wish');
                        db.close();
                    });
                });
            }
        });
    })
});





app.post('/addtocart', function (req, res) {
    var data = req.body;
    console.log(data);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("project");
        dbo.collection("users").findOne({ "currentuser": true }, function (err, user) {
            if (err) throw err;

            //to check if any one is logged in or not
            if (user != null) {
                var found = false;

                //to check if the item is already in cart
                for (const val of user.cart) {
                    if ((val.name == data.name) && (val.image == data.image) && (val.price == data.price)) {
                        console.log(val.name);
                        console.log(data.name);
                        found = true;
                        break;
                    }
                }
                if (found) {
                    res.send(false)
                } else {
                    dbo.collection("users").updateOne({ "currentuser": true }, { $push: { cart: data } }, function (err, ress) {
                        if (err) throw err;
                        res.send(true)
                        console.log(true);
                        db.close();
                    });
                }
            } else {
                res.send('loginplease')
            }
        });
    })
});






app.post('/removefromcart', function (req, res) {
    var data = req.body;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log('removing');
        console.log(data);
        var dbo = db.db("project");
        dbo.collection("users").updateMany({ "currentuser": true }, { $pull: { cart: data } }, function (err, res) {
            if (err) throw err;
            console.log('removed');
            db.close();
        });
    });
    res.send(true)
})





app.get('/checkout', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("project");
        dbo.collection("users").updateMany({ "currentuser": true }, { "$set": { cart: [] } }, function (err, ress) {
            if (err) throw err;
            res.send('checked out')
            db.close();
        });
    });
})

app.get('/adminstock', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("project");
        dbo.collection("products").find({}).toArray(function (err, stock) {
            if (err) throw err;
            stockdata = stock;
        })
        dbo.collection("users").find({}).toArray(function (err, users) {
            if (err) throw err;
            res.status(200).send({ stockdata: stockdata, allusers: users });
            db.close();
        });
    });
})



app.get('/adminusers', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("project");
        dbo.collection("users").find({}).toArray(function (err, users) {
            if (err) throw err;
            res.status(200).send(users);
            db.close();
        });
    });
})





app.post('/adminchange', function (req, res) {
    var data = req.body;
    console.log(data);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
console.log(data);

        var newdata = {
            'name': data["data"][1].name,
            'gender': data["data"][1].gender,
            'price': data["data"][1].price,

        }
        var dbo = db.db("project");
        dbo.collection("products").updateOne(data["data"][0], { "$set": newdata }, function (err, stock) {
            if (err) throw err;
            res.status(200).send('updated');

        })
    });
})


app.post('/adminuchange', function (req, res) {
    var data = req.body;
    console.log(data);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var newdata = {
            'name': data["data"][1].name,
            'password': data["data"][1].password,

        }
        var dbo = db.db("project");
        dbo.collection("users").findOne({ email: data["data"][1].email }, function (err, user) {
            if (err) throw err;
            dbo.collection("users").updateOne(data["data"][0], { "$set": newdata }, function (err, user) {
                if (err) throw err;
                res.status(200).send(true)
            })
        })
    });
})



app.put('/stockS', function (req, res) {
    console.log('done');
    
})













//Respond to a PUT request to the /user route:
app.put('/user', function (req, res) {
    res.send('Got a PUT request at /user')
})
// Respond to a DELETE request to the /user route:
app.delete('/user', function (req, res) {
    res.send('Got a DELETE request at /user')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))