import { productsRoutes } from "./routes/products.routes.js";
import { cartRoutes } from "./routes/carts.routes.js";
import express from "express";

const app = express();
const PORT = 8080;

// App config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(productsRoutes);
app.use(cartRoutes)

// App Listen
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
