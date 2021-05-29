const express = require("express");
// const { requireSignin } = require('../common-middleware');
const {
  createCourse,
  copyCourse,
  getAllCourses,
  getCourseByTitle,
  updateCourse,
  deleteCourse,  
} = require("../controllers/course");
const {
  validateCourseRequest,
  isRequestValidated,
} = require("../validators/course");
const router = express.Router();

const multer = require("multer");
const shortid = require("shortid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

router.post(
  "/create",
  //   validateCourseRequest,
  //   isRequestValidated,
  upload.fields([
    {
      name: "featuredImage",
      maxCount: 1,
    },    
  ]),
  createCourse
);

router.post(
  "/copy",  
  copyCourse
);

router.get(
  "/",
  //   validateCourseRequest,
  //   isRequestValidated,
  getAllCourses
);

router.post(
  "/update",
  // validateQuestionRequest,
  // isRequestValidated,
  // requireSignin,
  updateCourse
);
router.get("/:title", getCourseByTitle);
router.delete("/:_id", deleteCourse);

// router.get('/recent_question/:survey', requireSignin, getRecentQuestion);
// router.post('/update_recent_question', requireSignin, updateRecentQuestion);
// router.get('/all_survey_questions/:survey', requireSignin, getAllSurveyQuestions);

module.exports = router;
