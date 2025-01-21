import { Router } from "express";
import pool from "../db/connection.js";

const ordersRoute = Router();

async function insertOrderDetails(orderId, prod_id, qty) {
  return pool.query(
    "insert into orderdetails (product_id, order_id, quantity) values($1, $2, $3)",
    [orderId, prod_id, qty]
  );
}

ordersRoute.get("/orders/:userId", async (req, res) => {
  const { rows } = await pool.query(
    `select products.product_id, orders.order_id, quantity, status, product_name,
price
from orders
inner join orderdetails on orders.order_id = orderdetails.order_id
inner join products ON products.product_id = orderdetails.product_id
where customer_id = $1
order by orders.order_id`,
    [req.user.id]
  );
  //   console.log(rows);
  const result = [];
  if (rows.length > 0) {
    let currentOrder = {
      orderId: rows[0].order_id,
      orderDetails: [],
    };
    rows.forEach((row) => {
      if (row.order_id !== currentOrder.orderId) {
        result.push(currentOrder);
        currentOrder = {
          orderId: row.order_id,
          orderDetails: [],
        };
      }
      currentOrder.orderDetails.push({
        productId: row.product_id,
        quantity: row.quantity,
        productName: row.product_name,
        price: row.price,
      });
    });
    result.push(currentOrder);
  }
  console.log(result);
  res.status(200).json(result);
});

ordersRoute.post("/orders/:userId", async (req, res) => {
  // res.sendStatus(200);
  try {
    const { items: cartItems } = req.body;
    const { rows } = await pool.query(
      "insert into orders (customer_id, status) values ($1, $2) returning order_id",
      [req.user.id, "pending"]
    );
    // console.log(orderId);
    cartItems.forEach(async (item) => {
      await insertOrderDetails(
        item.product_id,
        rows[0].order_id,
        item.quantity
      );
    });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

export default ordersRoute;
