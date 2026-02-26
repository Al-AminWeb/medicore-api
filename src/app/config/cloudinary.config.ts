// src/config/cloudinary.config.ts
import { v2 as cloudinary } from 'cloudinary';
import { envVars } from './env';

let isConfigured = false;

export const getCloudinary = () => {
    if (!isConfigured) {
        cloudinary.config({
            cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
            api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
            api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
            secure: true,
        });

        const config = cloudinary.config();

        if (!config.api_key || !config.api_secret || !config.cloud_name) {
            throw new Error('Cloudinary API credentials are missing');
        }

        isConfigured = true;
    }

    return cloudinary;
};

export const cloudinaryUpload = getCloudinary();
export { cloudinary };