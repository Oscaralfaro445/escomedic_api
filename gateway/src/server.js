require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const setupProxyRoutes = require("./routes/proxy.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({
    service: "gateway",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

setupProxyRoutes(app);

app.listen(PORT, () => {
  console.log(`gateway corriendo en el puerto ${PORT}`);
});
