const CreatureInstance = require('../models/creatureinstance');
const multer = require('multer');
const { storage, checkFileType } = require('../utils/multer');

//Init upload
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('myImage'); //input name! add enctype 'mutipart/form-data' to my form in view

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
  res.send('Not implemented  : CreatureInstance detail:' + req.params.id);
};

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
