async function authenticate(req, res, next) {
  try {
    const cookieHeader = req.headers.cookie;

    if (!cookieHeader) {
      return res
        .status(401)
        .json({ status: "error", message: "No autenticado" });
    }

    const response = await fetch(
      `${process.env.AUTH_SERVICE_URL}/auth/validate-session`,
      {
        headers: { Cookie: cookieHeader },
      },
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        status: "error",
        message: data.message || "No autenticado",
      });
    }

    const { data } = await response.json();

    // Inyectamos los headersde de identidad que los microservicios internos van a confiar
    req.headers["x-user-id"] = data.id;
    req.headers["x-user-role"] = data.role_name;

    next();
  } catch (error) {
    console.error("Error validando sesion contra auth-service:", error.message);
    res.status(503).json({
      status: "error",
      message: "Servicio de autenticacion no disponible",
    });
  }
}

module.exports = authenticate;
