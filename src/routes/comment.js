const express = require("express");
const {
  createComment,  
  getAllComments,  
  getLevel2Comments
} = require("../controllers/comment");
const router = express.Router();

router.post(
  "/create",  
  createComment
);
router.get("/:limit", getAllComments);
router.get("/parentId/:parentId", getLevel2Comments);

module.exports = router;
