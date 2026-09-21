require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/db");
require("./models");
const patientRoutes = require("./routes/patient.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 4003;

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
    res
      .status(200)
      .json({ service: "patient-service", status: "ok", db: "connected" });
  } catch (error) {
    next(error);
  }
});

app.use("/patients", patientRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`patient-service corriendo en el puerto ${PORT}`);
});
