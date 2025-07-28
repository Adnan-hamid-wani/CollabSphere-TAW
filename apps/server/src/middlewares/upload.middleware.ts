import multer from "multer";
import path from "path";

// Set storage strategy
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to save uploaded files
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s/g, "_");
    cb(null, `${baseName}_${Date.now()}${ext}`);
  },
});

// Export the upload middleware
export const upload = multer({ storage });
