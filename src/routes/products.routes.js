import { Router } from "express";
import { crudProductsInstance } from "../services/crud.products.js";
export const productsRoutes = Router();

// Obtener todos los productos
productsRoutes.get("/api/products", async (req, res) => {
  try {
    const products = await crudProductsInstance.getAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos" });
  }
});

// Obtener un producto por ID
productsRoutes.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await crudProductsInstance.getById(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto" });
  }
});

// Crear un nuevo producto
productsRoutes.post("/api/products", async (req, res) => {
    const { title, description, code, price, status, stock, category } = req.body;
  
    // Validar que todos los campos obligatorios estén presentes
    if (!title || !description || !code || !price || !status === undefined || !stock || !category) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios: title, description, code, price, status, stock, category."
      });
    }
  
    try {
      // Si todos los campos son válidos, proceder con la creación del producto
      const product = await crudProductsInstance.create({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
      });
  
      res.status(201).json(product);  // Devolver el producto creado
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear el producto" });
    }
  });
  

// Actualizar un producto existente
productsRoutes.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, code, price, status, stock, category } = req.body;
  try {
    const product = await crudProductsInstance.update({
      id,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
    });
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
});

// Eliminar un producto
productsRoutes.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await crudProductsInstance.delete(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json({ message: "Producto eliminado", product });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
});