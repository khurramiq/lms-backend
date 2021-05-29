const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adSchema = new Schema(
  {
    adPosition: { type: String, required: true, },
    adOrder: { type: Number, unique: true },    
    url: { type: String, required: true, },
    adPageURL: { type: String, required: true, },
    title: { type: String, required: true, },
    active: { type: Boolean, default: true},
    expirationDate: { type: Date },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    modifiedBy: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

adSchema.statics.getById = async (_id) => {
  const chapter = await Ad.findOne({ _id: mongoose.Types.ObjectId(_id) });
  return chapter;
};

adSchema.statics.getAll = async () => {
  const ads = await Ad.find({}).sort({ _id: 1 });
  return ads;
};

adSchema.statics.updateById = async (_id, body) => {
  const updatedAd = await Ad.findByIdAndUpdate(_id, body, {
    new: true,
  });
  return updatedAd;
};

adSchema.statics.deleteItem = async (_id) => {
  const deletedAd = await Ad.deleteOne({ _id: mongoose.Types.ObjectId(_id) });
  return deletedAd;
};

module.exports = Ad = mongoose.model(
  "ads",
  adSchema,
  "ads"
);
