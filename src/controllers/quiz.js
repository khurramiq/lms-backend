const Chapter = require("../models/chapter");
const Lesson = require("../models/lesson");
const Quiz = require("../models/quiz");

exports.createQuiz = async (req, res) => {
  try {
    // const userId = req.token._id; 
    const lessonId = req.body.lesson;
    const quiz = {
      questionType: req.body.questionType,
      questionText: req.body.questionText,
      multipleChoice: req.body.multipleChoice,
      trueFalse: req.body.trueFalse,
      hint: req.body.hint,
      explanation: req.body.explanation,
    };

    const _quiz = await Quiz.create(quiz);
    const _lesson = await Lesson.addNewQuizToTheLesson(lessonId,_quiz._id);

    res.status(200).json({ quiz: _quiz, lesson: _lesson });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getAllQuizesByLessonId = async (req, res) => {
  try {
    // const createdBy = req.token._id;
    const lessonId = req.params.lessonId;
    const lesson = await Lesson.getById(lessonId);
    let quizesArray = [];
    for (let i = 0; i < lesson.quizes.length; i++){      
      quizesArray.push(await Quiz.getById(lesson.quizes[i].quiz));
    }    
    res.status(200).json({ quizes: quizesArray });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const quizId = req.body._id;
    const _quiz = await Quiz.updateById(quizId, req.body);
    res.status(200).json({ quiz: _quiz });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getQuiz = async (req, res) => {
  try {
    var survey = await Survey.getSurveyById(req.params._id);
    if (!survey) return res.json({ error: "survey is not registered" });
    res.status(200).json({ survey: survey });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getAllLessonByChapterId = async (req, res) => {
  try {
    // const createdBy = req.token._id;
    const courseId = req.params.cId;
    const items = await Chapter.getAllByCourseId(courseId);
    if (!items) items = [];
    res.status(200).json({ chapters: items });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getAllLessonByChapterName = async (req, res) => {
  try {
    // const createdBy = req.token._id;
    const courseTitle = req.params.cTitle;
    const course = await Course.getByTitle(courseTitle);
    const items = await Chapter.getAllByCourseId(course._id);
    if (!items) items = [];
    res.status(200).json({ chapters: items });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getAllCoursesByStudent = async (req, res) => {
  try {
    const createdBy = req.token._id;
    const surveyId = req.params.survey;
    const items = await Question.getAllSurveyQuestions(createdBy, surveyId);
    if (!items) items = [];
    res.status(200).json({ questions: items });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getAllQuizs = async (req, res) => {
  try {
    const items = await Quiz.getAll();
    if (!items) items = [];
    res.status(200).json({ quizs: items });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const { lessonId, quizId } = req.params;
    await Lesson.removeQuizFromTheLesson(lessonId, quizId);
    await Quiz.deleteItem(quizId);
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};
