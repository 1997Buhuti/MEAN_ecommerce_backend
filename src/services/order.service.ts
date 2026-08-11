import { Order } from "../models/order";
import { OrderItem } from "../models/order-item";
import mongoose from "mongoose";

export const createOrder = async (orderData: any) => {
  const orderItemsIds = await Promise.all(
    orderData.orderItems.map(async (orderItem: any) => {
      const newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      const savedItem = await newOrderItem.save();
      return savedItem._id;
    })
  );

  const totalPrices = await Promise.all(
    orderItemsIds.map(async (orderItemId: mongoose.Types.ObjectId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate("product", "price");
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  const order = new Order({
    orderItems: orderItemsIds,
    shippingAddress1: orderData.shippingAddress1,
    shippingAddress2: orderData.shippingAddress2,
    city: orderData.city,
    zip: orderData.zip,
    country: orderData.country,
    phone: orderData.phone,
    status: orderData.status,
    totalPrice,
    user: orderData.user,
  });

  return await order.save();
};

export const updateOrder = async (id: string, status: string) => {
  return await Order.findByIdAndUpdate(id, { status }, { new: true });
};

export const getOrderById = async (id: string) => {
  return await Order.findById(id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });
};

export const getAllOrders = async () => {
  return await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });
};

export const deleteOrder = async (id: string) => {
  const order = await Order.findByIdAndDelete(id);
  if (order) {
    await Promise.all(
      order.orderItems.map(async (orderItemId: mongoose.Types.ObjectId) => {
        await OrderItem.findByIdAndDelete(orderItemId);
      })
    );
  }
  return order;
};

export const getTotalSales = async () => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);
  return totalSales.pop()?.totalsales || 0;
};

export const getOrderCount = async () => {
  return await Order.countDocuments();
};

export const getUserOrders = async (userId: string) => {
  return await Order.find({ user: userId })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 });
};
