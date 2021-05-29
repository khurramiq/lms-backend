const express = require("express");
const {
  createSecurityQuestion,
  getAllSecurityQuestions,
  updateSecurityQuestion,
  deleteSecurityQuestion,  
} = require("../controllers/securityQuestion");
const router = express.Router();

router.post("/create", createSecurityQuestion);
router.get("/", getAllSecurityQuestions);
router.post("/update", updateSecurityQuestion);
router.delete("/securityQuestionId/:securityQuestionId", deleteSecurityQuestion);

module.exports = router;
