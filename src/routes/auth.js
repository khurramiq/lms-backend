const express = require("express");
const {
  signup,
  signin,
  profile,
  details,
  googlelogin,
  facebooklogin,
  update_Experience,
  update_SecurityQuestions,
  update_AcceptTerms,
  getUserQuestions,
  matchUserAnswers,
  update_Password,
  fetchAllStudents,
  enrollToCourse,
  getTeachers
} = require("../controllers/auth");
const {
  validateSignupRequest,
  isRequestValidated,
} = require("../validators/auth");
const { requireSignin, adminMiddleware } = require("../middlewares");
const router = express.Router();

router.post("/signup", validateSignupRequest, isRequestValidated, signup);
router.post("/signin", signin);
router.post("/update_experience", requireSignin, update_Experience);
router.post("/update_AcceptTerms", requireSignin, update_AcceptTerms);
router.post(
  "/update_securityQuestions",
  requireSignin,  
  update_SecurityQuestions
);
router.post("/googlelogin", googlelogin);
router.post("/facebooklogin", facebooklogin);
router.post("/match_user_answers_to_reset_password", matchUserAnswers);
router.post("/enroll_course", requireSignin, enrollToCourse);
router.post("/change_password", update_Password);
router.get("/profile", requireSignin, profile);
router.get("/details/:_id", requireSignin, details);
router.get("/allStudents", requireSignin, fetchAllStudents);
router.get("/teachers", requireSignin, getTeachers);
router.get("/user_security_questions/user_email/:email", getUserQuestions);

// router.post("/profile", requireSignin, (req, res) => {
//     res.status(200).json({ user: 'profile' });
// });

module.exports = router;
