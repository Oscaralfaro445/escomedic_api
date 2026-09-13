require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/db");
require("./models");
const employeeRoutes = require("./routes/employee.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 4002;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      service: "employee-service",
      status: "ok",
      db: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      service: "employee-service",
      status: "error",
      db: "disconnected",
      error: error.message,
    });
  }
});

app.use("/employees", employeeRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`employee-service corriendo en el puerto ${PORT}`);
});
