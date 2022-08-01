const Source = require('../models/source');
const Creature = require('../models/creature');
const async = require('async');

exports.source_list = (req, res, next) => {
  Source.find({}, 'name')
    .sort({ name: 1 })
    .exec((err, sources_list) => {
      if (err) next(err);
      res.render('source_list', {
        title: 'Sources',
        sources_list,
      });
    });
};

exports.source_detail = (req, res, next) => {
  async.parallel(
    {
      source(callback) {
        Source.findById(req.params.id).exec(callback);
      },
      source_creatures(callback) {
        Creature.find({ source: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.source == null) {
        let err = new Error('Source not found');
        err.status = 404;
        return next(err);
      }
      res.render('source_detail', {
        title: 'Source',
        source: results.source,
        source_creatures: results.source_creatures,
      });
    }
  );
};

exports.source_create_get = (req, res, next) => {
  res.send('Not implemented : Source create Get');
};

exports.source_create_post = (req, res, next) => {
  res.send('Not implemented : Source create Post');
};

exports.source_delete_get = (req, res, next) => {
  res.send('Not implemented : Source delete Get');
};

exports.source_delete_post = (req, res, next) => {
  res.send('Not implemented : Source delete Post');
};

exports.source_update_get = (req, res, next) => {
  res.send('Not implemented : Source update Get');
};

exports.source_update_post = (req, res, next) => {
  res.send('Not implemented : Source update Post');
};
