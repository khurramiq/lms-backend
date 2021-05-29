const express = require("express");
const {
  createQuiz,
  getAllQuizs,
  updateQuiz,
  deleteQuiz,
  getAllQuizesByLessonId
} = require("../controllers/quiz");

const router = express.Router();

router.post(
  "/create",  
  createQuiz
);

router.get(
  "/",  
  getAllQuizs
);
router.get("/lessonId/:lessonId", getAllQuizesByLessonId);

router.post(
  "/update",  
  updateQuiz
);
router.delete("/lessonId/:lessonId/quizId/:quizId", deleteQuiz);

// router.post('/update_recent_question', requireSignin, updateRecentQuestion);
// router.get('/all_survey_questions/:survey', requireSignin, getAllSurveyQuestions);

module.exports = router;
