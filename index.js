
// commonjs
const express = require('express'); // importamos el paquete
const morgan = require('morgan');
const app = express() // creamos la instancia
const port = 3000


//definición de funciones

const myLogger = function (req, res, next) {
    console.log('Estas logueado')
    next()
  }


const accesoRestringido = function (req, res, next) {
    console.log('Acceso restringido')
    next()
  } 

// middlewares globales
app.use(morgan('dev')); // se crea un middleware global de terceros
app.use(express.json()); // se crear un middleware global incorporado
app.use(myLogger) // middleware global personalizado
app.use(accesoRestringido)


//  datos  peticion  respuesta
app.get( "/", accesoRestringido , ( req, res) => {
    res.send("Hola mundo con cambios")
})

app.post("/registro", (req, res) => {
  // acá irá la logica para registrar un nuevo usuario en nuestro sistema
  // verificar los datos que se reciben
  // almanecenar esos en una base de datos
   res.send("Registro realizado")
} )

app.get( "/about",accesoRestringido, (req, res) => {
    res.send("Acerca de nosotros")
} )

// endpoint para listar usuarios
app.get( "/users", accesoRestringido, (req, res) => {
    //consultar a la base de datos
    // obtener el listadp y prepararlo para enviarlo como respuesta
    // enviar la respuesta
    res.send("Listado de usuarios")
} )


app.post( "/crear", (req, res) => {
    const nombre = req.query.name
    res.send("Crear: " + nombre)
} )

app.post("/upload", (req, res) => {
    const nombre = req.body.name
    res.send("Upload: " + nombre)
} )


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
