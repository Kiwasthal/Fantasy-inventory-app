const Creature = require('../models/creature');
const Type = require('../models/type');
const Source = require('../models/source');
const CreatureInstance = require('../models/creatureinstance');
const multer = require('multer');
const { creaturestorage, checkFileType } = require('../utils/multer');
const { body, checkSchema, validationResult } = require('express-validator');
const async = require('async');
const fs = require('fs');
//Init upload
const upload = multer({
  storage: creaturestorage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

exports.index = (req, res, next) => {
  async.parallel(
    {
      creatureCount(callback) {
        Creature.countDocuments({}, callback);
      },
      creatureInstanceCount(callback) {
        CreatureInstance.countDocuments({}, callback);
      },
      typeCount(callback) {
        Type.countDocuments({}, callback);
      },
      sourceCount(callback) {
        Source.countDocuments({}, callback);
      },
      display(callback) {
        async.waterfall(
          [
            function (cb) {
              Creature.aggregate([{ $sample: { size: 3 } }]).exec(cb);
            },
            function (prev, cb) {
              Creature.populate(prev, { path: 'source type' }, cb);
            },
          ],
          function (err, results) {
            callback(err, results);
          }
        );
      },
    },
    function (err, results) {
      res.render('index', {
        title: 'Home',
        err,
        data: results,
      });
    }
  );
};

exports.creature_list = (req, res, next) => {
  Creature.find({}, 'name type source filepath')
    .sort({ name: 1 })
    .populate('type')
    .populate('source')
    .exec((err, creature_list) => {
      if (err) next(err);
      res.render('creature_list', { title: 'Creature List', creature_list });
    });
};

exports.creature_detail = (req, res, next) => {
  async.parallel(
    {
      creature(callback) {
        Creature.findById(req.params.id)
          .populate('source')
          .populate('type')
          .exec(callback);
      },
      creature_instance(callback) {
        CreatureInstance.find({ creature: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) next(err);
      if (results.creature == null) {
        let err = new Error('Creature not found');
        err.status = 404;
        return next(err);
      }
      res.render('creature_detail', {
        title: results.creature.name,
        creature: results.creature,
        creature_instances: results.creature_instance,
      });
    }
  );
};

exports.creature_create_get = (req, res, next) => {
  async.parallel(
    {
      types(callback) {
        Type.find(callback);
      },
      sources(callback) {
        Source.find(callback);
      },
    },
    (err, results) => {
      if (err) next(err);
      res.render('creature_form', {
        title: 'Create Creature',
        sources: results.sources,
        types: results.types,
      });
    }
  );
};

exports.creature_create_post = [
  upload.single('image'),
  (req, res, next) => {
    if (!Array.isArray(req.body.source)) {
      if (typeof req.body.source === 'undefined') req.body.source = [];
      else req.body.source[req.body.source];
    }
    next();
  },

  body('name', 'Creature name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('history', 'History field must be specified')
    .trim()
    .isLength({ min: 15 })
    .withMessage('Include a more detailed history for the creature')
    .escape(),
  body('size', 'Creature size must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('type', "Creature's type must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('source', "Creature's source must be specified")
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

    let creature = new Creature({
      name: req.body.name,
      history: req.body.history,
      size: req.body.size,
      type: req.body.type,
      source: req.body.source,
      filepath: req.file?.filename,
    });
    if (!errors.isEmpty()) {
      async.parallel(
        {
          types(callback) {
            Type.find(callback);
          },
          sources(callback) {
            Source.find(callback);
          },
        },
        (err, results) => {
          if (err) return next(err);

          res.render('creature_form', {
            title: 'Create Creature',
            sources: results.sources,
            types: results.types,
            creature,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      creature.save(err => {
        if (err) return next(err);
        res.redirect(creature.url);
      });
    }
  },
];

exports.creature_delete_get = (req, res, next) => {
  res.send('Not implemented : Creature Get');
};

exports.creature_delete_post = (req, res, next) => {
  res.send('Not implemented : Creature Post');
};

exports.creature_update_get = (req, res, next) => {
  async.parallel(
    {
      creature(callback) {
        Creature.findById(req.params.id)
          .populate('source')
          .populate('type')
          .exec(callback);
      },
      sources(callback) {
        Source.find(callback);
      },
      types(callback) {
        Type.find(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.creature == null) {
        let err = new Error('Creature not found');
        err.status = 404;
        return next(err);
      }
      for (let i = 0; i < results.sources.length; i++) {
        for (let y = 0; y < results.creature.source.length; y++) {
          if (
            results.sources[i]._id.toString() ===
            results.creature.source[y]._id.toString()
          )
            results.sources[i].checked = 'true';
        }
      }
      res.render('creature_form', {
        title: 'Update Creatures',
        sources: results.sources,
        types: results.types,
        creature: results.creature,
      });
    }
  );
};

exports.creature_update_post = [
  upload.single('image'),
  (req, res, next) => {
    if (!Array.isArray(req.body.source)) {
      if (typeof req.body.source === 'undefined') req.body.source = [];
      else req.body.source = [req.body.source];
    }
    next();
  },
  body('name', 'Creature name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('history', 'History field must be specified')
    .trim()
    .isLength({ min: 15 })
    .withMessage('Include a more detailed history for the creature')
    .escape(),
  body('size', 'Creature size must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('type', "Creature's type must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('source', "Creature's source must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    let creature = new Creature({
      name: req.body.name,
      history: req.body.history,
      source: req.body.source,
      type: req.body.type,
      size: req.body.size,
      filepath:
        typeof req.file?.filename === 'undefined'
          ? req.body.previmage
          : req.file.filename,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      async.parallel(
        {
          sources(callback) {
            Source.find(callback);
          },
          types(callback) {
            Type.find(callback);
          },
        },
        (err, results) => {
          res.render('creature_form', {
            title: 'Update Creature',
            sources: results.sources,
            types: results.types,
            creature,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      Creature.findByIdAndUpdate(
        req.params.id,
        creature,
        {},
        function (err, thecreature) {
          if (err) return next(err);
          res.redirect(thecreature.url);
        }
      );
    }
  },
];
