const Source = require('../models/source');
const Creature = require('../models/creature');
const async = require('async');
const multer = require('multer');
const { sourcestorage, checkFileType } = require('../utils/multer');
const { body, checkSchema, validationResult } = require('express-validator');

const upload = multer({
  storage: sourcestorage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

exports.source_list = (req, res, next) => {
  Source.find({}, 'name filepath')
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
  res.render('source_form', { title: 'Create Source' });
};

exports.source_create_post = [
  upload.single('image'),
  body('name', 'Source Name is required').trim().isLength({ min: 1 }).escape(),
  body('description', 'Source Description is required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  checkSchema({
    image: {
      custom: {
        options: (value, { req }) => !!req.file,
        errorMessage: 'You need to upload a source image (jpg, png, gif)',
      },
    },
  }),
  (req, res, next) => {
    let errors = validationResult(req);
    let source = new Source({
      name: req.body.name,
      description: req.body.description,
      filepath: req.file?.filename,
    });
    if (!errors.isEmpty()) {
      res.render('source_form', {
        title: 'Create Source',
        source,
        errors: errors.array(),
      });
      return;
    } else {
      Source.findOne({
        name: req.body.name,
      }).exec((err, found_source) => {
        if (err) return next(err);
        if (found_source) res.redirect(found_source.url);
        else {
          source.save(err => {
            if (err) return next(err);
            res.redirect(source.url);
          });
        }
      });
    }
  },
];

exports.source_delete_get = (req, res, next) => {
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
      if (results.source == null) res.redirect('/archieve/sources');
      res.render('source_delete', {
        title: 'Delete Source',
        source: results.source,
        source_creatures: results.source_creatures,
      });
      return;
    }
  );
};

exports.source_delete_post = (req, res, next) => {
  async.parallel(
    {
      source(callback) {
        Source.findById(req.body.sourceid).exec(callback);
      },
      source_creatures(callback) {
        Creature.find({ source: req.body.sourceid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.source_creatures.length > 0) {
        res.render('source_delete', {
          title: 'Delete Source',
          source: results.source,
          source_creatures: results.source_creatures,
        });
      } else {
        Source.findByIdAndRemove(req.body.sourceid, function deleteSource(err) {
          if (err) return next(err);
          res.redirect('/archieve/sources');
        });
      }
    }
  );
};

exports.source_update_get = (req, res, next) => {
  res.send('Not implemented : Source update Get');
};

exports.source_update_post = (req, res, next) => {
  res.send('Not implemented : Source update Post');
};
