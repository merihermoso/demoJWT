const express = require("express");
const jwt = require("jsonwebtoken");

//ejecutamos la función express
const app = express();

//método get -> callback(function) necesita los dos parámteros
app.get("/api", (req, res) => {
    //respondemos al usuario con un mensaje json
    res.json({
        mensaje: "Nodejs and JWT"
    });
});

//método post para hacer login
app.post("/api/login", (req, res) => {
    //creamos objeto user
    const user= {
        id: 1,
        name: "Meri",
        email: "meri@email.com"
    }
    //cuando un usuario hace login, se le genera un token (para identificarlo)
    jwt.sign({user}, 'secretkey', {expiresIn: '32s'}, (err, token) => {
        //enviamos el token al cliente (el navegador almacenará ese token mediante localstorage o cookies)
        res.json({
            token
        });
    });
});


app.post("/api/posts", verifyToken, (req, res) => {
   //authData es la info de nuestro usuario
    jwt.verify(req.token, 'secretkey', (error, authData) => {
        if(error){
            res.sendStatus(403);
        }else{
            res.json({
                mensaje: "El POST ha sido creado",
                authData 
            });
        }
    });

});

//función para verificar los Tokens con el parametro req, res y next(que solo se ejecutará si todo ha salido bien)
//Authorization: Bearer <token>
function verifyToken(req, res, next){
    //obtenemos la información del token y la almacenamos en la variable bearerHeader
    const bearerHeader = req.headers['authorization'];

    //si la variable tiene un valor distinto a undefined, tendremos acceso directo a la auth
    if(typeof bearerHeader !== 'undefined'){
        //el "trozo 1" es el que contiene la info del token 
        const bearerToken = bearerHeader.split(" ")[1];
        //almacenamos el token en req.token
        req.token= bearerToken;
        //si ha salido todo bien, se ejectuta next
        next();
        //si el token no es válido retorna estado 403 (Ruta/acceso prohibido)
        }else{
            res.sendStatus(403)
        }

}

//puerto por el que escuchamos
app.listen(3000, function(){
    console.log("nodejs app running...");
})