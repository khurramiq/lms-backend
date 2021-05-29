const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    comment: { type: String, required: true },
    parentCommentId: { type: mongoose.Types.ObjectId, ref: "Comment" },
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

commentSchema.statics.getById = async (_id) => {
  const chapter = await Comment.findOne({ _id: mongoose.Types.ObjectId(_id) });
  return chapter;
};

commentSchema.statics.getAll = async (limit) => {
  const comments = await Comment.find().sort({ _id: 1 }).limit(limit);
  return comments;
};

commentSchema.statics.getAllByParentId = async (parentId) => {
  const comments = await Comment.find({ parentCommentId: parentId }).sort({
    _id: 1,
  });
  return comments;
};

commentSchema.statics.getTotalCount = async () => {
  const comments = await Comment.find({});
  return comments.length;
};

commentSchema.statics.updateById = async (_id, body) => {
  const updatedAd = await Comment.findByIdAndUpdate(_id, body, {
    new: true,
  });
  return updatedAd;
};

commentSchema.statics.deleteItem = async (_id) => {
  const deletedAd = await Comment.deleteOne({
    _id: mongoose.Types.ObjectId(_id),
  });
  return deletedAd;
};

module.exports = Comment = mongoose.model(
  "comments",
  commentSchema,
  "comments"
);
