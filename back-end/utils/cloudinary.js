import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.RAMANADOTM0342_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.RAMANADOTM0342_CLOUDINARY_API_KEY,
    api_secret: process.env.RAMANADOTM0342_CLOUDINARY_API_SECRET,
});

export default cloudinary;