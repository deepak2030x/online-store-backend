import { Router } from "express";
import pool from "../db/connection.js";
const productListRouter = Router();

productListRouter.get("/products", async (req, res) => {
  //   res.send("Product List");
  try {
    const { rows } = await pool.query("select * from products");
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

export default productListRouter;
