import { Router } from "express";
import pool from "../db/connection.js";

const registerRoute = Router();

registerRoute.post("/", async (req, res) => {
  // 1. grab name, email and password from req.
  // 2. insert above details in db.
  // 3. while inserting, if it gets any error, send server error res and tell
  //    user to try again.
  // 4. If everything is fine, send a response to client stating user is registered and tell
  //    user to login with registered details.

  const { name, email, pwd } = req.body;
  const { rows } = await pool.query(
    "select * from customers where email = $1",
    [email]
  );
  if (rows.length > 0) {
    res.sendStatus(409);
    return;
  }

  try {
    await pool.query(
      "insert into customers (customer_name, email, password) values ($1, $2, $3)",
      [name, email, pwd]
    );
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

export default registerRoute;
