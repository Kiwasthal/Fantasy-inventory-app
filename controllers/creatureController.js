const Creature = require('../models/creature');

exports.creature_list = (req, res, next) => {
  res.send('Not implemented : Creature list');
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
