const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Role } = require("../models");
const { Session } = require("../models");
const generateToken = require("../utils/generateToken");
const getExpirationDate = require("../utils/getExpirationDate");
const AppError = require("../utils/AppError");

// Número de rondas para el hashing de la contraseña, suficiente seguro sin volverse lento.
const SALT_ROUNDS = 10;

async function createUser(req, res, next) {
  try {
    const { email, password, role_id } = req.body;

    if (!email || !password || !role_id) {
      throw new AppError("email, password y role_id son requeridos", 400); // Bad Request
    }

    // Expresión regular para validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError("El formato del email no es valido", 400);
    }

    if (password.length < 8) {
      throw new AppError("La contraseña debe tener al menos 8 caracteres", 400);
    }

    const role = await Role.findByPk(role_id);
    if (!role) {
      throw new AppError("El role_id proporcionado no existe", 400);
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError("Ya existe un usuario con ese email", 409); // El recurso ya existe
    }

    // Hashear la contraseña
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Crear el usuario
    const newUser = await User.create({
      email,
      password_hash,
      role_id,
    });

    // No devolvemos password_hash en la respuesta
    const { password_hash: _, ...userResponse } = newUser.toJSON();

    res.status(201).json({
      status: "success",
      data: userResponse,
    });
  } catch (error) {
    next(error); // Pasar el error al middleware de manejo de errores
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("email y password son requeridos", 400);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError("Credenciales inválidas", 401); // Unauthorized
    }

    if (user.status !== "active") {
      throw new AppError("La cuenta no está activa", 403); // Forbidden, autenticado pero sin autorización para acceder
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      throw new AppError("Credenciales inválidas", 401);
    }

    // Generar JWT
    const token = generateToken({
      id: user.id,
      role_id: user.role_id,
    });

    // Registramos la sesion
    const expiresAt = getExpirationDate(process.env.JWT_EXPIRES_IN);
    await Session.create({
      user_id: user.id,
      token,
      expires_at: expiresAt,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true", // Solo enviar cookie a través de HTTPS si está en producción
      sameSite: process.env.COOKIE_SAMESITE, // Configuración de SameSite
      domain: process.env.COOKIE_DOMAIN, // Dominio de la cookie, si es necesario
      expires: expiresAt,
    });

    res.status(200).json({
      status: "success",
      data: {
        id: user.id,
        email: user.email,
        role_id: user.role_id,
        expires_at: expiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    const token = req.cookies.token;

    if (token) {
      // Elimina la sesi[on de la base de datos (invalidación real)
      await Session.destroy({ where: { token } });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: process.env.COOKIE_SAMESITE,
      domain: process.env.COOKIE_DOMAIN,
    });

    res.status(200).json({
      status: "success",
      message: "Sesión cerrada correctamente",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { createUser, login, logout };
