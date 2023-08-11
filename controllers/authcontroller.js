import express from "express";
import User from "../models/user.js";
import { StatusCodes } from "http-status-codes";
import { badRequestError, unAuthenticated } from "../errors/index.js";

const register = async (req, res, next) => {
  // try {
  //   const user = await User.create(req.body);
  //   res.status(201).json({ user });
  // } catch (error) {
  //   //jb bhi error ho to isko call krdo, isse sidha errorHandler.js call hoge and it'll take care
  //   next(error);
  // }

  //to get rid of this try-catch we used express-async-errors package, it does all this on its owm

  const { name, password, email } = req.body;
  if (!name || !password || !email) {
    throw new badRequestError("Please provide all details");
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new badRequestError("Email already in use!");
  }

  const user = await User.create({ name, password, email });
  const token = user.createJWT();
  //statusCodes use krne se status codes yaad nhi rkhne pdege bs keyword do and it will give the corresponding status code
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      lastName: user.lastName,
      location: user.location,
      email: user.email,
    },
    token,
    location: user.location,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new badRequestError("Please provide all values");
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new unAuthenticated("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new unAuthenticated("Invalid Credentials");
  }
  const token = user.createJWT();
  user.password = undefined;
  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};
const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;
  if (!email || !name) {
    throw new badRequestError("Please provide all values");
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    token,
    location: user.location,
  });
};

export { register, login, updateUser };
