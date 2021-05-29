const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    chapters: [
      { chapter: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter" } },
    ],
    featuredImage: { type: String },
    status: { type: String, required: true },
    publishedOn: { type: Date },
    enrollmentStartDate: { type: Date },
    startDate: { type: Date },
    endDate: { type: Date },
    visibility: { type: String },
    teachers: [
      {
        teacher: { type: mongoose.Types.ObjectId, ref: "User" },
        name: { type: String },
      },
    ],
    studentsEnrolled: { type: Number },
    updated: { type: Date },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    modifiedBy: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

courseSchema.statics.getById = async (_id) => {
  const course = await Course.findOne({ _id: mongoose.Types.ObjectId(_id) });
  return course;
};

courseSchema.statics.getByTitle = async (title) => {
  const course = await Course.findOne({ title });
  return course;
};

courseSchema.statics.getAll = async () => {
  const list = await Course.find({}).sort({ _id: -1 });
  return list;
};

courseSchema.statics.updateById = async (_id, body) => {
  const upt = await Course.findByIdAndUpdate(_id, body, { new: true });
  return upt;
};

courseSchema.statics.addNewChapterToTheCourse = async (_id, chapterId) => {
  const upt = await Course.updateOne(
    { _id: mongoose.Types.ObjectId(_id) },
    { $push: { chapters: { chapter: chapterId } } }
  );
  return upt;
};

courseSchema.statics.removeChapterFromTheCourse = async (_id, chapterId) => {
  const updatedCourse = await Course.update(
    { _id: mongoose.Types.ObjectId(_id) },
    { $pull: { chapters: { chapter: chapterId } } }
  );
  return updatedCourse;
};

courseSchema.statics.deleteItem = async (_id) => {
  const del = await Course.deleteOne({ _id: mongoose.Types.ObjectId(_id) });
  return del;
};

module.exports = Course = mongoose.model("courses", courseSchema, "courses");
