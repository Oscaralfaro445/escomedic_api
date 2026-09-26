const express = require("express");
const router = express.Router();
const {
  createEmployee,
  listEmployees,
  checkEmployeeExists,
  getEmployeeById,
  updateEmployee,
  updateEmployeeStatus,
  getMyProfile,
} = require("../controllers/employee.controller");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

// Cuidamos el orden en el cual se declaran las rutas, ya que si se declara primero la ruta con el parámetro dinámico, esta capturará todas las solicitudes que coincidan con el patrón, incluyendo aquellas que deberían ser manejadas por rutas más específicas. Por ejemplo, si se declara primero la ruta "/:employeeId", cualquier solicitud a "/me" será capturada por esta ruta y no llegará a la ruta específica para "/me". Por eso, es importante declarar primero las rutas más específicas y luego las rutas con parámetros dinámicos.
router.get("/me", authenticate, getMyProfile);
router.get("/", authenticate, authorize("administrador"), listEmployees);
router.get("/:employeeId/exists", authenticate, checkEmployeeExists);
router.get(
  "/:employeeId",
  authenticate,
  authorize("administrador"),
  getEmployeeById,
);
router.post("/", authenticate, authorize("administrador"), createEmployee);
router.post(
  "/:employeeId",
  authenticate,
  authorize("administrador"),
  updateEmployee,
);
router.patch(
  "/:employeeId/status",
  authenticate,
  authorize("administrador"),
  updateEmployeeStatus,
);

module.exports = router;
