const User = require("../models/user");
const Course = require("../models/course");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");

const client = new OAuth2Client(
  "331445506438-ebeesa88re30sm8h3sbn8mn4mrnm8m3t.apps.googleusercontent.com"
);

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userData = { name, email, password, loginMethod: "manual" };
    var user = await User.findUserByEmail(email);
    if (!user) {
      user = await User.create(userData);
      var token = await user.generateAuthToken();
      res.status(200).json({ token: token });
    } else res.json({ error: "User with this email is already registered." });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    var user = await User.findUserByCredentials(email, password);
    if (!user) return res.json({ error: "Email or password is incorrect" });
    var token = await user.generateAuthToken();
    res.status(200).json({ token: token });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.googlelogin = async (req, res) => {
  const { tokenId } = req.body;
  console.log();
  try {
    client
      .verifyIdToken({
        idToken: tokenId,
        audience:
          "331445506438-ebeesa88re30sm8h3sbn8mn4mrnm8m3t.apps.googleusercontent.com",
      })
      .then(async (response) => {
        const { email_verified, name, email } = response.payload;
        if (email_verified) {
          var user = await User.findUserByEmail(email);
          if (user) {
            var token = await user.generateAuthToken();
            res.status(200).json({ token: token });
          } else {
            let userData;
            let password = email + process.env.JWT_SECRET;
            userData = {
              name,
              email,
              password,
              loginMethod: "google",
            };
            user = await User.create(userData);
            var token = await user.generateAuthToken();
            res.status(200).json({ token: token });
          }
        }
      });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.facebooklogin = async (req, res) => {
  const { accessToken, userID } = req.body;
  try {
    let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userID}/?fields=id, name, email, picture&access_token=${accessToken}`;
    fetch(urlGraphFacebook, {
      method: "GET",
    })
      .then((response) => response.json())
      .then(async (response) => {
        const { email, name } = response;
        var user = await User.findUserByEmail(email);
        if (user) {
          var token = await user.generateAuthToken();
          res.status(200).json({ token: token });
        } else {
          let userData;
          let password = email + process.env.JWT_SECRET;
          userData = {
            name,
            email,
            password,
            loginMethod: "facebook",
          };
          user = await User.create(userData);
          var token = await user.generateAuthToken();
          res.status(200).json({ token: token });
        }
      });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.profile = async (req, res) => {
  try {
    var user = await User.getUserById(req.token._id);
    if (!user) return res.json({ error: "User is not registered" });
    res.status(200).json({ user: user });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

const isTwentyFourHoursEnd = (date) => {
  var cannotloginbefore = new Date(date);
  var currentDate = new Date();

  return cannotloginbefore < currentDate;
};

exports.getUserQuestions = async (req, res) => {
  try {
    let userQuestions = [];
    var email = req.params.email;
    var user = await User.findUserByEmail(email);
    if (user) {
      if (user.canResetPassword) {
        for (let i = 0; i < 3; i++) {
          userQuestions.push({ question: user.securityQuestions[i].question });
        }
        res.status(200).json({ user_security_questions: userQuestions });
      } else {
        if (isTwentyFourHoursEnd(user.cannotLoginBefore)) {
          await User.updateCanResetPassword(user._id, true);
          for (let i = 0; i < 3; i++) {
            userQuestions.push({
              question: user.securityQuestions[i].question,
            });
          }
          res.status(200).json({ user_security_questions: userQuestions });
        } else {
          res.status(200).json({
            error:
              "You cann't reset your password before 24 hours. Please try after 24 hours",
          });
        }
      }
    } else {
      res.status(200).json({
        error: "User not found with the given email. Please try again",
      });
    }
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.matchUserAnswers = async (req, res) => {
  try {
    var { email, answers } = req.body;
    var user = await User.findUserByEmail(email);
    if (user) {
      if (user.canResetPassword) {
        let matchedAnswersCount = 0;
        for (let i = 0; i < 3; i++) {
          if (
            user.securityQuestions[i].answer.toLowerCase() ===
            answers[i].answer.toLowerCase()
          ) {
            matchedAnswersCount++;
          }
        }
        if (matchedAnswersCount === 3) {
          await User.updatePasswordResetAttempts(user._id, 10);
          res.status(200).json({ matched: true });
        } else {
          if (user.passwordResetAttempts === 0) {
            await User.updateCanResetPassword(user._id, false);
            res.status(200).json({
              canReset: false,
              error:
                "You cann't reset your password before 24 hours. Please try after 24 hours",
            });
          } else {
            await User.updatePasswordResetAttempts(
              user._id,
              user.passwordResetAttempts - 1
            );
            res.status(200).json({
              canReset: true,
              error: `sorry, all answers are not matched, check if any of the answer is not correct. And you only have ${
                user.passwordResetAttempts - 1
              }/10 tries remaining.`,
            });
          }
        }
      } else {
        res.status(200).json({
          canReset: user.canResetPassword,
          error:
            "You cann't reset your password before 24 hours. Please try after 24 hours",
        });
      }
    } else {
      res.status(200).json({
        error: "User not found with the given email. Please try again",
      });
    }
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.enrollToCourse = async (req, res) => {
  try {
    var userId = req.token._id;
    var courseId = req.body.course;
    var course = await Course.getById(courseId);
    var user = await User.enrollCourse(userId, courseId, course.title);
    res.status(200).json({
      user: user,
      message: `You are successfully enrolled to ${course.title}. You can go to the lessons and start learning`,
    });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};
exports.update_Experience = async (req, res) => {
  try {
    var userId = req.token._id;
    var experience = req.body.experience;
    var user = await User.updateExperience(userId, experience);
    res.status(200).json({ user: user });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.fetchAllStudents = async (req, res) => {
  try {
    let userId = req.token._id;
    let user = await User.getUserById(userId);
    let allStudents = await User.getAllUser();
    if (user.role === "admin") {
      res.status(200).json({ students: allStudents });
    } else if (user.role === "teacher") {
      let allCourses = await Course.getAll();
      let currentTeachersCourses = [];
      for (let i = 0; i < allCourses.length; i++) {
        for (let j = 0; j < allCourses[i].teachers.length; j++) {
          if (allCourses[i].teachers[j].teacher == userId) {
            currentTeachersCourses.push(allCourses[i]);
          }
        }
      }
      let teachersStudents = [];
      for (let i = 0; i < allStudents.length; i++) {
        for (let j = 0; j < allStudents[i].coursesEnrolled.length; j++) {
          for (let k = 0; k < currentTeachersCourses.length; k++) {
            if (
              allStudents[i].coursesEnrolled[j].course.course.toString() ==
              currentTeachersCourses[k]._id.toString()
            ) {
              teachersStudents.push(allStudents[i]);
            }
          }
        }
      }
      for (let i = 0; i < teachersStudents.length; i++) {
        for (let j = 0; j < teachersStudents[i].coursesEnrolled.length; j++) {
          let filledcoursesEnrolled = [];
          for (let k = 0; k < currentTeachersCourses.length; k++) {
            if (
              teachersStudents[i].coursesEnrolled[j].course.course.toString() ==
              currentTeachersCourses[k]._id.toString()
            ) {
              filledcoursesEnrolled.push(
                teachersStudents[i].coursesEnrolled[j]
              );
            }
          }
          teachersStudents[i].coursesEnrolled = filledcoursesEnrolled;
        }
      }      
      res.status(200).json({ students: teachersStudents });
    } else {
      res.status(200).json({ error: "access denied" });
    }
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    let userId = req.token._id;
    let user = await User.getUserById(userId);
    if (user.role === "admin") {
      let teachers = await User.getAllTeachers();
      res.status(200).json({ teachers: teachers });
    } else {
      res.status(200).json({ error: "admin access denied" });
    }
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.update_Password = async (req, res) => {
  try {
    var { email, password } = req.body;
    var user = await User.findUserByEmail(email);
    var _user = await User.updatePassword(user._id, password);
    res.status(200).json({ passwordChanged: true });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.update_AcceptTerms = async (req, res) => {
  try {
    var userId = req.token._id;
    var acceptTerms = req.body.acceptTerms;
    var user = await User.updateAcceptTerms(userId, acceptTerms);
    res.status(200).json({ user: user });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.update_SecurityQuestions = async (req, res) => {
  try {
    var userId = req.token._id;
    var securityQuestions = req.body.securityQuestions;
    var user = await User.updateSecurityQuestions(userId, securityQuestions);
    res.status(200).json({ user: user });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.details = async (req, res) => {
  try {
    var user = await User.getUserById(req.params._id);
    if (!user) return res.json({ error: "User is not registered" });
    res.status(200).json({ user: user });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};
