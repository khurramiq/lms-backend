const express = require("express");
// const { requireSignin } = require('../common-middleware');
const {
  createLesson,
  getAllLessons,
  deleteLesson,
  updateLesson,
  getLessonsByChapterTitle,
  getAllLessonsByChapterId,
  getLessonByTitle,
} = require("../controllers/lesson");
const router = express.Router();
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads/videos"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "video/mp4" ||
      file.mimetype == "video/m4a" ||
      file.mimetype == "video/ogg" ||
      file.mimetype == "video/mpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .mp4, .m4a, .ogg and .mpeg format allowed!"));
    }
  },
});

router.post(
  "/create",
  upload.fields([
    {
      name: "video1",
      maxCount: 1,
    },
    {
      name: "video2",
      maxCount: 1,
    },
    {
      name: "video3",
      maxCount: 1,
    },
    {
      name: "video4",
      maxCount: 1,
    },
  ]),
  createLesson
);

router.get("/", getAllLessons);
router.get("/chapterId/:chapterId", getAllLessonsByChapterId);
router.post(
  "/update",
  upload.fields([
    {
      name: "video1",
      maxCount: 1,
    },
    {
      name: "video2",
      maxCount: 1,
    },
    {
      name: "video3",
      maxCount: 1,
    },
    {
      name: "video4",
      maxCount: 1,
    },
  ]),
  updateLesson
);
router.delete("/chapterId/:chapterId/lessonId/:lessonId", deleteLesson);
router.get("/:title", getLessonsByChapterTitle);
router.get("/lessonTitle/:title", getLessonByTitle);

module.exports = router;
