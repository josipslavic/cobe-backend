import multer from 'multer';

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB,
  },
  fileFilter: fileFilter,
});
