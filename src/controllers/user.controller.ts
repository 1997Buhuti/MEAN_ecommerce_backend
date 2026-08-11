import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "The user with the given ID was not found." });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({ success: true, message: "the user is deleted!" });
  } catch (err) {
    next(err);
  }
};

export const getUserCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await userService.getUserCount();
    res.status(200).json({ success: true, data: { count } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.login(req.body.email, req.body.password);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
