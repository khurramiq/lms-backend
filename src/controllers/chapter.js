const Chapter = require("../models/chapter");
const Course = require("../models/course");

exports.createChapter = async (req, res) => {
  try {
    // const userId = req.token._id;   
    const courseId = req.body.course;
    const chapterTitle = req.body.title;
    const chapter = {
      title: chapterTitle,      
    };

    const _chapter = await Chapter.create(chapter);

    const _course = await Course.addNewChapterToTheCourse(courseId,_chapter._id);
  
    res.status(200).json({ chapter: _chapter });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.updateChapter = async (req, res) => {
  try {
    const chaperId = req.body._id;
    const _chapter = await Chapter.updateById(chaperId, req.body);
    res.status(200).json({ chapter: _chapter });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getAllChapterByCourseId = async (req, res) => {
  try {
    // const createdBy = req.token._id;
    const courseId = req.params.cId;
    const course = await Course.getById(courseId);
    let chaptersArray = [];
    for (let i = 0; i < course.chapters.length; i++){      
      chaptersArray.push(await Chapter.getById(course.chapters[i].chapter));
    }    
    res.status(200).json({ chapters: chaptersArray });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getAllChapterByCourseTitle = async (req, res) => {
  try {
    // const createdBy = req.token._id;
    const courseTitle = req.params.cTitle;
    const course = await Course.getByTitle(courseTitle);
    let chaptersArray = [];
    for (let i = 0; i < course.chapters.length; i++){      
      chaptersArray.push(await Chapter.getById(course.chapters[i].chapter));
    }    
    res.status(200).json({ chapters: chaptersArray });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.get_ChapterByTitle = async (req, res) => {
  try {
    // const createdBy = req.token._id;
    const chapterTitle = req.params.chapterTitle;    
    const _chapter = await Chapter.getChapterByTitle(chapterTitle);    
    res.status(200).json({ chapter: _chapter });
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

exports.getAllChapter = async (req, res) => {
  try {
    const items = await Course.getAll();
    if (!items) items = [];
    res.status(200).json({ courses: items });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.deleteChapter = async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;
    await Course.removeChapterFromTheCourse(courseId, chapterId);
    await Chapter.deleteItem(chapterId);
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};
