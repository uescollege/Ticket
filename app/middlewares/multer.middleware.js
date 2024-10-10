const { mkdirSync, existsSync } = require("fs");
const path = require("path");
const multer = require("multer");

const storage = multer({
  destination: function (req, file, cb) {
    cb(null, "/tmp/my-uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

/**
 * Avatar storage
 */
const avatarDisk = storage({
  destination: function (req, file, cb) {
    // create a folder if not exists
    const avatar_path = path.resolve(__dirname, "../../uploads/avatars");
    if (!existsSync(avatar_path)) {
      mkdirSync(avatar_path, { recursive: true });
    }
    return cb(null, avatar_path);
  },
  filename: function (req, file, cb) {
    // create a random name for the file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    if (file.mimetype.match(/image\/*/)) {
      file.mimetype = 'image/webp';
    }
    const ext = file.mimetype.split('/')[1];
    req.body.thumbnail = file.fieldname + '-' + uniqueSuffix + '.' + ext;
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
  }
});

const imageDisk = storage({
  destination: function (req, file, cb) {
    const image_path = path.resolve(__dirname, '../../uploads/images');
    if (!existsSync(image_path)) {
      mkdirSync(image_path, {recursive: true});
    }
    cb(null, image_path);
  },
  filename: function (req, file, cb) {
    // create a random name for the file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    if (file.mimetype.match(/image\/*/)) {
      file.mimetype = 'image/webp';
    }
    const ext = file.mimetype.split('/')[1];
    req.body.image = file.fieldname + '-' + uniqueSuffix + '.' + ext;
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
  }
});

const thumbnailDisk = storage({
  destination: function (req, file, cb) {
    // create a folder if not exists
    const thumbnail_path = path.resolve(__dirname, '../../uploads/thumbnails');
    if (!existsSync(thumbnail_path)) {
      mkdirSync(thumbnail_path, {recursive: true});
    }

    cb(null, thumbnail_path);
  },
  filename: function (req, file, cb) {
    // create a random name for the file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    if (file.mimetype.match(/image\/*/)) {
      file.mimetype = 'image/webp';
    }
    const ext = file.mimetype.split('/')[1];
    req.body.thumbnail = file.fieldname + '-' + uniqueSuffix + '.' + ext;
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
  }
});

const upload = multer({ storage: storage });

/**
 * Avatar upload
 */
const avatarUpload = multer({ 
  storage: avatarDisk,
  fileFilter: function (req, file, cb) {
    // filter image onlue
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp|WEBP)$/)) {
      return cb(new Error("Only image are allowed."), false);
    }
    return cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 25 // 25MB
  }
});

/**
 * Image upload
 */
const imageUpload = multer({ 
  storage: imageDisk,
  fileFilter: function (req, file, cb) {
    // filter image onlue
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp|WEBP)$/)) {
      return cb(new Error('Only image are allowed.'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 25 // 25MB
  }
});

/**
 * Thumbnail upload
 */
const thumbnailUpload = multer({ 
  storage: thumbnailDisk,
  fileFilter: function (req, file, cb) {
    // filter image onlue
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp|WEBP)$/)) {
      return cb(new Error('Only image are allowed.'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 25 // 25MB
  }
});

module.exports = {
  upload,
  avatarUpload,
  imageUpload,
  thumbnailUpload,
};
