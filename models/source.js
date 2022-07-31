const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SourceSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 30 },
  description: { type: String },
});

SourceSchema.virtual('url').get(function () {
  return '/archieve/source/' + this.id;
});

module.exports = mongoose.model('Source', SourceSchema);
