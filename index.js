require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000


// Conexión a MongoDB usando Mongoose
mongoose.connect(process.env.URI_MONGO)
.then(() => console.log('Conectado a MongoDB'))
.catch((error) => console.error('Error al conectarse a MongoDB. Intente de nuevo', error));

// Definición del esquema de Mongoose para los posts
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

// Modelo de datos Post
const Post = mongoose.model('Post', postSchema);

// Middlewares globales
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Crear una API que realice un CRUD para una app de gestión de publicaciones

// Ruta para listar u obtener todos los posts (READ) --> GET
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener los posts', error });
    }
});

// Ruta para obtener un post específico por ID (READ) --> GET
app.get('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ msg: 'Post no encontrado' });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener el post', error });
    }
});

// Ruta para crear un nuevo post (CREATE) --> POST
app.post('/posts', async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ msg: 'Faltan datos requeridos' });
        }

        const newPost = new Post({
            title,
            content
        });

        const savedPost = await newPost.save();
        res.status(201).json({ msg: 'Post creado correctamente', post: savedPost });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear el post', error });
    }
});

// Ruta para actualizar un post existente (UPDATE) --> PUT
app.put('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ msg: 'Faltan datos para actualizar' });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { title, content }
        );

        if (!updatedPost) {
            return res.status(404).json({ msg: 'Post no encontrado' });
        }

        res.status(200).json({ msg: 'Post actualizado correctamente', post: updatedPost });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar el post', error });
    }
});

// Ruta para eliminar un post (DELETE) --> DELETE
app.delete('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({ msg: 'Post no encontrado, no se puede eliminar' });
        }

        res.status(200).json({ msg: 'Post eliminado correctamente', post: deletedPost });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar el post', error });
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
