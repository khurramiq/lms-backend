const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create Schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  picture: { type: String },
  accountEnabled: { type: Boolean, default: false },
  profileCompleted: { type: Boolean, default: false },
  profileEdited: { type: Date },
  enrollmentDate: { type: Date },
  lastLearned: { type: Date },
  status: { type: String, default: "Under Review" },
  loginMethod: { type: String },

  activeEventDates: [{ type: Date }],
  activeEventTypes: [{ type: String }],
  actiDeactivator: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  activeEventNotes: [{ type: String }],

  reviewDates: [{ type: Date }],
  reviewEventTypes: [{ type: String }],
  reviewers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  reviewNotes: [{ type: String }],
  acceptTerms: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["teacher", "student", "admin"],
    default: "student",
  },
  coursesEnrolled: [
    {
      course: {
        course: { type: mongoose.Schema.ObjectId, ref: "Course" },
        courseTitle: { type: String },
        courseProgress: { type: Number, default: 0 },
        updateAccess: { type: Boolean, default: false },
        startedLearning: { type: Date },
        courseCompletedOn: { type: Date },
        lastLessonCompleted: { type: mongoose.Schema.ObjectId, ref: "Lesson" },
        lessonCompletedOn: { type: Date },
        lastQuizCompleted: { type: mongoose.Schema.ObjectId, ref: "Quiz" },
        lastLearned: { type: Date },
      },
    },
  ],
  coursesTeaching: [
    { course: { type: mongoose.Schema.ObjectId, ref: "Course" } },
  ],
  experience: {
    learnedInPast: { type: String, default: "" },
    learnInGroups: { type: String, default: "" },
  },
  securityQuestions: [
    {
      question: { type: String },
      answer: { type: String },
    },
  ],
  passwordResetAttempts: { type: Number, default: 10 },
  cannotLoginBefore: { type: Date },
  canResetPassword: { type: Boolean, default: true },
  passwordReset: { type: Date },
  created: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
  updated: { type: Date },
});

//Store Encrypted Password When Creating Account
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password"))
    user.password = await bcrypt.hash(user.password, 10);
  next();
});

//Generate JWT Token
UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
  return token;
};

//Find using email and check if the password matched
UserSchema.statics.findUserByCredentials = async (email, password) => {
  const user = await User.findOne({ email }, { _id: 1, password: 1 });
  if (!user) throw new Error("Invalid login credentials");
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) throw new Error("Invalid login credentials");
  return user;
};

UserSchema.statics.findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

UserSchema.statics.findAllStudents = async () => {
  const students = await User.find({ role: "student" });
  return students;
};

UserSchema.statics.getUserById = async (_id) => {
  const user = await User.findOne({ _id: mongoose.Types.ObjectId(_id) });
  return user;
};

UserSchema.statics.getAllUser = async (_id) => {
  const user = await User.find({});
  return user;
};

UserSchema.statics.getAllTeachers = async () => {
  const Teachers = await User.find({role: 'teacher'});
  return Teachers;
};

UserSchema.statics.deleteUser = async (_id) => {
  const del = await User.deleteOne({ _id: mongoose.Types.ObjectId(_id) });
  return del;
};

UserSchema.statics.updateActive = async (_id, val) => {
  const upt = await User.updateOne(
    { _id: mongoose.Types.ObjectId(_id) },
    { $set: { isActive: val } }
  );
  return upt;
};

UserSchema.statics.updatePasswordResetAttempts = async (_id, val) => {
  const upt = await User.updateOne(
    { _id: mongoose.Types.ObjectId(_id) },
    { $set: { passwordResetAttempts: val } }
  );
  return upt;
};

UserSchema.statics.updateCanResetPassword = async (_id, val) => {
  var a = new Date();
  a.setDate(a.getDate() + 1);
  const upt = await User.updateOne(
    { _id: mongoose.Types.ObjectId(_id) },
    {
      $set: {
        canResetPassword: val,
        cannotLoginBefore: a,
        passwordResetAttempts: 10,
      },
    }
  );
  return upt;
};
UserSchema.statics.updatePassword = async (_id, val) => {
  let hashPass = await bcrypt.hash(val, 10);
  const upt = await User.updateOne(
    { _id: mongoose.Types.ObjectId(_id) },
    { $set: { password: hashPass } }
  );
  return upt;
};

UserSchema.statics.updateExperience = async (_id, val) => {
  const upt = await User.updateOne(
    { _id: mongoose.Types.ObjectId(_id) },
    { $set: { experience: val } }
  );
  return upt;
};

UserSchema.statics.enrollCourse = async (_id, courseId, courseTitle) => {
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      $push: { coursesEnrolled: { course: { course: courseId, courseTitle } } },
    },
    { new: true }
  );
  return updatedUser;
};

UserSchema.statics.updateAcceptTerms = async (_id, val) => {
  const upt = await User.updateOne(
    { _id: mongoose.Types.ObjectId(_id) },
    { $set: { acceptTerms: val, profileCompleted: true } }
  );
  return upt;
};

UserSchema.statics.updateSecurityQuestions = async (_id, val) => {
  const upt = await User.updateOne(
    { _id: mongoose.Types.ObjectId(_id) },
    { $set: { securityQuestions: val } }
  );
  return upt;
};

UserSchema.statics.updateApproved = async (_id) => {
  const upt = await User.updateOne(
    { _id: mongoose.Types.ObjectId(_id) },
    { $set: { isApproved: true } }
  );
  return upt;
};

UserSchema.statics.updateProfile = async (
  _id,
  email,
  password,
  name,
  alias,
  role
) => {
  const pass = await bcrypt.hash(password, 10);

  const upt = await User.updateOne(
    { _id: mongoose.Types.ObjectId(_id) },
    {
      $set: {
        email,
        name,
        alias,
        role,
        password: pass,
      },
    }
  );
  return upt;
};

module.exports = User = mongoose.model("users", UserSchema, "users");
