import {Router} from "express";
import { cartInstance } from "../services/crud.cart.js";
export const cartRoutes = Router();

// Crear un nuevo carrito
cartRoutes.post("/api/carts", async (req, res) => {
    try {
        const newCart = await cartInstance.create();  // Crear un carrito vacío
        res.status(201).json(newCart);  // Devolver el carrito recién creado
    } catch (error) {
        res.status(500).json({ message: "Error al crear el carrito", error: error.message });
    }
});

// Obtener un carrito por ID
cartRoutes.get('/api/carts/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const cart = await cartInstance.getById(id); 
        // Si no se encuentra el carrito, responder con error 404
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        // Si se encuentra el carrito, responder con los detalles
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Agregar un producto a un carrito específico
cartRoutes.post("/api/carts/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;  // Obtenemos el ID del carrito y el ID del producto de los parámetros de la URL

    try {
        // Agregar el producto al carrito
        const updatedCart = await cartInstance.addProductToCart(cid, pid);
        res.status(200).json(updatedCart);  // Devolver el carrito actualizado
    } catch (error) {
        res.status(500).json({ message: "Error al agregar el producto al carrito", error: error.message });
    }
});