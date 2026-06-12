import multer from "multer";
import path from "path";
import fs from "fs";

// pastikan folder ada
const createFolderIfNotExists = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const productPath = "uploads/products";
const certificatePath = "uploads/certificates";
const ktpPath = "uploads/ktp"; // 👈 TAMBAHAN BARU

createFolderIfNotExists(productPath);
createFolderIfNotExists(certificatePath);
createFolderIfNotExists(ktpPath); // 👈 TAMBAHAN BARU

// storage khusus product image
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "product_image") {
      cb(null, productPath);
    } else if (file.fieldname === "halal_certificate") {
      cb(null, certificatePath);
    } else if (file.fieldname === "ktp_photo") {
      // 👈 TAMBAHAN SELLER REGISTER
      cb(null, ktpPath);
    } else {
      cb(new Error("Unknown field"), "");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: productStorage });
