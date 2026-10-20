require("dotenv").config();
const bcrypt = require("bcrypt");
const sequelize = require("../src/config/db");
const { User, Role } = require("../src/models");

const SALT_ROUNDS = 10;

async function main() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Define ADMIN_EMAIL y ADMIN_PASSWORD en el .env");
    process.exitCode = 1;
    return;
  }

  if (ADMIN_PASSWORD.length < 8) {
    console.error("ADMIN_PASSWORD debe tener al menos 8 caracteres");
    process.exitCode = 1;
    return;
  }

  const role = await Role.findOne({ where: { name: "administrador" } });
  if (!role) {
    console.error(
      'El rol "administrador" no existe. Revisa db/init/01_auth_service.sql',
    );
    process.exitCode = 1;
    return;
  }

  const existing = await User.findOne({ where: { email: ADMIN_EMAIL } });
  if (existing) {
    console.log(`El usuario ${ADMIN_EMAIL} ya existe, no se hace nada.`);
    return;
  }

  const password_hash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
  await User.create({ email: ADMIN_EMAIL, password_hash, role_id: role.id });

  console.log(`Administrador inicial creado: ${ADMIN_EMAIL}`);
}

main()
  .catch((error) => {
    console.error("Error en el seed:", error);
    if (error.parent) {
      console.error("Causa:", error.parent.code, error.parent.message);
    }
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
