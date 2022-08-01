const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CreatureInstanceSchema = new Schema({
  creature: { type: Schema.Types.ObjectId, ref: 'Creature', required: true },
  name: { type: String, required: true },
  history: { type: String, required: true },
  filepath: { type: String },
});

CreatureInstanceSchema.virtual('url').get(function () {
  return '/archieve/creatureinstance/' + this._id;
});

module.exports = mongoose.model('Creatureinstance', CreatureInstanceSchema);
