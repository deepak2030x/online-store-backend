import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
const app = express();
const port = 3000;

import loginRoute from "./routes/loginRoute.js";
import registerRoute from "./routes/registerRoute.js";
import productListRouter from "./routes/productList.js";
import cartRoute from "./routes/cartRoute.js";
import ordersRoute from "./routes/ordersRoute.js";

function verifyToken(req, res, next) {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
      next();
    } catch (err) {
      console.log(err);
      res.sendStatus(403);
    }
  }
}

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.static("public"));

app.use("/api/login", loginRoute);
app.use("/api/register", registerRoute);
app.use("/api", productListRouter);
app.use("/api", verifyToken, ordersRoute);
app.use("/api", verifyToken, cartRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
