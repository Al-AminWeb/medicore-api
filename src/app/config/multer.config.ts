import {cloudinaryUpload} from "./cloudinary.config";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import multer from "multer";


const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params: async (req, file) => {
        try {
            console.log("Uploading file:", file.originalname);

            const result = {
                folder: "medicore/images",
                public_id: Date.now().toString(),
                resource_type: "auto"
            };


            return result;
        } catch (error) {
            console.log("PARAMS ERROR:", error);
            throw error;
        }
    }
});

export const multerUpload = multer({storage});