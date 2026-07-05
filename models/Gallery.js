import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: 'General',
    },
    type: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
    },
    image: {
      type: String, // Base64 string
    },
    videoUrl: {
      type: String, // YouTube/Vimeo URL if type is 'video'
    },
  },
  { timestamps: true }
);

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
