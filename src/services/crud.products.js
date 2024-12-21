import { error } from "node:console";
import fs from "node:fs";
import { v4 as uuid } from 'uuid';

//CRUD PRODUCTOS

class crudProducts {
    path;
    products;

    constructor({path}) {
        this.path = path;
        // Chequeamos si el archivo existe
        if (fs.existsSync(path)) {
          try {
            // Si existe lo leemos y lo parseamos
            this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
          } catch (error) {
            // Si hubo un error al leer el archivo, lo seteamos como vacío
            this.products = [];
          }
        } else {
          // Si no existe el archivo, lo seteamos como vacío
          this.products = [];
        }
    }

    //Lista todos los productos de la base
    getAll() {
        return this.products;
        }
    async getById(id) { 
        const product = this.products.find((product) => product.id === id);
        return product;
    }
    async create({title,description,code,price,status,stock,category}) {
        const id = uuid();

        const product = {
            id,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
        };
        this.products.push(product);
        try{
            await this.saveOnFile();
            return product;
        }catch (error){
            console.error("Error al guardar el archivo");
        }
    }

    async delete(id) {
        // Encontrar el producto por ID
        const product = this.products.find((product) => product.id === id);
    
        // Verificar si el producto existe
        if (!product) {
            return null;
        }
    
        // Buscar el índice del producto
        const index = this.products.findIndex((product) => product.id === id);
    
        // Eliminar el producto del array
        this.products.splice(index, 1);
    
        // Guardar los cambios en el archivo
        try {
            await this.saveOnFile();
            return product;
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            throw error;
        }
    }
    

    async update({ id, title, description, code, price, status, stock, category }) {
        const product = this.products.find((product) => product.id === id);
        if (!product) { // Corregido para verificar el producto encontrado
          return null;
        }
      
        // Asignar valores actualizados solo si están definidos
        product.title = title ?? product.title;
        product.description = description ?? product.description;
        product.code = code ?? product.code;
        product.price = price ?? product.price;
        product.status = status ?? product.status;
        product.stock = stock ?? product.stock;
        product.category = category ?? product.category;
      
        try {
          await this.saveOnFile();
          return product;
        } catch (error) {
          console.error("Error al actualizar el producto:", error);
          throw error;
        }
      }
      

    async saveOnFile (){
        try{
        await fs.promises.writeFile(this.path,JSON.stringify(this.products));
        } catch (error) {
            console.log(error);
            console.error("Error al guardar el archivo");
        }
    }
}

export const crudProductsInstance = new crudProducts({
    path: "src/db/products.json",
});