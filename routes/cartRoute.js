import { Router } from "express";
import pool from "../db/connection.js";

const cartRoute = Router();

cartRoute.get("/cart/:userId", async (req, res) => {
  //   res.send("Product List");
  try {
    const { rows } = await pool.query(
      "select product_id, quantity, price, name from cart where user_id = $1",
      [req.user.id]
    );
    console.log(rows);
    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

cartRoute.post("/cart/:userId", async (req, res) => {
  const { prod_id, qty, name, price } = req.body;
  // console.log(user_id, typeof user_id);
  try {
    const { rows: userRows } = await pool.query(
      "select user_id from cart where user_id = $1",
      [req.user.id]
    );
    const { rows: prodRows } = await pool.query(
      "select product_id from cart where user_id = $1 and product_id = $2",
      [req.user.id, prod_id]
    );
    if (userRows.length !== 0 && prodRows.length !== 0) {
      if (qty !== 0) {
        const result = await pool.query(
          "update cart set quantity = $1 where product_id = $2",
          [qty, prod_id]
        );
      } else {
        const result = await pool.query(
          "delete from cart where product_id = $1 and user_id = $2",
          [prod_id, req.user.id]
        );
      }
    } else {
      const result = await pool.query(
        "insert into cart(cart_id, user_id, product_id, quantity, name, price) values($1, $2, $3, $4, $5, $6)",
        [req.user.id, req.user.id, prod_id, qty, name, price]
      );
    }
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
export default cartRoute;
