const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lessonSchema = new Schema(
  {
    lessonTitle: { type: String, required: true, unique: true },
    lessonContent1: {
      text: { type: Boolean },
      video: { type: Boolean },
      richText: { type: String },
      videoUrl: { type: String },      
    },
    lessonContent2: {
      text: { type: Boolean },
      video: { type: Boolean },
      richText: { type: String },
      videoUrl: { type: String },
    },
    lessonContent3: {
      text: { type: Boolean },
      video: { type: Boolean },
      richText: { type: String },
      videoUrl: { type: String },
    },
    lessonContent4: {
      text: { type: Boolean },
      video: { type: Boolean },
      richText: { type: String },
      videoUrl: { type: String },
    },
    lessonDrip: {
      dripType: { type: String },
      specificDate: { type: Date },
      specificInterval: {
        invervalNumber: { type: Number },
        invervalType: { type: String },
      },
    },
    order: { type: Number },
    quizes: [{ quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" } }],
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    modifiedBy: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

lessonSchema.statics.getById = async (_id) => {
  const lesson = await Lesson.findOne({ _id: mongoose.Types.ObjectId(_id) });
  return lesson;
};

lessonSchema.statics.getAll = async () => {
  const lessons = await Lesson.find({}).sort({ _id: 1 });
  return lessons;
};

lessonSchema.statics.getLessonsByChapter = async (chapter) => {
  const lessons = await Lesson.find({ chapter: chapter }).sort({ _id: 1 });
  return lessons;
};

lessonSchema.statics.getLessonBylessonTitle = async (lessonTitle) => {
  const lesson = await Lesson.findOne({ lessonTitle: lessonTitle });
  return lesson;
};

lessonSchema.statics.addNewQuizToTheLesson = async (_id, quizId) => {
  const updatedLesson = await Lesson.findByIdAndUpdate(
    _id,
    { $push: { quizes: { quiz: quizId } } },
    { new: true }
  );
  return updatedLesson;
};

lessonSchema.statics.removeQuizFromTheLesson = async (_id, quizId) => {
  const updatedLesson = await Lesson.update(
    { _id: mongoose.Types.ObjectId(_id) },
    { $pull: { quizes: { quiz: quizId } } }
  );
  return updatedLesson;
};

lessonSchema.statics.updateById = async (_id, body) => {
  const upt = await Lesson.findByIdAndUpdate(_id, body, { new: true });
  return upt;
};

lessonSchema.statics.deleteItem = async (_id) => {
  const del = await Lesson.deleteOne({ _id: mongoose.Types.ObjectId(_id) });
  return del;
};

module.exports = Lesson = mongoose.model("lessons", lessonSchema, "lessons");
