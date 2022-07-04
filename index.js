const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
var cors = require("cors");
require("dotenv/config");

const app = express();
export default app;
app.use(cors());
app.options("*", cors());

//middleware

app.use(express.json());
app.use(morgan("tiny"));

//Routes

const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");

const api = process.env.API_URI;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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

app.listen(3000, () => {
  console.log("Server is listening at port 3000");
});
