
// commonjs
const express = require('express'); // importamos el paquete
const app = express() // creamos la instancia
const port = 3000

//  datos       peticion      respuesta
app.get( "/", (   req      ,     res     ) => {
    res.send("Hola mundo con cambios")
} )

app.get( "/about", (req, res) => {
    res.send("Acerca de")
} )

app.post( "/crear", (req, res) => {
    const nombre = req.query.name
    res.send("Crear: " + nombre)
} )


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
