const Course = require("../models/course");
const Chapter = require("../models/chapter");
const Lesson = require("../models/lesson");

exports.createCourse = async (req, res) => {
  try {
    // const userId = req.token._id;
    let fImg = "";
    if (typeof req.files.featuredImage !== "undefined") {
      fImg = req.files.featuredImage[0].filename;
    }
    let techArray = [];
    for (let i = 0; i < req.body.teachers.length; i++) {
      techArray.push(JSON.parse(req.body.teachers[i]));
    }
    const course = {
      ...req.body,
      featuredImage: fImg,
      teachers: techArray,
    };

    const _course = await Course.create(course);
    res.status(200).json({ course: _course });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.copyCourse = async (req, res) => {
  try {
    // const userId = req.token._id;
    const course = {
      title: req.body.title,
      description: req.body.description,
      chapters: req.body.chapters,
      featuredImage: req.body.featuredImage,
      status: req.body.status,
      publishedOn: req.body.publishedOn,
      enrollmentStartDate: req.body.enrollmentStartDate,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      visibility: req.body.visibility,
      teachers: req.body.teachers,
      studentsEnrolled: req.body.studentsEnrolled,
    };
    const _course = await Course.create(course);
    res.status(200).json({ course: _course });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.body._id;
    const _course = await Course.updateById(courseId, req.body);
    res.status(200).json({ course: _course });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getCourseByTitle = async (req, res) => {
  try {
    var courseTitle = req.params.title;
    const course = await Course.getByTitle(courseTitle);
    res.status(200).json({ course: course });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const items = await Course.getAll();
    if (!items) items = [];
    res.status(200).json({ courses: items });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { _id } = req.params;
    await Course.deleteItem(_id);
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};
