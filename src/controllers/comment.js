const Comment = require("../models/comment");

exports.createComment = async (req, res) => {
  try {
    // const userId = req.token._id;
    const comment = {
      ...req.body,
    };

    const _comment = await Comment.create(comment);
    const totalCount = await Comment.getTotalCount();

    res.status(200).json({ comment: _comment, totalCount: totalCount });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const { limit } = req.params;
    const comments = await Comment.getAll(parseInt(limit));
    const totalCount = await Comment.getTotalCount();
    if (!comments) comments = [];
    res.status(200).json({ comments: comments, totalCount: totalCount });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getLevel2Comments = async (req, res) => {
  try {
    const { parentId } = req.params;    
    const comments = await Comment.getAllByParentId(parentId);    
    const totalCount = await Comment.getTotalCount();
    if (!comments) comments = [];
    res.status(200).json({ comments: comments, totalCount: totalCount });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};
