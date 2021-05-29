const Chapter = require("../models/chapter");
const Lesson = require("../models/lesson");
const Course = require("../models/course");

exports.createLesson = async (req, res) => {
  try {
    // const userId = req.token._id;   
    let fv1 = "";
    let fv2 = "";
    let fv3 = "";
    let fv4 = "";
    if (typeof req.files.video1 !== "undefined") {
      fv1 = req.files.video1[0].filename;
    }
    if (typeof req.files.video2 !== "undefined") {
      fv2 = req.files.video2[0].filename;
    }
    if (typeof req.files.video3 !== "undefined") {
      fv3 = req.files.video3[0].filename;
    }
    if (typeof req.files.video4 !== "undefined") {
      fv4 = req.files.video4[0].filename;
    }

    let lessOn = JSON.parse(req.body.lesson);    
    const chapterId = lessOn.chapter;
    const lesson = {
      lessonTitle: lessOn.lessonTitle,
      lessonContent1: { ...lessOn.lessonContent1, videoUrl: fv1 },      
      lessonContent2: { ...lessOn.lessonContent2, videoUrl: fv2 },      
      lessonContent3: { ...lessOn.lessonContent3, videoUrl: fv3 },      
      lessonContent4: { ...lessOn.lessonContent4, videoUrl: fv4 },      
      lessonDrip: lessOn.lessonDrip,
    };

    const _lesson = await Lesson.create(lesson);

    const _chapter = await Chapter.addNewLessonToTheChapter(chapterId,_lesson._id);

    res.status(200).json({ lesson: _lesson, chapter: _chapter });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    let lessOn = JSON.parse(req.body.lesson);  
    let fv1 = lessOn.lessonContent1.videoUrl;
    let fv2 = lessOn.lessonContent2.videoUrl;
    let fv3 = lessOn.lessonContent3.videoUrl;
    let fv4 = lessOn.lessonContent4.videoUrl;
    if (typeof req.files.video1 !== "undefined") {      
      fv1 = req.files.video1[0].filename;
    }
    if (typeof req.files.video2 !== "undefined") {
      fv2 = req.files.video2[0].filename;
    }
    if (typeof req.files.video3 !== "undefined") {
      fv3 = req.files.video3[0].filename;
    }
    if (typeof req.files.video4 !== "undefined") {
      fv4 = req.files.video4[0].filename;
    }      
    const lessonId = lessOn._id;
    const lesson = {
      _id: lessonId,
      lessonTitle: lessOn.lessonTitle,
      lessonContent1: { ...lessOn.lessonContent1, videoUrl: fv1 },      
      lessonContent2: { ...lessOn.lessonContent2, videoUrl: fv2 },      
      lessonContent3: { ...lessOn.lessonContent3, videoUrl: fv3 },      
      lessonContent4: { ...lessOn.lessonContent4, videoUrl: fv4 },      
      lessonDrip: lessOn.lessonDrip,
    };    
    const _lesson = await Lesson.updateById(lessonId, lesson);
    res.status(200).json({ lesson: _lesson });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getAllLessonsByChapterId = async (req, res) => {
  try {
    // const createdBy = req.token._id;
    const chapterId = req.params.chapterId;
    const chapter = await Chapter.getById(chapterId);
    let lessonsArray = [];
    for (let i = 0; i < chapter.lessons.length; i++){      
      lessonsArray.push(await Lesson.getById(chapter.lessons[i].lesson));
    }    
    res.status(200).json({ lessons: lessonsArray });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getLessonsByChapterTitle = async (req, res) => {
  try {    
    const chapterTitle = req.params.title;
    const chapter = await Chapter.getChapterByTitle(chapterTitle);
    const lessons = await Lesson.getLessonsByChapter(chapter._id);

    if (!lessons) lessons = [];
    res.status(200).json({ lessons: lessons });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getLessonByTitle = async (req, res) => {
  try {    
    const lessonTitle = req.params.title;    
    const lesson = await Lesson.getLessonBylessonTitle(lessonTitle);    
    res.status(200).json({ lesson: lesson });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getAllLessons = async (req, res) => {
  try {
    const items = await Lesson.getAll();
    if (!items) items = [];
    res.status(200).json({ lessons: items });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {    
    const { chapterId, lessonId } = req.params;
    await Chapter.removeLessonFromTheChapter(chapterId, lessonId);
    await Lesson.deleteItem(lessonId);
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};
