const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const { getSummary } = require("../controllers/summary.controller");
const { inferCie10 } = require("../controllers/cie10.controller");
const { generateTreatment } = require("../controllers/treatment.controller");

router.use(authenticate);

router.get("/summary/:patientId", getSummary);
router.put("/cie10_code", inferCie10);
router.post("/treatment", generateTreatment);

module.exports = router;
