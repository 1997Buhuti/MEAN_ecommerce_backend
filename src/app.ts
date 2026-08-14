import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import { env } from "./config/env";
import { notFound } from "./middleware/not-found";
import { errorHandler } from "./middleware/error";
import categoriesRoutes from "./routes/v1/category.routes";
import productsRoutes from "./routes/v1/product.routes";
import usersRoutes from "./routes/v1/user.routes";
import ordersRoutes from "./routes/v1/order.routes";

const app = express();

app.use(cors());
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("tiny"));
app.use("/public/uploads", express.static("public/uploads"));

app.get("/", (_req, res) => {
  res.status(200).json({ success: true, message: "ok" });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "healthy" });
});

const api = env.API_URI;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
