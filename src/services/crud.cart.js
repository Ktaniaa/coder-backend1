import { error } from "node:console";
import fs from "node:fs";
import { v4 as uuid } from 'uuid';

//CRUD CART

class myCart {
    path;
    carts;

    constructor({path}) {
        this.path = path;
        // Chequeamos si el archivo existe
        if (fs.existsSync(path)) {
          try {
            // Si existe lo leemos y lo parseamos
            this.carts = JSON.parse(fs.readFileSync(this.path, "utf-8"));
          } catch (error) {
            // Si hubo un error al leer el archivo, lo seteamos como vacío
            this.carts = [];
          }
        } else {
          // Si no existe el archivo, lo seteamos como vacío
          this.carts = [];
        }
    }

    // Crear un nuevo carrito vacío
    async create() {
        const id = uuid(); // Generar un id único para el carrito
        const newCart = {
            id,
            products: [] // Inicializar el carrito con un array vacío de productos
        };

        this.carts.push(newCart); // Agregar el carrito al arreglo de carritos

        try {
            await this.saveOnFile(); // Guardar el carrito en el archivo
            return newCart; // Retornar el carrito creado
        } catch (error) {
            console.error("Error al crear el carrito", error);
            throw new Error("No se pudo guardar el carrito.");
        }
    }

    // Agregar un producto a un carrito
    async addProductToCart(cartId, prodId) {
        const cart = this.carts.find((cart) => cart.id === cartId);

        // Verificar si el carrito existe
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        // Verificar si el producto ya está en el carrito
        const existingProduct = cart.products.find((item) => item.prodId === prodId);

        if (existingProduct) {
            // Si el producto ya está, incrementar la cantidad
            existingProduct.quantity += 1;
        } else {
            // Si el producto no está, agregarlo con cantidad 1
            cart.products.push({ prodId, quantity: 1 });
        }

        // Guardar los cambios
        await this.saveOnFile();

        return cart; // Devolver el carrito actualizado
    }    

    //Obtener los productos del carrito
    async getById(id) { 
        const cart = this.carts.find((cart) => cart.id === id);
        return cart;
    }

    async saveOnFile (){
        try{
        await fs.promises.writeFile(this.path,JSON.stringify(this.carts));
        } catch (error) {
            console.log(error);
            console.error("Error al guardar el archivo");
        }
    }
}

export const cartInstance = new myCart ({
    path: "src/db/carts.json",
});