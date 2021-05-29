const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseCommentSchema = new Schema(
  {
    course: { type: mongoose.Types.ObjectId, ref: "Course" },
    comment: { type: String, required: true },
    parentCommentId: { type: mongoose.Types.ObjectId, ref: "CourseComment" },
    likes: { type: Number },
    disLikes: { type: Number },
    status: {
      type: String,
      enum: ["underReview", "Approved", "Approved"],
      default: "underReview",
    },
    authorId: { type: mongoose.Types.ObjectId, ref: "User" },
    approvedBy: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

courseCommentSchema.statics.getById = async (_id) => {
  const chapter = await CourseComment.findOne({
    _id: mongoose.Types.ObjectId(_id),
  });
  return chapter;
};

courseCommentSchema.statics.getAll = async (course, limit) => {
  const comments = await CourseComment.find({ course: course })
    .sort({ _id: 1 })
    .limit(limit);
  return comments;
};

courseCommentSchema.statics.getAllByParentId = async (course, parentId) => {
  const comments = await CourseComment.find({ course: course, parentCommentId: parentId }).sort(
    {
      _id: 1,
    }
  );
  return comments;
};

courseCommentSchema.statics.getTotalCount = async (course) => {
  const comments = await CourseComment.find({course: course});
  return comments.length;
};

courseCommentSchema.statics.updateById = async (_id, body) => {
  const updatedAd = await CourseComment.findByIdAndUpdate(_id, body, {
    new: true,
  });
  return updatedAd;
};

courseCommentSchema.statics.deleteItem = async (_id) => {
  const deletedAd = await CourseComment.deleteOne({
    _id: mongoose.Types.ObjectId(_id),
  });
  return deletedAd;
};

module.exports = CourseComment = mongoose.model(
  "courseComments",
  courseCommentSchema,
  "courseComments"
);
