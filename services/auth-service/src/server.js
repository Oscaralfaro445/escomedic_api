require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/db");
require("./models");
const authRoutes = require("./routes/auth.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 4001;

// Middlewares globales

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true, //
  }),
);
app.use(express.json());
app.use(cookieParser());

// Endpoint de salud

app.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      service: "auth-service",
      status: "ok",
      db: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      service: "auth-service",
      status: "error",
      db: "disconnected",
      error: error.message,
    });
  }
});

app.use("/auth", authRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`auth-service corriendo en el puerto ${PORT}`);
});

// Comanos para correr el contenedor de postgres

/* docker run --name postgres-clinico `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -p 5432:5432 `
  -d postgres:16 */
