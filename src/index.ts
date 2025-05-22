import express from "express";
import { Schema, model } from "mongoose";
import { connectMongodb } from "./config/mongo";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// process.loadEnvFile(); //cargando variables de entorno

//1235
const PORT = process.env.PORT;

const bookSchema = new Schema({
  titulo: { type: String, required: true, unique: true },
  autor: { type: String, required: true },
  año: { type: Number, required: true },
});

const Book = model("Book", bookSchema);

const app = express();
app.use(express.json());
app.use(cors());

//request -> requerido
//response -> respuesta
app.get("/api/books", async (request, response): Promise<any> => {
  try {
    const books = await Book.find();
    return response.json({
      success: true,
      data: books,
      message: "Obteniendo todos los libros",
    });
  } catch (error) {
    const err = error as Error;
    return response.json({
      success: false,
      message: err.message,
    });
  }
});

//Obtener libros:
//http://localhost:1235/api/books

// Método HTTP
// puede ser GET - POST (es para agregar) - PATCH - DELETE

app.post("/api/books", async (req, res): Promise<any> => {
  try {
    const body = req.body;
    const { titulo, autor, año } = body;
    if (!titulo || !autor || !año)
      return res.status(400).json({ success: false, message: "data invalida" });
    const newBook = new Book({ titulo, autor, año });
    const savedBook = await newBook.save();
    res.status(201).json({
      success: true,
      data: savedBook,
      message: "libro agregado con éxito",
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// DELETE - http://localhost:1235/api/books

app.delete("/api/books/:id", async (req, res): Promise<any> => {
  try {
    const id = req.params.id;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook)
      return res
        .status(404)
        .json({ success: false, message: "error al borrar el libro" });
    res.json({ success: deletedBook, message: "libro borrado con éxito" });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.patch("/api/books/:id", async (req, res): Promise<any> => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedBook = await Book.findByIdAndUpdate(id, updates, {
      new: true, // devuelve el documento actualizado
      runValidators: true, // aplica validaciones del schema
    });

    if (!updatedBook) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    res.json({ message: "Libro actualizado correctamente", data: updatedBook });
  } catch (error) {
    console.error("Error al actualizar el libro:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor en escucha en el puerto http://localhost:${PORT}`);
  connectMongodb();
});
