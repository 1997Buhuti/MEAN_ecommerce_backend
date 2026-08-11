import mongoose, { Schema, model, models } from "mongoose";

export interface ICategory extends mongoose.Document {
  name: string;
  icon?: string;
  color?: string;
  id: string;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  color: {
    type: String,
  },
});

categorySchema.virtual("id").get(function () {
  return this._id.toString();
});

categorySchema.set("toJSON", {
  virtuals: true,
});

export const Category = models.Category || model<ICategory>("Category", categorySchema);
