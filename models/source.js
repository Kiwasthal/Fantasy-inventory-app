const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SourceSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 30 },
  description: { type: string },
});

SourceSchema.virtual('url').get(function () {
  return '/list/source/' + this.id;
});

module.exports = mongoose.model('Source', SourceSchema);
