const express = require("express");
const {
  createAd,
  deleteAd,
  getAllAds,
  updateAd,
} = require("../controllers/ad");
const router = express.Router();

const multer = require("multer");
const shortid = require("shortid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const position = req.body.adPosition;
    cb(
      null,
      path.join(path.dirname(__dirname), `uploads/advertisements/${position}`)
    );
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

router.post(
  "/create",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  createAd
);
router.get("/", getAllAds);
router.post("/update", updateAd);
router.delete("/adId/:adId", deleteAd);

module.exports = router;
