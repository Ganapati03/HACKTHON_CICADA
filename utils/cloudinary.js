import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage for resumes
const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mastersolis_uploads/resumes',
    resource_type: 'auto',
    allowed_formats: ['pdf', 'doc', 'docx'],
  },
});

// Configure storage for blog images
const blogImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mastersolis_uploads/blogs',
    resource_type: 'auto',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  },
});

// Configure storage for profile pictures
const profileImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mastersolis_uploads/profiles',
    resource_type: 'auto',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  },
});

// Configure storage for project images
const projectImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mastersolis_uploads/projects',
    resource_type: 'auto',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  },
});

// Create multer instances
export const resumeUpload = multer({ storage: resumeStorage });
export const blogImageUpload = multer({ storage: blogImageStorage });
export const profileImageUpload = multer({ storage: profileImageStorage });
export const projectImageUpload = multer({ storage: projectImageStorage });

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
};
