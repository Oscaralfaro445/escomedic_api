const { createProxyMiddleware } = require("http-proxy-middleware");
const authenticate = require("../middlewares/authenticate");

function setupProxyRoutes(app) {
  // Rutas publicas de auth-service (login no requere autenticacion previa)
  app.use(
    "/auth/login",
    createProxyMiddleware({
      target: `${process.env.AUTH_SERVICE_URL}/auth/login`,
      changeOrigin: true, // Le dice al proxy que rescriba el header HOSTde la peticion saliente para que coincida con el del servidor de destino
    }),
  );

  app.use(
    "/auth/logout",
    createProxyMiddleware({
      target: `${process.env.AUTH_SERVICE_URL}/auth/logout`,
      changeOrigin: true,
    }),
  );

  // Resto de rutas de auth-service que si requieren autenticacion previa via Gateway
  app.use(
    "/auth",
    authenticate,
    createProxyMiddleware({
      target: `${process.env.AUTH_SERVICE_URL}/auth`,
      changeOrigin: true,
    }),
  );

  // employee-service: todo requiere autenticacion
  app.use(
    "/employees",
    authenticate,
    createProxyMiddleware({
      target: `${process.env.EMPLOYEE_SERVICE_URL}/employees`,
      changeOrigin: true,
    }),
  );

  app.use(
    "/patients",
    authenticate,
    createProxyMiddleware({
      target: `${process.env.PATIENT_SERVICE_URL}/patients`,
      changeOrigin: true,
    }),
  );
}

// patient-service: todo require autenticacion

module.exports = setupProxyRoutes;
