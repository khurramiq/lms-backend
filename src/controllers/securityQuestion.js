const SecurityQuestion = require("../models/securityQuestion");

exports.createSecurityQuestion = async (req, res) => {
  try {
    // const userId = req.token._id;           
    const securityQuestion = {
      question: req.body.question,      
    };

    const _securityQuestion = await SecurityQuestion.create(securityQuestion);    
  
    res.status(200).json({ securityQuestion: _securityQuestion });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.updateSecurityQuestion = async (req, res) => {
  try {
    const securityQuestionId = req.body._id;
    const _securityQuestion = await SecurityQuestion.updateById(securityQuestionId, req.body);
    res.status(200).json({ securityQuestion: _securityQuestion });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getAllSecurityQuestions = async (req, res) => {
  try {
    const items = await SecurityQuestion.getAll();
    if (!items) items = [];
    res.status(200).json({ securityQuestions: items });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.deleteSecurityQuestion = async (req, res) => {
  try {
    const { securityQuestionId } = req.params;    
    await SecurityQuestion.deleteItem(securityQuestionId);
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};
