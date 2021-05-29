const express = require("express");
const mongoose = require("mongoose");
const env = require("dotenv");
const app = express();
const path = require("path");
const cors = require("cors");
let bodyParser = require('body-parser');

// routes
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");
const chapterRoutes = require("./routes/chapter");
const lessonRoutes = require("./routes/lesson");
const quizRoutes = require("./routes/quiz");
const adRoutes = require("./routes/ad");
const commentRoutes = require("./routes/comment");
const courseCommentRoutes = require("./routes/courseComment");
const lessonCommentRoutes = require("./routes/lessonComment");
const securityQuestionRoutes = require("./routes/securityQuestion");

// environment variables
env.config();

// mongodb connection
mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) throw err;
    console.log("MongoDB connection is established");
  }
);

// greeting route
app.get("/", (req, res) => {
  res.send('Hello, to lms API')
});

// middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({extended: true}));
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use("/api/account", authRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/chapter", chapterRoutes);
app.use("/api/lesson", lessonRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/ad", adRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/courseComment", courseCommentRoutes);
app.use("/api/lessonComment", lessonCommentRoutes);
app.use("/api/securityQuestion", securityQuestionRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
