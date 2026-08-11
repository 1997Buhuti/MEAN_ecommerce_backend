import mongoose, { Schema, model, models } from "mongoose";

export interface IOrderItem extends mongoose.Document {
  quantity: number;
  product?: mongoose.Types.ObjectId;
  id: string;
}

const orderItemSchema = new Schema<IOrderItem>({
  quantity: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

orderItemSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderItemSchema.set("toJSON", {
  virtuals: true,
});

export const OrderItem = models.OrderItem || model<IOrderItem>("OrderItem", orderItemSchema);
