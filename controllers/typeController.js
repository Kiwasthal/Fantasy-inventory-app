const Type = require('../models/type');
const Creature = require('../models/creature');
const async = require('async');
const multer = require('multer');
const { typestorage, checkFileType } = require('../utils/multer');
const { body, checkSchema, validationResult } = require('express-validator');

const upload = multer({
  storage: typestorage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

exports.type_list = (req, res, next) => {
  Type.find({}, 'name filepath')
    .sort({ name: 1 })
    .exec((err, types_list) => {
      if (err) next(err);
      res.render('type_list', {
        title: 'Types',
        types_list,
      });
    });
};

exports.type_detail = (req, res, next) => {
  async.parallel(
    {
      type(callback) {
        Type.findById(req.params.id).exec(callback);
      },
      type_creatures(callback) {
        Creature.find({ type: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.type == null) {
        let err = new Error('Source not found');
        err.status = 404;
        return next(err);
      }
      res.render('type_detail', {
        title: 'Type',
        type: results.type,
        type_creatures: results.type_creatures,
      });
    }
  );
};

exports.type_create_get = (req, res, next) => {
  res.render('type_form', {
    title: 'Create Type',
  });
};

exports.type_create_post = [
  upload.single('image'),
  body('name', 'Type Name is required').trim().isLength({ min: 1 }).escape(),
  body('description', 'Type Description is required')
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
    let type = new Type({
      name: req.body.name,
      description: req.body.description,
      filepath: req.file?.filename,
    });
    if (!errors.isEmpty()) {
      res.render('type_form', {
        title: 'Create Type',
        type,
        errors: errors.array(),
      });
      return;
    } else {
      Type.findOne({
        name: req.body.name,
      }).exec((err, found_source) => {
        if (err) return next(err);
        if (found_source) res.redirect(found_source.url);
        else {
          type.save(err => {
            if (err) return next(err);
            res.redirect(type.url);
          });
        }
      });
    }
  },
];

exports.type_delete_get = (req, res, next) => {
  res.send('Not implemented: Type delete Get');
};

exports.type_delete__post = (req, res, next) => {
  res.send('Not implemented: Type delete Post');
};

exports.type_update_get = (req, res, next) => {
  res.send('Not implemented : Type update Get');
};

exports.type_update_post = (req, res, next) => {
  res.send('Not implemented : Type update Post');
};
