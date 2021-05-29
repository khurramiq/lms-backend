const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chapterSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    order: { type: Number },
    lessons: [
      { lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" } },
    ],
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    modifiedBy: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

chapterSchema.statics.getById = async (_id) => {
  const chapter = await Chapter.findOne({ _id: mongoose.Types.ObjectId(_id) });
  return chapter;
};
chapterSchema.statics.getChapterByTitle = async (title) => {
  const chapter = await Chapter.findOne({ title: title });
  return chapter;
};

chapterSchema.statics.getAll = async () => {
  const chapters = await Chapter.find({}).sort({ _id: -1 });
  return chapters;
};

chapterSchema.statics.addNewLessonToTheChapter = async (_id, lessonId) => {
  const updatedChapter = await Chapter.findByIdAndUpdate(
    _id,
    { $push: { lessons: { lesson: lessonId } } },
    { new: true }
  );
  return updatedChapter;
};

chapterSchema.statics.removeLessonFromTheChapter = async (_id, lessonId) => {
  const updatedChapter = await Chapter.update(
    { _id: mongoose.Types.ObjectId(_id) },
    { $pull: { lessons:  { lesson: lessonId } } }
  );
  return updatedChapter;
};

chapterSchema.statics.getAllByCourseId = async (courseId) => {
  const list = await Chapter.find({ course: courseId }).sort({ _id: -1 });
  return list;
};

chapterSchema.statics.updateById = async (_id, body) => {
  const updatedChapter = await Chapter.findByIdAndUpdate(_id, body, {
    new: true,
  });
  return updatedChapter;
};

chapterSchema.statics.deleteItem = async (_id) => {
  const del = await Chapter.deleteOne({ _id: mongoose.Types.ObjectId(_id) });
  return del;
};

module.exports = Chapter = mongoose.model(
  "chapters",
  chapterSchema,
  "chapters"
);
