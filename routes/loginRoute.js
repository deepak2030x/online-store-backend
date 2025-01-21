import { Router } from "express";
import jwt from "jsonwebtoken";
import pool from "../db/connection.js";

const loginRoute = Router();

loginRoute.post("/", async (req, res) => {
  // 1. grab email and password from req.
  // 2. check email existence in database. if exist, then verify
  //    user entered password with password present in database.
  // 3. if email doesn't exist, send a response with appropriate message
  // 4. if email exist, but password is wrong, send a response with appropriate message.
  // 5. if both email and password are correct, then create a jwt token with a payload
  //    of email and userID & with secret key from environment variable.
  // 6. once token is generated, send it to client as a response.
  const email = req.body.email;
  const pwd = req.body.password;

  const { rows } = await pool.query(
    "select * from customers where email = $1",
    [email]
  );
  // console.log(rows);
  if (rows.length == 0) {
    res.sendStatus(404);
    return;
  }

  const user = rows[0];
  if (pwd !== user.password) {
    res.sendStatus(403);
    return;
  }

  const token = jwt.sign(
    { id: user.customer_id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1hr",
    }
  );
  // console.log(token);
  res.status(200).json({
    token,
    userId: user.customer_id,
    userEmail: user.email,
    userName: user.customer_name,
    expiry: 60 * 60 * 1000,
  });
});

export default loginRoute;
