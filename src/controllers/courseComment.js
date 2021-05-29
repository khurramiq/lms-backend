const CourseComment = require("../models/courseComment");

exports.createCourseComment = async (req, res) => {
  try {
    // const userId = req.token._id;
    const courseComment = {
      ...req.body,
    };

    const _courseComment = await CourseComment.create(courseComment);
    const totalCount = await CourseComment.getTotalCount(req.body.course);

    res
      .status(200)
      .json({ courseComment: _courseComment, totalCount: totalCount });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getAllCourseComments = async (req, res) => {
  try {
    const { courseId, limit } = req.params;
    const courseComments = await CourseComment.getAll(
      courseId,
      parseInt(limit)
    );
    const totalCount = await CourseComment.getTotalCount(courseId);
    if (!courseComments) courseComments = [];
    res
      .status(200)
      .json({ courseComments: courseComments, totalCount: totalCount });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getLevel2CourseComments = async (req, res) => {
  try {
    const { courseId, parentId } = req.params;
    const courseComments = await CourseComment.getAllByParentId(courseId, parentId);
    const totalCount = await CourseComment.getTotalCount(courseId);
    if (!courseComments) courseComments = [];
    res.status(200).json({ courseComments: courseComments, totalCount: totalCount });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};
