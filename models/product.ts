import mongoose, { Schema, model, models } from "mongoose";

export interface IProduct extends mongoose.Document {
  name: string;
  description: string;
  richDescription?: string;
  image?: string[];
  brand: string;
  price: number;
  category: mongoose.Types.ObjectId;
  countInStock: number;
  rating?: number;
  numReviews?: number;
  isFeatured?: boolean;
  dateCreated?: Date;
  id: string;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  richDescription: {
    type: String,
    default: "",
  },
  image: [
    {
      type: String,
    },
  ],
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 1000,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

productSchema.virtual("id").get(function () {
  return this._id.toString();
});

productSchema.set("toJSON", {
  virtuals: true
});

export const Product = models.Product || model<IProduct>("Product", productSchema);
