import mongoose, { Schema, model, models } from "mongoose";

export interface IOrder extends mongoose.Document {
  orderItems: mongoose.Types.ObjectId[];
  shippingAddress1: string;
  shippingAddress2?: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  status: string;
  totalPrice?: number;
  user?: mongoose.Types.ObjectId;
  dateOrdered?: Date;
  id: string;
}

const orderSchema = new Schema<IOrder>({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ],
  shippingAddress1: {
    type: String,
    required: true,
  },
  shippingAddress2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  totalPrice: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  virtuals: true,
});

export const Order = models.Order || model<IOrder>("Order", orderSchema);
