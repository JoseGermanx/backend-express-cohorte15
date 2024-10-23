require("dotenv").config();
// commonjs
const express = require("express"); // importamos el paquete
const morgan = require("morgan");
const app = express(); // creamos la instancia
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;

// conexión a mongoDB por medio de mongoose
mongoose
  .connect(process.env.URI_MONGO) // devuelve una promesa
  .then(() => console.log("Conexión exitosa a la base de datos")) // ok
  .catch((error) =>
    console.log("Error al conectar a la base de datos: ", error)
  ); // not ok

// primer paso crear un esquema de datos ---> Schema

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

// segundo paso crear el modelo de datos --> se conectara con cada colección (carpeta)

const Post = mongoose.model("Post", postSchema);

// middlewares globales
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// crear una api que realice un CRUD una app de gestión de publicaciones

// ruta para listar u obtener todos los posts READ --> GET
app.get("/posts", async (req, res) => {
  try {
    //intenta hacer esto

    const posts = await Post.find(); // un método que ejecuta un código asíncrono se tarda un tiempo adicional

    res.status(200).json({
      msg: "Posts obtenidos correctamente",
      posts,
      total: posts.length,
    });
  } catch (error) {
    // captura el error

    res.status(500).json({
      msg: "Error en el servidor de la bases de datos al obtener los posts",
      error,
    });
  }
});

app.get("/posts/:id", async (req, res) => {
  // se utiliza algún parámetro para indentificar el elemento

  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        msg: "Post no encontrado, intenta de nuevo",
      });
    }

    res.status(200).json({
      msg: "Post encontrado",
      data: {
        title: post.title,
        content: post.content,
      },
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error en el servidor de la bases de datos al obtener el post",
      error,
    });
  }
});

// ruta para postear o agregar un nuevo post CREATE --> POST
app.post("/posts", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      msg: "Campos requeridos",
    });
  }

  try {
    const newPost = new Post({
      title,
      content,
    });
    
    await newPost.save();
    
    res.status(201).json({
      msg: "Post creado correctamente",
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error en el servidor de la bases de datos al crear el post",
      error,
    });
  }
});

// ruta para actualizar un post existente UPDATE --> PUT Se utiliza algún parámetro para indentificar el elemento
app.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      msg: "Campos requeridos",
    });
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(id, {title, content})

    if(!updatedPost){
      return res.status(404).json({
        msg: "Post no encontrado, no se puede actualizar"
      })
    }

    res.status(200).json({
      msg: "Post actualizado correctamente",
      post: updatedPost
    })

  } catch (error) {

    res.status(500).json({
      msg: "Error en el servidor de la bases de datos al actualizar el post",
      error,
    });
  }
  
});

// rutas para eliminar un post DELETE --> DELETE Se utiliza algún parámetro para indentificar el elemento
app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  
  try {

const deletePost = await Post.findByIdAndDelete(id)

if (!deletePost) {
  return res.status(404).json({
    msg: "Post no encontrado, no se puede eliminar"
  })
}

res.status(200).json({
  msg: "Post eliminado correctamente",
})
    
    
  } catch (error) {
    console.log(error)
    res.status(500).json({
        msg: "Error en el servidor de la bases de datos al eliminar el post",
        error,
    })
  }


});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
