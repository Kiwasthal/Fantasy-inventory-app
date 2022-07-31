const Source = require('../models/source');

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
  res.send('Not implemented : Source Detail' + req.params.id);
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
