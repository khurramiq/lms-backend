const Ad = require("../models/ad");

exports.createAd = async (req, res) => {
  try {
    let fImg = "";
    if (typeof req.files.image !== "undefined") {
      fImg = req.files.image[0].filename;
    }
    // const userId = req.token._id;       
    const ad = {
      ...req.body,
      url: fImg,
    };

    const _ad = await Ad.create(ad);    
  
    res.status(200).json({ ad: _ad });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.updateAd = async (req, res) => {
  try {
    const adId = req.body._id;
    const _ad = await Ad.updateById(adId, req.body);
    res.status(200).json({ ad: _ad });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.getAllAds = async (req, res) => {
  try {
    const ads = await Ad.getAll();
    if (!ads) ads = [];
    res.status(200).json({ ads: ads });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};

exports.deleteAd = async (req, res) => {
  try {
    const { adId } = req.params;    
    await Ad.deleteItem(adId);
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
};
