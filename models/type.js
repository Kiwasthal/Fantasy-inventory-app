const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TypeSchema = new Schema({
  name: { type: string, required: true },
  description: { type: string },
});

TypeSchema.virtual('url').get(function () {
  return '/list/type' + this._id;
});

module.exports = mongoose.model('Type', TypeSchema);
