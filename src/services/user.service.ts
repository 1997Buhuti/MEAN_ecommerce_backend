import { env } from "../config/env";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

export const createUser = async (userData: any) => {
  const passwordHash = await bcrypt.hash(userData.password, 10);
  const user = new User({
    name: userData.name,
    email: userData.email,
    passwordHash,
    phone: userData.phone,
    isAdmin: userData.isAdmin,
    street: userData.street,
    apartment: userData.apartment,
    zip: userData.zip,
    city: userData.city,
    country: userData.country,
  });
  return await user.save();
};

export const updateUser = async (id: string, userData: any) => {
  if (userData.password) {
    userData.passwordHash = await bcrypt.hash(userData.password, 10);
    delete userData.password;
  }
  return await User.findByIdAndUpdate(id, userData, { new: true });
};

export const getUserById = async (id: string) => {
  return await User.findById(id).select("-passwordHash");
};

export const getAllUsers = async () => {
  return await User.find().select("-passwordHash");
};

export const deleteUser = async (id: string) => {
  return await User.findByIdAndDelete(id);
};

export const getUserCount = async () => {
  return await User.countDocuments();
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("The user not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error("password is wrong!");
  }

  const secret = env.SECRET;
  const token = jwt.sign(
    {
      userId: user.id,
      isAdmin: user.isAdmin,
    },
    secret,
    { expiresIn: "1d" }
  );

  return { user: user.email, token };
};
