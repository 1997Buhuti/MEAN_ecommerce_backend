import { Request, Response, NextFunction } from "express";
import * as orderService from "../services/order.service";

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.updateOrder(req.params.id, req.body.status);
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.deleteOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "order not found!" });
    }
    res.status(200).json({ success: true, message: "the order is deleted!" });
  } catch (err) {
    next(err);
  }
};

export const getTotalSales = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalSales = await orderService.getTotalSales();
    if (!totalSales) {
      return res.status(400).json({ success: false, message: "The order sales cannot be generated" });
    }
    res.status(200).json({ success: true, data: { totalsales: totalSales } });
  } catch (err) {
    next(err);
  }
};

export const getOrderCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await orderService.getOrderCount();
    res.status(200).json({ success: true, data: { orderCount: count } });
  } catch (err) {
    next(err);
  }
};

export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.getUserOrders(req.params.userid);
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};
