const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const imageFilter = function(req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = 'Image must be of type jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF!';
      return cb(new Error('Image must be of type jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF!'), false);
  }
  cb(null, true);
};

const photoUpload = (req, res) => {
  // 'profile_pic' is the name of our file input field in the HTML form
  let upload = multer({ storage: storage, fileFilter: imageFilter }).single('photoFile');

  upload(req, res, function(err) {
      if (req.fileValidationError) {
          return res.send({error: req.fileValidationError});
      }
      else if (!req.file) {
          return res.send({error: 'Please select an image to upload'});
      }
      else if (err instanceof multer.MulterError) {
          return res.send({error: err});
      }
      else if (err) {
          return res.send({error: err});
      }

      // Display uploaded image for user validation
      res.send({photoPath: req.file.path});
  });
};

exports.photoUpload = photoUpload