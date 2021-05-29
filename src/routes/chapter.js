const express = require("express");
const {
  createChapter,
  deleteChapter,
  getAllChapterByCourseId,
  getAllChapterByCourseTitle,
  get_ChapterByTitle,
  updateChapter,
} = require("../controllers/chapter");
const router = express.Router();

router.post("/create", createChapter);

router.get("/courseId/:cId", getAllChapterByCourseId);
router.get("/courseTitle/:cTitle", getAllChapterByCourseTitle);
router.get("/chapterTitle/:chapterTitle", get_ChapterByTitle);
router.post("/update", updateChapter);
router.delete("/courseId/:courseId/chapterId/:chapterId", deleteChapter);

module.exports = router;
