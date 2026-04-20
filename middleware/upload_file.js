import multer from "multer";
import { ALLOWED_EXTENSIONS as allowedExtensions } from "../common/index.js";
import path from "path";
import { fileURLToPath } from "url";
import { allFiles } from "../common/index.js";
import { mkdir } from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "..", "files");

const maxFileSize = 250 * 1024;

try {
  await mkdir(uploadDir, { recursive: true });
} catch (err) {
  console.error("Error creating folder:", err);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const now = new Date();
    const seconds = now.getSeconds();
    const uniqueSuffix = `${seconds}_${Math.round(Math.random() * 10000)}`;
    const { name, ext } = path.parse(file.originalname);
    cb(null, `${name}_${uniqueSuffix}_${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file extension. Allowed: ${allowedExtensions.join(", ")}`,
      ),
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSize,
  },
});

export const uploadFileMiddleware = (req, res, next) => {
  upload.array("file")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        const message = `File size exceeds the maximum limit of ${maxFileSize / 1024}KB!`;
        return res.render("result", { status: "error", message });
      }
      return res.render("result", { status: "error", message: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.render("result", {
        status: "error",
        message: "No files were selected!",
      });
    }

    const fileNames = req.files.map((f) => f.originalname);

    req.files.forEach(({ originalname, size, filename, destination }) => {
      const date = new Date();
      allFiles.push({
        fileName: filename,
        originalName: originalname,
        size: Math.floor(size / 1024),
        uploadedAt: date.toDateString(),
      });
    });

    res.render("result", {
      status: "success",
      fileName: fileNames.join(", "),
    });
  });
};
