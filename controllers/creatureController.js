const Creature = require('../models/creature');
const Type = require('../models/type');
const Source = require('../models/source');
const CreatureInstance = require('../models/creatureinstance');

const async = require('async');

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
              console.log(prev);
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
  Creature.find({}, 'name type source')
    .sort({ name: 1 })
    .populate('type')
    .populate('source')
    .exec((err, creature_list) => {
      res.render('creature_list', { title: 'Creature List', creature_list });
    });
};

exports.creature_detail = (req, res, next) => {
  res.send('Not implemented : Creature detail' + req.params.id);
};

exports.creature_create_get = (req, res, next) => {
  res.send('Not implemented : Creature Get');
};

exports.creature_create_post = (req, res, next) => {
  res.send('Not implemented : Creature Post');
};

exports.creature_delete_get = (req, res, next) => {
  res.send('Not implemented : Creature Get');
};

exports.creature_delete_post = (req, res, next) => {
  res.send('Not implemented : Creature Post');
};

exports.creature_update_get = (req, res, next) => {
  res.send('Not implemented : Creature update Get');
};

exports.creature_update_post = (req, res, next) => {
  res.send('Not implemented : Creature update POst');
};
