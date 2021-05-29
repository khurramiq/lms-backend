const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lessonCommentSchema = new Schema(
  {
    lesson: { type: mongoose.Types.ObjectId, ref: "Lesson" },
    comment: { type: String, required: true },
    parentCommentId: { type: mongoose.Types.ObjectId, ref: "LessonComment" },
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

lessonCommentSchema.statics.getById = async (_id) => {
  const chapter = await LessonComment.findOne({
    _id: mongoose.Types.ObjectId(_id),
  });
  return chapter;
};

lessonCommentSchema.statics.getAll = async (lesson, limit) => {
  const comments = await LessonComment.find({ lesson: lesson })
    .sort({ _id: 1 })
    .limit(limit);
  return comments;
};

lessonCommentSchema.statics.getAllByParentId = async (lesson, parentId) => {
  const comments = await LessonComment.find({ lesson: lesson, parentCommentId: parentId }).sort(
    {
      _id: 1,
    }
  );
  return comments;
};

lessonCommentSchema.statics.getTotalCount = async (lesson) => {
  const comments = await LessonComment.find({lesson: lesson});
  return comments.length;
};

lessonCommentSchema.statics.updateById = async (_id, body) => {
  const updatedAd = await LessonComment.findByIdAndUpdate(_id, body, {
    new: true,
  });
  return updatedAd;
};

lessonCommentSchema.statics.deleteItem = async (_id) => {
  const deletedAd = await LessonComment.deleteOne({
    _id: mongoose.Types.ObjectId(_id),
  });
  return deletedAd;
};

module.exports = LessonComment = mongoose.model(
  "lessonComments",
  lessonCommentSchema,
  "lessonComments"
);
