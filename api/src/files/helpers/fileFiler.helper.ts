export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file) return callback(new Error('No file provided'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const allowedTypes = ['png', 'jpeg', 'jpg', 'gifs'];

  if (allowedTypes.includes(fileExtension)) return callback(null, true);

  callback(null, false);
};
