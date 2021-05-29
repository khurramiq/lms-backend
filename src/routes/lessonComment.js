const express = require("express");
const {
  createLessonComment,  
  getAllLessonComments,  
  getLevel2LessonComments
} = require("../controllers/lessonComment");
const router = express.Router();

router.post(
  "/create",  
  createLessonComment
);
router.get("/lessonId/:lessonId/:limit", getAllLessonComments);
router.get("/lessonId/:lessonId/parentId/:parentId", getLevel2LessonComments);

module.exports = router;
