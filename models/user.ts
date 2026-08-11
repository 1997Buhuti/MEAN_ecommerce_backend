import mongoose, { Schema, model, models } from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  isAdmin?: boolean;
  street?: string;
  apartment?: string;
  zip?: string;
  city?: string;
  country?: string;
  id: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  street: {
    type: String,
    default: "",
  },
  apartment: {
    type: String,
    default: "",
  },
  zip: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

export const User = models.User || model<IUser>("User", userSchema);
export { userSchema };
