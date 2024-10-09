
// commonjs
const express = require('express'); // importamos el paquete
const morgan = require('morgan');
const app = express() // creamos la instancia
const port = 3000


// middlewares globales
app.use(morgan('dev'));
app.use(express.json()); 









app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
