const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CreatureSchema = new Schema({
  name: { type: string, required: true, maxLength: 20 },
  history: { type: string, required: true },
  notable_creatures: [{ type: string }],
  size: {
    type: string,
    required: true,
    enum: ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'],
    default: 'Medium',
  },
  type: { type: Schema.Types.ObjectId, ref: 'Type', required: true },
  source: [{ type: Schema.Types.ObjectId, ref: 'Source', required: true }],
});

CreatureSchema.virtual('url').get(function () {
  return '/list/creature/' + this._id;
});

module.exports = mongoose.model('Creature', CreatureSchema);
