const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizSchema = new Schema(
  {
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
    questionType: { type: String, required: true },
    questionText: { type: String, required: true },
    multipleChoice: [
      {
        choice: { type: String },
        correctAnswer: { type: Boolean },
      },
    ],    
    trueFalse: {
      _true: { type: Boolean },
      _false: { type: Boolean },
    },
    hint: { type: String },
    explanation: { type: String },
    order: { type: Number },
    attemptedAnswers: [
      {
        answeredBy: { type: mongoose.Types.ObjectId, ref: "User" },
        answer: {
          openEndedAnswer: { type: String }, 
          trueFalseAnswer: { type: Boolean },
          multipleChoiceAnswer: [
            {
              choice: { type: String },
              answer: { type: Boolean },
            },
          ],
        }
      }
    ],
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    modifiedBy: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

quizSchema.statics.getById = async (_id) => {
  const navbar = await Quiz.findOne({ _id: mongoose.Types.ObjectId(_id) });
  return navbar;
};

quizSchema.statics.getAll = async () => {
  const list = await Quiz.find({}).sort({ _id: 1 });
  return list;
};

quizSchema.statics.updateById = async (_id, body) => {
  const upt = await Quiz.findByIdAndUpdate(_id, body, { new: true });
  return upt;
};

quizSchema.statics.deleteItem = async (_id) => {
  const del = await Quiz.deleteOne({ _id: mongoose.Types.ObjectId(_id) });
  return del;
};

module.exports = Quiz = mongoose.model("quizs", quizSchema, "quizs");
