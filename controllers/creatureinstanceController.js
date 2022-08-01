const CreatureInstance = require('../models/creatureinstance');
const Creature = require('../models/creature');
const multer = require('multer');
const { creatureinstancestorage, checkFileType } = require('../utils/multer');
const { body, checkSchema, validationResult } = require('express-validator');
const async = require('async');

const upload = multer({
  storage: creatureinstancestorage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

exports.creatureinstance_list = (req, res, next) => {
  CreatureInstance.find()
    .populate('creature')
    .exec((err, creatureintances_list) => {
      if (err) next(err);
      res.render('creatureinstance_list', {
        title: 'Creature Instances',
        creatureintances_list,
      });
    });
};

exports.creatureinstance_detail = (req, res, next) => {
  async.parallel(
    {
      creatureinstance(callback) {
        CreatureInstance.findById(req.params.id)
          .populate('creature')
          .exec(callback);
      },
      display(callback) {
        async.waterfall(
          [
            function (cb) {
              CreatureInstance.aggregate([{ $sample: { size: 3 } }]).exec(cb);
            },
            function (prev, cb) {
              CreatureInstance.populate(prev, { path: 'creature' }, cb);
            },
          ],
          function (err, results) {
            callback(err, results);
          }
        );
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.creatureinstance == null) {
        let err = new Error('Creature instance not found');
        err.status = 404;
        return next(err);
      }
      res.render('creatureinstance_detail', {
        title: `${results.creatureinstance.name}`,
        creatureinstance: results.creatureinstance,
        instance_list: results.display,
      });
    }
  );
};

exports.creatureinstance_create_get = (req, res, next) => {
  Creature.find().exec((err, creatures_list) => {
    if (err) return next(err);
    res.render('creatureinstance_form', {
      title: 'Create Creature Instance',
      creatures_list,
    });
  });
};

exports.creatureinstance_create_post = [
  upload.single('image'),
  body('name', 'Creature name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('history', 'History field must be specified')
    .trim()
    .isLength({ min: 15 })
    .withMessage('Include a more detailed history for the creature')
    .escape(),
  body('creature', "Creature's family must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  checkSchema({
    image: {
      custom: {
        options: (value, { req }) => !!req.file,
        errorMessage: 'You need to upload a creature image (jpg, png, svg)',
      },
    },
  }),

  (req, res, next) => {
    let errors = validationResult(req);

    let creatureinstance = new CreatureInstance({
      name: req.body.name,
      history: req.body.history,
      creature: req.body.creature,
      filepath: req.file?.filename,
    });
    if (!errors.isEmpty()) {
      Creature.find().exec((err, creatures_list) => {
        if (err) return next(err);
        res.render('creatureinstance_form', {
          title: 'Create Creature Instance',
          creatures_list,
          creatureinstance,
          errors: errors.array(),
        });
      });
    } else {
      creatureinstance.save(err => {
        if (err) return next(err);
        res.redirect(creatureinstance.url);
      });
    }
  },
];

exports.creatureinstance_delete_get = (req, res, next) => {
  res.send('Not implemented : CreatureInstace delete Get');
};

exports.creatureinstance_delete_post = (req, res, next) => {
  res.send('Not implemented : CreatureInstance delete Post');
};

exports.creatureinstance_update_get = (req, res, next) => {
  res.send('Not implemented : CreatureInstance update Get');
};

exports.creatureinstance_update_post = (req, res, next) => {
  res.send('Not implemented : CreatureInstance update Post');
};
