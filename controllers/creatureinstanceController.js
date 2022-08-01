const CreatureInstance = require('../models/creatureinstance');
const multer = require('multer');
const { creatureinstancestorage, checkFileType } = require('../utils/multer');
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
// CreatureInstance.findById(req.params.id)
//   .populate('creature')
//   .exec((err, creatureinstance) => {
//     if (err) return next(err);
//     if (creatureinstance == null) {
//       let err = new Error('Creature instance not found');
//       err.status = 404;
//       return next(err);
//     }
//     res.render('creatureinstance_detail', {
//       title: `${creatureinstance.name}`,
//       creatureinstance,
//     });
//   });

exports.creatureinstance_create_get = (req, res, next) => {
  res.send('Not implemented : CreatureInstance create Get');
};

exports.creatureinstance_create_post = (req, res, next) => {
  res.send('Not implemented : CreatureInstance create Post');
};

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
