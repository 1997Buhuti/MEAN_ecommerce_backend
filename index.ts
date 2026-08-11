import dns from "dns";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

import categoriesRoutes from "./routes/categories";
import productsRoutes from "./routes/products";
import usersRoutes from "./routes/users";
import ordersRoutes from "./routes/orders";

const app = express();
app.use(cors());
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//middleware

app.use(express.json());
app.use(morgan("tiny"));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

//Routes

const api = process.env.API_URI || "";

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

//Database
mongoose
  .connect(process.env.CONNECTION_STRING!, {
    dbName: "ecommerce-db",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

app.post(`${api}/products`, (req, res) => {
  const newProduct = req.body;
  console.log(newProduct);
  res.send(newProduct);
});

app.get("/api/getData", (req, res) => {
  return res.render("Hello World");
});

export default app;

app.listen(3000, () => {
  console.log("Server is listening at port 3000");
});
