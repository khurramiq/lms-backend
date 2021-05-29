const express = require("express");
const {
  createCourseComment,  
  getAllCourseComments,  
  getLevel2CourseComments
} = require("../controllers/courseComment");
const router = express.Router();

router.post(
  "/create",  
  createCourseComment
);
router.get("/courseId/:courseId/:limit", getAllCourseComments);
router.get("/courseId/:courseId/parentId/:parentId", getLevel2CourseComments);

module.exports = router;
