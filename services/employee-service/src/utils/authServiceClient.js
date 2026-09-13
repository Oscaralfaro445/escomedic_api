const AppError = require("./AppError");

async function createAuthUser({ email, password, role_id }, cookieHeader) {
  const response = await fetch(`${process.env.AUTH_SERVICE_URL}/auth/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
    body: JSON.stringify({ email, password, role_id }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new AppError(
      data.message || "Error al crear el usuario en auth-service",
      response.status,
    );
  }

  return data.data; // {id, role_id, email, status, ...}
}

async function updateAuthUserStatus(userId, status, cookieHeader) {
  const response = await fetch(
    `${process.env.AUTH_SERVICE_URL}/auth/user/${userId}/status`,
    {
      method: "PATCH",
      headers: {
        "Conte  nt-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({ status }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new AppError(
      data.message || "Error al actualizar el status en auth-service",
      response.status,
    );
  }

  return data.data;
}

async function getUsersStatusBatch(userIds, cookieHeader) {
  const response = await fetch(
    `${process.env.AUTH_SERVICE_URL}/auth/users/status-batch`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({ ids: userIds }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new AppError(
      data.message || "Error al consultar status en auth-service",
      response.status,
    );
  }

  return data.data; // [{id, status}, ...]
}

async function deleteAuthUser(userId, cookieHeader) {
  const response = await fetch(
    `${process.env.AUTH_SERVICE_URL}/auth/user/${userId}`,
    {
      method: "DELETE",
      headers: {
        Cookie: cookieHeader,
      },
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new AppError(
      data.message || "Error al compensar (eliminar ususario auth-service)",
      response.status,
    );
  }
}

module.exports = {
  createAuthUser,
  deleteAuthUser,
  updateAuthUserStatus,
  getUsersStatusBatch,
};
