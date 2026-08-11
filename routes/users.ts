import { Router, Request, Response } from "express";
import { User } from "../models/user";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface UserRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  isAdmin?: boolean;
  street?: string;
  apartment?: string;
  zip?: string;
  city?: string;
  country?: string;
}

const router = Router();

router.get(`/`, async (req: Request, res: Response) => {
  const userList = await User.find().select("-passwordHash");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.get(`:id`, async (req: Request<{ id: string }>, res: Response) => {
  const user = await User.findById(req.params.id).select("-passwordHash");

  if (!user) {
    res.status(500).json({ message: "The user with the given ID was not found." });
  }
  res.status(200).send(user);
});

router.post(`/`, async (req: Request<{}, {}, UserRequest>, res: Response) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
});

router.put(`/:id`, async (req: Request<{ id: string }, {}, UserRequest>, res: Response) => {
  const userExist = await User.findById(req.params.id);
  let newPassword: string;
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    newPassword = userExist.passwordHash;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: newPassword,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    },
    { new: true }
  );

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
});

router.post(`/login`, async (req: Request<{}, {}, { email: string; password: string }>, res: Response) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret || "";
  console.log(secret);
  if (!user) {
    return res.status(400).send("The user not found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "1d" }
    );

    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send("password is wrong!");
  }
});

router.post(`/register`, async (req: Request<{}, {}, UserRequest>, res: Response) => {
  console.log("Hi");
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();
  console.log(user);
  if (!user) return res.status(400).send("the user cannot be created!");
  res.send(user);
});

router.delete(`/:id`, (req: Request, res: Response) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res.status(200).json({ success: true, message: "the user is deleted!" });
      } else {
        return res.status(404).json({ success: false, message: "user not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.get(`/get/count`, async (req: Request, res: Response) => {
  User.countDocuments().then((count) => {
    if (count) {
      return res.status(200).json({ success: true, message: `There are ${count} users` });
    } else {
      return res.status(404).json({
        success: false,
        message: "Count failed! Please try again...",
      });
    }
  });
});

export default router;
