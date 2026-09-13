const { Employee } = require("../models");
const AppError = require("../utils/AppError");
const {
  createAuthUser,
  deleteAuthUser,
  updateAuthUserStatus,
  getUsersStatusBatch,
} = require("../utils/authServiceClient");

async function createEmployee(req, res, next) {
  let createdAuthUser = null;

  try {
    const { email, password, role_id, name, last_name_p, last_name_m, phone } =
      req.body;

    if (!email || !password || !role_id || !name || !last_name_p) {
      throw new AppError(
        "email, password, role_id, name y lste_name_p son requeridos",
        400,
      );
    }

    const cookieHeader = req.headers.cookie;

    // Paso 1: crear el usuario en auth-service
    createdAuthUser = await createAuthUser(
      { email, password, role_id },
      cookieHeader,
    );

    // Paso 2: crear el empleado localmente
    let employee;
    try {
      employee = await Employee.create({
        user_id: createdAuthUser.id,
        name,
        last_name_p,
        last_name_m,
        phone,
      });
    } catch (dbError) {
      // Compensación: deshacer la creación del usuario
      await deleteAuthUser(createdAuthUser.id, cookieHeader);
      throw new AppError(
        "Error al crear el empleado, la operación fue revertida",
        500,
      );
    }

    res.status(201).json({
      message: "success",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
}

async function listEmployees(req, res, next) {
  try {
    const cookieHeader = req.headers.cookie;

    const employees = await Employee.findAll();

    if (employees.length === 0) {
      return res.status(200).json({ status: "success", data: [] });
    }

    const userIds = employees.map((employee) => employee.user_id);
    const statuses = await getUsersStatusBatch(userIds, cookieHeader);

    const statusMap = new Map(
      statuses.map((status) => [status.id, status.status]),
    );

    const enriched = employees.map((employee) => ({
      ...employee.toJSON(),
      status: statusMap.get(employee.user_id) || "unknown",
    }));

    res.status(200).json({
      status: "success",
      data: enriched,
    });
  } catch (error) {
    next(error);
  }
}

async function getEmployeeById(req, res, next) {
  try {
    const { employeeId } = req.params;
    const cookieHeader = req.headers.cookie;

    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      throw new AppError("Empleado no encontrado", 404);
    }

    const [userStatus] = await getUsersStatusBatch(
      [employee.user_id],
      cookieHeader,
    );

    res.status(200).json({
      status: "success",
      data: { ...employee.toJSON(), status: userStatus?.status || "unknown" },
    });
  } catch (error) {
    next(error);
  }
}

async function updateEmployee(req, res, next) {
  try {
    const { employeeId } = req.params;
    const { name, last_name_p, last_name_m, phone } = req.body;

    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      throw new AppError("Empleado no encontrado", 404);
    }

    await employee.update({ name, last_name_p, last_name_m, phone });

    res.status(200).json({
      status: "success",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
}

async function updateEmployeeStatus(req, res, next) {
  try {
    const { employeeId } = req.params;
    const { status } = req.body;
    const cookieHeader = req.headers.cookie;

    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      throw new AppError("Empleado no encontrado", 404);
    }

    const updatedUser = await updateAuthUserStatus(
      employee.user_id,
      status,
      cookieHeader,
    );

    res.status(200).json({
      status: "success",
      data: {
        employee_id: employee.id,
        user_id: employee.user_id,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getMyProfile(req, res, next) {
  try {
    const employee = await Employee.findOne({
      where: { user_id: req.user.id },
    });
    if (!employee) {
      throw new AppError("Perfil de empleado no encontrado", 404);
    }

    res.status(200).json({
      status: "success",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createEmployee,
  listEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeStatus,
  getMyProfile,
};
