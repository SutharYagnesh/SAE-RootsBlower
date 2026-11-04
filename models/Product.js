import mongoose from 'mongoose';

const ProductOfferSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 10000,
      max: 200000,
    },
  },
  { _id: false }
);

const ProductReviewSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true,
    },
    ratingValue: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviewBody: {
      type: String,
      required: true,
      trim: true,
    },
    datePublished: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
);

const ProductDocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    previousSlugs: {
      type: [String],
      default: [],
    },
    sourceId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    sourceUrl: {
      type: String,
      trim: true,
    },
    sourceCategory: {
      type: String,
      trim: true,
    },
    sourceCategories: [
      {
        type: String,
        trim: true,
      },
    ],
    sourcePrice: {
      type: String,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    longDescription: {
      type: String,
    },
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    features: [
      {
        type: String,
      },
    ],
    applications: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String, // Base64 encoded string
      },
    ],
    documents: {
      type: [ProductDocumentSchema],
      default: [],
    },
    offers: {
      type: [ProductOfferSchema],
      default: [],
    },
    reviews: {
      type: [ProductReviewSchema],
      default: [],
    },
    seoTitle: {
      type: String,
    },
    seoDescription: {
      type: String,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
