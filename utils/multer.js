const multer = require('multer');
const path = require('path');

const creaturestorage = multer.diskStorage({
  destination: './public/uploads/creatures/',
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const sourcestorage = multer.diskStorage({
  destination: './public/uploads/sources/',
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const checkFileType = (file, cb) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|svg/;
  // check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) return cb(null, true);
  else cb('You can only upload images');
};

module.exports = { creaturestorage, sourcestorage, checkFileType };
