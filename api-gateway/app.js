import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

const routes = {
  "/auth": "http://localhost:2001",
  "/org": "http://localhost:2002",
  "/core": "http://localhost:2003",
};

for (const route in routes) {
  const target = routes[route];
  app.use(route, createProxyMiddleware({ target }));
  app.use(morgan("dev"));
  app.get("/health-check", (req, res) => {
    res.status(200).json({
      message: `api gateway service is running`,
      success: true,
    });
  });
}

app.listen(9009, () => console.log("API Gateway Started on port 9009"));
