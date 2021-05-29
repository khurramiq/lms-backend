const LessonComment = require("../models/lessonComment");

exports.createLessonComment = async (req, res) => {
  try {
    // const userId = req.token._id;
    const lessonComment = {
      ...req.body,
    };

    const _lessonComment = await LessonComment.create(lessonComment);
    const totalCount = await LessonComment.getTotalCount(req.body.lesson);

    res
      .status(200)
      .json({ lessonComment: _lessonComment, totalCount: totalCount });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getAllLessonComments = async (req, res) => {
  try {
    const { lessonId, limit } = req.params;
    const lessonComments = await LessonComment.getAll(
      lessonId,
      parseInt(limit)
    );
    const totalCount = await LessonComment.getTotalCount(lessonId);
    if (!lessonComments) lessonComments = [];
    res
      .status(200)
      .json({ lessonComments: lessonComments, totalCount: totalCount });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getLevel2LessonComments = async (req, res) => {
  try {
    const { lessonId, parentId } = req.params;
    const lessonComments = await LessonComment.getAllByParentId(lessonId, parentId);
    const totalCount = await LessonComment.getTotalCount(lessonId);
    if (!lessonComments) lessonComments = [];
    res.status(200).json({ lessonComments: lessonComments, totalCount: totalCount });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};
