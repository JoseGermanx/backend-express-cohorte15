
// commonjs
const express = require('express'); // importamos el paquete
const morgan = require('morgan');
const app = express() // creamos la instancia
const port = 3000

// middlewares globales
app.use(morgan('dev'));
app.use(express.json());

// crear una api que realice un CRUD una app de gestión de publicaciones

let posts = [] // base de datos simulada en memoria

// necesidad endpoints y sus respectivos métodos

// ruta para listar u obtener todos los posts READ --> GET
app.get('/posts', (req, res) => {
    res.json(posts)
})

app.get('/posts/:id', (req, res) => {   // se utiliza algún parámetro para indentificar el elemento

    const { id } = req.params
    const postId = parseInt(id)

    const post = posts.find(post => post.id === postId)

    if(!post){
        return res.status(404).json({
            msg: 'Post no encontrado'
        })
    }

    res.status(200).json({
        msg: 'Post encontrado',
        post
    })

})

// ruta para postear o agregar un nuevo post CREATE --> POST
app.post('/posts', (req, res) => {
    const { title, content } = req.body;

    const newPost = {
        id: posts.length + 1,
        title,
        content
    }
    posts.push(newPost);
    res.status(201).json({
        msg: 'Post creado correctamente',
        post: newPost
    });

} )


// ruta para actualizar un post existente UPDATE --> PUT Se utiliza algún parámetro para indentificar el elemento
app.put('/posts/:id', (req, res) => {

    console.log("Hola desde ele endpoint")
    const { id } = req.params
    const { title, content } = req.body;

    const postId = parseInt(id)

    const post = posts.find(post => post.id === postId)
    
    if(!post || id < 0){
        return res.status(404).json({
            msg: 'Post no encontrado, no se puede actualizar'
        })
    }

    posts[id - 1].title = title
    posts[id - 1].content = content
    res.status(200).json({
        msg: 'Post actualizado correctamente',
        post: posts[id - 1]
    });




})

// rutas para eliminar un post DELETE --> DELETE Se utiliza algún parámetro para indentificar el elemento
app.delete('/posts/:id', (req, res) => {

    const { id } = req.params
    const postId = parseInt(id)

    const post = posts.find(post => post.id === postId)

    if(!post){
        return res.status(404).json({
            msg: 'Post no encontrado, no se puede eliminar'
        })
    }

    posts = posts.filter(post => post.id !== postId)
    res.status(200).json({
        msg: 'Post eliminado correctamente',
        posts
    });

})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
