const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const securityQuestionSchema = new Schema(
  {
    question: { type: String, required: true },    
  },
  { timestamps: true }
);

securityQuestionSchema.statics.getById = async (_id) => {
  const securityQuestion = await SecurityQuestion.findOne({ _id: mongoose.Types.ObjectId(_id) });
  return securityQuestion;
};


securityQuestionSchema.statics.getAll = async () => {
  const securityQuestions = await SecurityQuestion.find({}).sort({ _id: 1 });
  return securityQuestions;
};

securityQuestionSchema.statics.updateById = async (_id, body) => {
  const updatedsecurityQuestion = await SecurityQuestion.findByIdAndUpdate(_id, body, {
    new: true,
  });
  return updatedsecurityQuestion;
};

securityQuestionSchema.statics.deleteItem = async (_id) => {
  const del = await SecurityQuestion.deleteOne({ _id: mongoose.Types.ObjectId(_id) });
  return del;
};

module.exports = SecurityQuestion = mongoose.model(
  "securityQuestions",
  securityQuestionSchema,
  "securityQuestions"
);
