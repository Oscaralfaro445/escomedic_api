const sequelize = require("../config/db");
const GpcIndex = require("./gpcIndex.model");
const GpcConditionCode = require("./gpcConditionCode.model");
const GpcCachedContent = require("./gpcCachedContent.model");
const AiRequestLog = require("./aiRequestLog.model");
const AiResponseLog = require("./aiResponseLog.model");

GpcIndex.hasMany(GpcConditionCode, {
  foreignKey: "gpc_id",
  onDelete: "CASCADE",
});
GpcConditionCode.belongsTo(GpcIndex, { foreignKey: "gpc_id" });

GpcIndex.hasMany(GpcCachedContent, {
  foreignKey: "gpc_id",
  onDelete: "CASCADE",
});
GpcCachedContent.belongsTo(GpcIndex, { foreignKey: "gpc_id" });

GpcIndex.hasMany(AiRequestLog, { foreignKey: "gpc_id" });
AiRequestLog.belongsTo(GpcIndex, { foreignKey: "gpc_id" });

AiRequestLog.hasOne(AiResponseLog, {
  foreignKey: "request_id",
  onDelete: "CASCADE",
});
AiResponseLog.belongsTo(AiRequestLog, { foreignKey: "request_id" });

module.exports = {
  sequelize,
  GpcIndex,
  GpcConditionCode,
  GpcCachedContent,
  AiRequestLog,
  AiResponseLog,
};
